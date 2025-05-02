class CustomErrorHandler extends Error {
    constructor(status, msg) {
      super();
      this.status = status;
      this.message = msg;
      this.success = false;
    }
  
    static alreadyExist(message) {
      return new CustomErrorHandler(409, message);
    }
  
    static wrongCredentials(message = "Your email & password is wrong") {
      return new CustomErrorHandler(402, message);
    }
  
    static tokenError(message = "Token Error") {
      return new CustomErrorHandler(401, message);
    }
  
    static unAuthorized(message = "Unauthorised User") {
      return new CustomErrorHandler(403, message);
    }
  
    static notFound(message = "404 Not Found") {
      return new CustomErrorHandler(404, message);
    }
  
    static serverError(message = "Internal Server Error") {
      return new CustomErrorHandler(500, message);
    }
  }
  module.exports = CustomErrorHandler;