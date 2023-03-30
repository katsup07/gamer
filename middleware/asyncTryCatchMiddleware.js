// keeps code cleaner so try/catch doesn't pollute the routes so much
module.exports = function asyncTryCatchMiddleware(handler){
  return async(req, res, next) => {
    try{
      await handler(req, res);
     }catch(err){
       next(err); // hits the next function after routes in app.js
      }
  }
 
}