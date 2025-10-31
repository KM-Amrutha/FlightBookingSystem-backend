import dotenv from "dotenv";
import app from "@server";
import connectDB from "@infrastructure/config/db.config"
import { createServer } from "http";

 dotenv.config();
 import "reflect-metadata"
 connectDB();

 const httpServer =  createServer(app);

const PORT =process.env.PORT;
httpServer.listen(PORT,()=>{
    if(!PORT){
    console.error("Port is not defined in .env file")
    process.exit(1)
    }
    console.log(`Server running on the port ${process.env.PORT}`)
})