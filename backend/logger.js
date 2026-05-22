const fs = require("fs");

function log(level, event, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,          // login / logout / error
    user: data.user || null,
    ip: data.ip || null,
    ...data
  };

  fs.appendFileSync(
    "C:\\logs\\app.log",
    JSON.stringify(logEntry) + "\n"
  );
}

module.exports = log;