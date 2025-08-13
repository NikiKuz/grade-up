import { logger } from "@services/logger.service.js"
import { transport } from "@services/transport.service.js"

async function sendMail(){
    try {
        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: "nikky.kuznetsov@gmail.com",
            subject: "test",
            html: "this is how it works"
        })
    } catch (error) {
        logger.error(error)
    }
   
}

sendMail()
