import { Types } from "mongoose";
import { Bookings } from "../bookings/bookings.model";

const getUserStats = async (userId: string) => {
  const totalParticipatesInEvent = await Bookings.find({
    user: userId,
  }).countDocuments();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

export const StatsServices = {
  getUserStats,
};
