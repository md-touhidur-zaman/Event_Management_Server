import { Server } from "http";
import { app } from "./app";

let server: Server;



const startServer = () => {
  try {
    // mongoose.connect(envVars.DATABASE_URL)
    // console.log("The mongodb is connected");
    server = app.listen(5000, () => {
      console.log(`The server is running on the port of 5000`);
    });
  } catch (error) {
    console.log(error);
  }
};

// (async()=>{
//     await startServer();
//     await seedAdmin();
// })()

startServer();
