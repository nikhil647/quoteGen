import { IQuotes } from '../../../databases/mongodb/model/quotes.model';

export class QuoteResponseDTO {
  quote!: string;
  author!: string;
  isPublished!: boolean;

  static toResponse(quote: IQuotes): QuoteResponseDTO {
    const quoteDTO = new QuoteResponseDTO();
    quoteDTO.quote = quote._id;
    quoteDTO.author = quote.author;
    quoteDTO.isPublished = quote.isPublished;

    return quoteDTO;
  }
}
