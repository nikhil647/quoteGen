import { Document } from 'mongoose';

export interface IQuotes extends Document {
  quote: string;
  author: string;
  isPublished: boolean;
  createdAt: Date;
}
