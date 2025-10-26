import { registerAs } from '@nestjs/config';

export default registerAs('emailConfig', () => {
  return {
    emailHost: process.env.EMAIL_HOST,
    emailPort: parseInt(process.env.EMAIL_PORT!, 10),
    emailUsername: process.env.EMAIL_USERNAME,
    emailPassword: process.env.EMAIL_PASSWORD,
    secure: process.env.EMAIL_SECURE === 'true',
    emailFrom: process.env.EMAIL_FROM || 'noreply@example.com',
  };
});
