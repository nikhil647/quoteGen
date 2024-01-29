import cron from 'node-cron';
import * as quoteService from '../services/quotes/quotes.service';
import * as emailService from '../services/email/email.service';
import { formatEmail } from '../shared/utils/formatEmail';
import { QuoteResponseDTO } from '../shared/models/DTO/quoteDTO';
import { formatEmailType } from '../shared/types/index';

const cronJobSetup = () => {
  // Cron job to send an email every day at 10 AM
  console.log('schedule cron job');
  cron.schedule('0 10 * * *', async () => {
    const quoteOfTheDay: QuoteResponseDTO | undefined = await quoteService.todaysQuote();
    if(quoteOfTheDay) {
      const { from, to, subject, text } : formatEmailType = await formatEmail(quoteOfTheDay);
      console.log('from, to, subject, text ',from, to, subject, text);
      const isSuccess = await emailService.sendEmailToReceipients({ from, to, subject, text });
    }
  });
};
export default cronJobSetup;
