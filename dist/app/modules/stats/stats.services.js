"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
const mongoose_1 = require("mongoose");
const bookings_model_1 = require("../bookings/bookings.model");
const host_model_1 = require("../host/host.model");
const event_model_1 = require("../event/event.model");
const today = new Date();
today.setHours(0, 0, 0, 0);
const getUserStats = async (userId) => {
    const totalParticipatesInEvent = await bookings_model_1.Bookings.find({
        user: userId,
    }).countDocuments();
    const upcomingEventCount = await bookings_model_1.Bookings.aggregate([
        {
            $match: {
                user: userId,
            },
        },
        {
            $lookup: {
                from: "events",
                localField: "event",
                foreignField: "_id",
                as: "eventData",
            },
        },
        {
            $unwind: "$eventData",
        },
        {
            $addFields: {
                eventDateObj: {
                    $dateFromString: {
                        dateString: "$eventData.date",
                    },
                },
            },
        },
        {
            $match: {
                eventDateObj: { $gte: today },
            },
        },
        {
            $count: "upcomingEventCount",
        },
    ]);
    const pastEventCount = await bookings_model_1.Bookings.aggregate([
        {
            $match: {
                user: new mongoose_1.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "events",
                localField: "event",
                foreignField: "_id",
                as: "eventData",
            },
        },
        {
            $unwind: "$eventData",
        },
        {
            $addFields: {
                eventDateObj: {
                    $dateFromString: {
                        dateString: "$eventData.date",
                    },
                },
            },
        },
        {
            $match: {
                eventDateObj: { $lt: today },
            },
        },
        {
            $count: "pastEventCount",
        },
    ]);
    return {
        upcomingEventCount: upcomingEventCount[0]?.upcomingEventCount || 0,
        pastEventCount: pastEventCount[0]?.pastEventCount || 0,
        totalParticipatesInEvent,
    };
};
const getHostStats = async (userId) => {
    const hostInfo = await host_model_1.Host.findOne({ user: userId });
    const numberOfTotalPublishedEvents = await event_model_1.Event.find({
        host: hostInfo._id,
    }).countDocuments();
    const totalNumberOfAttendees = await event_model_1.Event.aggregate([
        {
            $match: {
                host: hostInfo._id,
            },
        },
        {
            $group: {
                _id: "$host",
                totalAttendees: { $sum: "$total_no_of_booking" },
            },
        },
    ]);
    const totalRevenue = await event_model_1.Event.aggregate([
        {
            $match: {
                host: hostInfo._id,
            },
        },
        {
            $project: {
                eventRevenue: {
                    $multiply: ["$joining_fee", "$total_no_of_booking"],
                },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$eventRevenue" },
            },
        },
    ]);
    const upcomingEventCount = await event_model_1.Event.aggregate([
        {
            $match: {
                host: hostInfo._id,
            },
        },
        {
            $addFields: {
                eventDateObj: { $toDate: "$date" },
            },
        },
        {
            $match: {
                eventDateObj: { $gte: today },
            },
        },
        {
            $count: "totalUpcomingEvents",
        },
    ]);
    return {
        totalPublishedEvents: numberOfTotalPublishedEvents,
        totalNumberOfAttendees: totalNumberOfAttendees[0]?.totalAttendees || 0,
        totalRevenue: totalRevenue[0]?.totalRevenue || 0,
        upcomingEventCount: upcomingEventCount[0]?.totalUpcomingEvents || 0,
    };
};
exports.StatsServices = {
    getUserStats,
    getHostStats,
};
