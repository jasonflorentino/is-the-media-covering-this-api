module.exports = authenticate;

function authenticate(req, res, next) {
    if (!req.headers.api_key) {
      return res.status(401).json({ 
        message: "Unauthorized" 
      });
    }

    if (req.headers.api_key !== process.env.API_KEY) {
      return res.status(403).json({ 
        message: "Forbidden" 
      });
    }
    
    next();
}