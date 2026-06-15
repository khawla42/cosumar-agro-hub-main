const winston = require("winston");
require("winston-daily-rotate-file");
const { LogstashTransport } = require("winston-logstash-transport");
const { ElasticsearchTransport } = require("winston-elasticsearch");
const path = require("path");
require("dotenv").config();

const levels = {
  critical: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

// Format final pour ELK
const elkFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format((info) => {
    // Injecter les champs ELK/Kibana demandés
    info["@timestamp"] = info.timestamp;
    info.loglevel = info.level;
    info.service = info.service || "cosumar-agro-backend";
    return info;
  })(),
  winston.format.json(), // JSON à la fin
);
const transports = [
  // 1. Console pour le développement
  new winston.transports.Console({
    format: winston.format.combine(winston.format.simple()),
  }),
  // 2. Fichier local pour backup
  new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, "logs", "application-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: elkFormat,
  }),
];

if (process.env.LOGSTASH_ENABLED === "true") {
  console.log(`📡 Connexion à Logstash: ${process.env.LOGSTASH_HOST}:${process.env.LOGSTASH_PORT}`);
  transports.push(
    new LogstashTransport({
      host: process.env.LOGSTASH_HOST || "localhost",
      port: process.env.LOGSTASH_PORT || 5044,
      format: elkFormat,
      handleExceptions: true,
    }),
  );
}

if (process.env.ELASTICSEARCH_ENABLED === "true") {
  console.log(`🔍 Connexion à Elasticsearch: ${process.env.ELASTICSEARCH_URL}`);
  transports.push(
    new ElasticsearchTransport({
      level: "info",
      clientOpts: {
        node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 10000,
      },
      indexPrefix: "cosumar-logs",
      format: elkFormat,
      handleExceptions: true,
    }),
  );
}

const logger = winston.createLogger({
  level: "debug",
  levels,
  transports,
});

function log(level, event, data = {}) {
  logger.log({
    level: levels[level] !== undefined ? level : "info",
    message: event,
    ...data,
  });
}

module.exports = { logger, log };
