import {Book } from "../models/book.model";

export const resolvers = {
  Query: {
    books: async () => await Book.find(),
    book: async (_: any, { id }: { id: string }) => await Book.findById(id),
  },
  Mutation: {
    createBook: async (_: any, { title, author, publishedYear }: { title: string; author: string; publishedYear: number }) =>
  {   const book = new Book({ title, author, publishedYear });
    return await book.save();
  },
    updateBook: async (_: any, { id, title, author, publishedYear }: { id: string; title: string; author: string; publishedYear: number }) =>
      await Book.findByIdAndUpdate(id, { title, author, publishedYear }, { new: true }),
    deleteBook: async (_: any, { id }: { id: string }) => await Book.findByIdAndDelete(id),
  },
};
