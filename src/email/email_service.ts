import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import * as nodemailer from 'nodemailer';
import emailConfig from "./config/email.config";


@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;


    constructor(@Inject(emailConfig.KEY)
    private readonly emailConfiguration: ConfigType<typeof emailConfig>,) {
        this.transporter = nodemailer.createTransport({
            host: this.emailConfiguration.emailHost,
            port: this.emailConfiguration.emailPort,
            secure: this.emailConfiguration.secure,
            auth: {
                user: this.emailConfiguration.emailUsername,
                pass: this.emailConfiguration.emailPassword,
            }
        })
    }

    async sendEmail(to: string, subject: string, content: string) {
        const mailOptions = {
            from: `"No Reply" <${this.emailConfiguration.emailFrom}>`,
            to,
            subject,
            text: content,
        }

        console.log(mailOptions)

        await this.transporter.sendMail(mailOptions);
    }
}