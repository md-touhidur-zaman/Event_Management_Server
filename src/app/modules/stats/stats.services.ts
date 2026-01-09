import { Types } from "mongoose";
import { Bookings } from "../bookings/bookings.model";
import { Host } from "../host/host.model";
import { Event } from "../event/event.model";

const today = new Date();
today.setHours(0, 0, 0, 0);

const getUserStats = async (userId: string) => {
  const totalParticipatesInEvent = await Bookings.find({
    user: userId,
  }).countDocuments();

  const upcomingEventCount = await Bookings.aggregate([
    {
      $match: {
        user: new Types.ObjectId(userId),
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

  const pastEventCount = await Bookings.aggregate([
    {
      $match: {
        user: new Types.ObjectId(userId),
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

const getHostStats = async (userId: string) => {
  const hostInfo = await Host.findOne({ user: userId });

  const numberOfTotalPublishedEvents = await Event.find({
    host: hostInfo._id,
  }).countDocuments();
  const totalNumberOfAttendees = await Event.aggregate([
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

  const totalRevenue = await Event.aggregate([
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

  const upcomingEventCount = await Event.aggregate([
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

export const StatsServices = {
  getUserStats,
  getHostStats,
};
