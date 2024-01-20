import cron from 'node-cron';
import * as quoteService from '../services/quotes/quotes.service';
// import to from 'await-to-js';

const cronJobSetup = () => {
  // Cron job to send an email every day at 10 AM
  console.log('schedule cron job');
  cron.schedule('*/10 * * * * *', async () => {
    console.log('Evert 10 sec ?')
    const quoteOfTheDay = await quoteService.todaysQuote(); // Logic for fetching quote of the day from mongo databases
    console.log('quoteOfTheDay 00',quoteOfTheDay);
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
