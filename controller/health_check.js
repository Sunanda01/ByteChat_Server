const HealthCheckController = {
    async HealthCheck(req, res, next) {
      const health = {
        uptime: process.uptime(),
        responsetime: process.hrtime(),
        message: "ok",
        timestamp: Date.now(),
      };
      try {
        return res.status(200).json(health);
      } catch (err) {
        return next(err);
      }
    },
  };
  
  module.exports = HealthCheckController;