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


export const updateEventZodSchema = z.object({
    title:z.string().optional(),
    category: z.string().optional(),
    organizer_name:z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    location:z.string().optional(),
    total_participants: z.number().optional(),
    description: z.string().max(400).optional(),
    joining_fee: z.number().optional(),
    event_status: z.string().optional(),
})

