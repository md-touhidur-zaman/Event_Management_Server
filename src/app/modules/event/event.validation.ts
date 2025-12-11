import z from "zod";

export const eventZodSchema = z.object({
    event_type: z.string(),
    date: z.string(),
    time: z.string(),
    location:z.string() ,
    min_participants: z.number(),
    max_participants: z.number(),
    description: z.string(),
    joining_fee: z.number(),
    event_status: z.string().optional(),
})