import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"

dotenv.config()

const app = express()

// ✅ CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// ✅ Middleware
app.use(cookieParser())
app.use(express.json())

// ✅ Routes
import tripRouter from "./routes/trip.routes.js"
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"

app.get("/", (req, res) => {
  res.send("Welcome to the Trip Planner API!")
})

app.use("/auth", authRouter)
app.use("/trip", tripRouter)
app.use("/users", userRouter)

// ✅ Error Handling (один раз, в конце)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  })
})

// ✅ Connect DB + Start server
const startServer = async () => {
  await connectDB()
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
}

startServer()
