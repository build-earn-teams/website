import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { dbConnect } from './src/database/dbConnection.js'
import { errorMiddleware } from './src/middleware/error.js'
import userRouter from './src/routes/userRouter.js'
import { removeUnverifiedAccounts } from './src/automation/removeUnverifiedacc.js'
export const app = express()
dotenv.config()


app.use(cors({
  origin:[process.env.FRONTEND_URL],
  methods:['GET','POST','PUT','DELETE'],
  credentials:true
}
  

))



app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/api/v1/user",userRouter)
removeUnverifiedAccounts()
dbConnect();

app.use(errorMiddleware)