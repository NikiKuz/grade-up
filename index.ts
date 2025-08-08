import express, { Application, Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import { logger } from './src/services/logger.service.js'
import appRoutes from './src/app.js'
import cors from 'cors'

dotenv.config()

const app: Application = express()

app.use(cors())
app.use(express.json())

app.use("/api", appRoutes)

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    logger.error(err)
    return res.status(err.status || 500).json({ message: err.message || "internal server error" })
})

app.listen(process.env.PORT, () => logger.info(`Server started on http://localhost:${process.env.PORT}`))
