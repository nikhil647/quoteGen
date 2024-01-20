import { IQuotes } from '../../../databases/mongodb/model/quotes.model';

export class QuoteResponseDTO {
  quote!: string;
  author!: string;
  isPublished!: boolean;
  id!: string;
  
  static toResponse(quote: IQuotes): QuoteResponseDTO {
    const quoteDTO = new QuoteResponseDTO();
    quoteDTO.id = quote._id.
    quoteDTO.quote = quote.quote;
    quoteDTO.author = quote.author;
    quoteDTO.isPublished = quote.isPublished;

    return quoteDTO;
  }
}
