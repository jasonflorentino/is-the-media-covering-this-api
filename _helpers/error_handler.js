module.exports = {
    errorHandler,
    makeError
  }

function errorHandler(err, _req, res, _next) {
    // Handle 'throw <string>'
    if (typeof (err) === 'string') {
      console.error("--RUNTIME ERROR--\n", err)
      return res.status(400).json({ message: err });
    }
      
    const status = err.status || 500;
    console.error("--RUNTIME ERROR--\n", err)
    return res.status(status).json({ message: err.message });
}

/**
 * Creates a new error object with custom status, message, and name.
 * @param {Number} status 
 * @param {String} message 
 * @param {String} name 
 * @returns new Error object
 */
 function makeError(status, message, name = "ServerError") {
    const e = new Error(message)
    e.name = name;
    e.status = status;
    return e;
  }