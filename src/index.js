import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet";
import morgan from "morgan";
import ApiRouter from "./api.js";


dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())


app.get("/", (req, res) => {
    res.send("Welcome to StudyBug...")
})

app.use("/api", ApiRouter)

const PORT = process.env.PORT || 6001

const mongooseConnectionOptions = {
    socketTimeoutMS: 45000, 
    serverSelectionTimeoutMS: 50000, 
}


mongoose.connect(process.env.MONGO_URL, mongooseConnectionOptions)

mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
        console.log("Server running at PORT: " + PORT)
        // listCollections() 
    })
})

mongoose.connection.on('error', (err) => {
    console.log("\nFAILED TO CONNECT TO DATABASE\n" + err)
})

async function listCollections() {
    try {
        const db = mongoose.connection.db
        console.log("tha db", db)
        const collections = db.listCollections()
        console.log("Collections:", collections.map(collection => "herrree"+ collection.name))
    } catch (err) {
        console.error('Error listing collections', err)
    }
}