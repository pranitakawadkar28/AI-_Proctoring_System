import app from "./src/app.js"
import http from "http";
import { PORT } from "./src/config/env.js";
import { connectDb } from "./src/config/db.js";

async function startServer() {
    connectDb();
    const server = http.createServer(app);

    server.listen(PORT, () => {
        console.log(`Server is running on Port: ${PORT}`);
    })
}

startServer().catch(( err ) => {
    console.error("Error occurred in server", err);
    process.exit(1);
})