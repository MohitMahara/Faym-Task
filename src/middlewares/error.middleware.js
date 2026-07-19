export const handleError = async (err, req, res, next) => {
     const statusCode = err.statusCode || 500;
     const erroMsg = err.message || "Internal Server Error";

     return res.status(statusCode).json({
         success  : false,
         message : erroMsg
     })
}