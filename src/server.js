import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config()
import connectDB from "./config/db.js"

import tripRouter from "./routes/trip.routes.js"
import authRouter from "./routes/authRouter.js"
import authenticate from "./middlewares/authMiddleware.js"

const app = express()

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" })) // Adjust for frontend
app.use(express.json())
app.use(cookieParser())

//Routes
//test api
app.get("/", (req, res) => {
  res.send("Welcome to the Trip Planner API!")
})

app.use("/api/auth", authRouter)

app.use("/api/trip", tripRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message })
})

//Connect to mongo API
const startServer = async () => {
  await connectDB() // Connect to DB
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
}

startServer()
