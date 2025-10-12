class ErrorHandler extends Error{
  constructor(message , statusCode){
    super(message)
    this.statusCode= statusCode
  }
}

export const errorMiddleware = (err , req, res , next)=>{

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error"

  console.log(err)

  if(err.name === "CastError"){
    const message = `InValid ${err.path}`;
    err = new ErrorHandler(message,400)
  }

  if(err.name === "JsonWebTokenError"){
    const message = `JsonWebToken is invalid , Try Again.. `;
    err = new ErrorHandler(message,400)
  }

   if(err.name === "TokenExpiredError"){
    const message = `JsonWebToken is expired , Try Again.. `;
    err = new ErrorHandler(message,400)
  }

   if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered `;
    err = new ErrorHandler(message,400)
  }

  return res.status(err.statusCode).json({
    success:false,
    message: err.message
  })

}
export default ErrorHandler