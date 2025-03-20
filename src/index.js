import express from "express"
import rateLimit from "express-rate-limit"
import uploadRoute from "./routes/convert.js"
import checkToken from "./middleware/auth.js"

const APP_PORT = 3000

const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later...",
})

// middlewares
app.use(express.json())
app.use(limiter)
app.use(checkToken)

// routes
app.use("/convert", uploadRoute)

app.listen(APP_PORT, () => console.info(`Server running on port ${APP_PORT}`))
