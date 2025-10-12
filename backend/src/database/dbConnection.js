import mongoose from 'mongoose'

export const dbConnect = ()=>{
  try{
    mongoose.connect(process.env.MONGODB_URL,{
       dbName:"MERN_AUTH",
    }
    ).then(()=>{
      console.log("Connected to database")
    })
  }
  catch(err){
    console.log("database connection failed", err)
  }
}