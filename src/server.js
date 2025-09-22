import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"

dotenv.config()
import connectDB from "./config/db.js"
import tripRouter from "./routes/trip.routes.js"
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"

const app = express()

const allowedOrigins = ["http://localhost:3000", "https://map-my-way-frontend.onrender.com"]

// --- Middleware ---
app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())

// --- Routes ---
app.get("/", (req, res) => {
  res.send("Welcome to the Trip Planner API!")
})

app.use("/auth", authRouter)
app.use("/trip", tripRouter)
app.use("/users", userRouter)

// --- Error Handling  ---
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  })
})

// --- Start Server ---
const startServer = async () => {
  await connectDB()
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`)
  })
}

startServer()
