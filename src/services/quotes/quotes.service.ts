import to from 'await-to-js';
import { QuoteResponseDTO } from '../../shared/models/DTO/quoteDTO';
import quoteModel from '../../databases/mongodb/schema/quotes.schema';

export const todaysQuote = async (): Promise<QuoteResponseDTO | undefined> => {
  const count = await quoteModel.countDocuments({ isPublished: false });
  
  if (count) {
    const randomIndex = Math.floor(Math.random() * count);
    const [error, randomQuote] = await to(quoteModel.findOne({ isPublished: false }).skip(randomIndex));
    if (error || randomQuote === null) {
      return undefined;
    }
    const quoteResponseDTO = QuoteResponseDTO.toResponse(randomQuote);
    return quoteResponseDTO;
  }
};