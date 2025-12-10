/* eslint-disable no-console */
import { Server } from "http";
import { app } from "./app";
import { envVars } from "./app/config/env";
import mongoose from "mongoose";
import { seedAdmin } from "./app/utils/seedAdmin";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DATABASE_URL);
    console.log("The mongodb is connected");
    server = app.listen(5000, () => {
      console.log(`The server is running on the port of 5000`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async()=>{
    await startServer();
    await seedAdmin();
})()

startServer();
