const loggerMiddleware = (req, res, next) => {
  console.log(`\n--- Incoming Request ---`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Body:`, JSON.stringify(req.body, null, 2));

  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function (body) {
    console.log(`\n--- Outgoing Response ---`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body:`, body);
    return originalSend.call(this, body);
  };

  res.json = function (body) {
    console.log(`\n--- Outgoing Response ---`);
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body:`, JSON.stringify(body, null, 2));
    return originalJson.call(this, body);
  };

  next();
};

module.exports = loggerMiddleware;
