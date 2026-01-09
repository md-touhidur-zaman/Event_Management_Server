"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
const mongoose_1 = require("mongoose");
const bookings_model_1 = require("../bookings/bookings.model");
const getUserStats = async (userId) => {
    const totalParticipatesInEvent = await bookings_model_1.Bookings.find({
        user: userId,
    }).countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingEventCount = await bookings_model_1.Bookings.aggregate([
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
exports.StatsServices = {
    getUserStats,
};
