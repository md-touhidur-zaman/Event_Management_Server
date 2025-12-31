import z from "zod";

export const eventZodSchema = z.object({
    title:z.string(),
    category: z.string(),
    organizer_name:z.string(),
    date: z.string(),
    time: z.string(),
    location:z.string(),
    total_participants: z.number(),
    description: z.string().max(400),
    joining_fee: z.number(),
    event_status: z.string().optional(),
})