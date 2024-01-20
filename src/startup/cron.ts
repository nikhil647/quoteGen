import cron from 'node-cron';
import * as quoteService from '../services/quotes/quotes.service';

const cronJobSetup = () => {
  // Cron job to send an email every day at 10 AM
  cron.schedule('0 10 * * *', async () => {
    const quoteOfTheDay = await quoteService.todaysQuote(); // Logic for fetching quote of the day from mongo databases

    if (quoteOfTheDay) {
      console.log(quoteOfTheDay);
      //   const mailOptions: nodemailer.SendMailOptions = {
      //   from: "your_email@gmail.com",
      //   to: "recipient_email@example.com",
      //   subject: "Daily Email",
      //   text: "This is your daily email sent at 10 AM.",
      // };
      // try {
      //   await transporter.sendMail(mailOptions);
      //   console.log("Email sent successfully!");
      // } catch (error) {
      //   console.error("Error sending email:", error);
      // }
    }
  });
};
export default cronJobSetup;
