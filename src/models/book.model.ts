import mongoose, {Schema, Document} from "mongoose";

export interface BookDocument extends Document {
  title: string;
  author: string;
  publishedYear?: number;
}

const bookSchema = new Schema<BookDocument>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishedYear: {
    type: Number,
  },
});

export const Book = mongoose.model<BookDocument>("Book", bookSchema);
