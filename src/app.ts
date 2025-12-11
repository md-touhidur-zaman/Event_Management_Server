import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import { router } from "./app/router"
import { globalErrorHandler } from "./app/middleware/globalErrorHandler"

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))


app.use("/api/v1", router)

app.get("/", (req:Request, res:Response)=>{
    res.status(200).send({
        success:true,
        statusCode:true,
        message:"The event management api is coming soon...."
    })
})

app.use(globalErrorHandler)


