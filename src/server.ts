import { Server } from "http";
import app from "./app"
import { envVars } from "./config/env";

let server : Server;

const main=async()=>{
    try{
        server = app.listen(process.env.PORT || 6060,()=>{
        console.log(`http://localhost:${envVars.PORT || 6060}`)
    })
} catch(error){
    console.log(error);
}
}
// SIGTERM signal handler
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down server...");

    if(server){
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(1);
        });
    } 
    
    process.exit(1);
    
})

// SIGINT signal handler

process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down server...");

    if(server){
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(1);
        });

    }

    process.exit(1);
});

//uncaught exception handler
process.on('uncaughtException', (error) => {
    console.log("Uncaught Exception Detected... Shutting down server", error);

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection Detected... Shutting down server", error);

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

main();