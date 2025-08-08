import winston from "winston";

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "./logs/error.log",
            level: "error"
        }),
        new winston.transports.File({
            filename: "./logs/warrnings.log",
            level: "warning"
        }),
        new winston.transports.File({
            filename: "./logs/combined.log"
        })
    ]
})
