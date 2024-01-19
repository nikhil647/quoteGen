import { Schema, model } from "mongoose";
import { IQuotes } from "../model/quotes.model";

const schema = new Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IQuotes>("quote", schema);
