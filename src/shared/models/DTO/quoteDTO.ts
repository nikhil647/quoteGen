import { Console } from 'winston/lib/winston/transports';
import { IQuotes } from '../../../databases/mongodb/model/quotes.model';

export class QuoteResponseDTO {
  quote!: string;
  author!: string;
  isPublished!: boolean;
  id!: string;
  
  static toResponse(quoteObj: IQuotes): QuoteResponseDTO {
    const quoteDTO = new QuoteResponseDTO();
    try {
      quoteDTO.quote = quoteObj.quote;
      quoteDTO.author = quoteObj.author;
      quoteDTO.isPublished = quoteObj.isPublished;
    }
    catch(err) {
      console.log('Error -->',err);
    }
    return quoteDTO;
  }
}
