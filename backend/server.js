import {app} from "./app.js"


app.listen(process.env.PORT,()=>{
  console.log(`process listen on ${process.env.PORT}`)
})