import { MercuriusContext } from "mercurius";

import { AuthContext } from "../context/auth.context";
import { checkAuth } from "../middleware/auth.middleware";
import { Book } from "../models/book.model";
import { login, register } from "../services/auth.service";

type Context = MercuriusContext & AuthContext;
export const resolvers = {
  Query: {
    books: async (_: unknown, __: unknown, ctx: Context) => {
      try {
        checkAuth(ctx);
        return await Book.find();
      } catch (error) {
        throw new Error(
          `Failed to fetch books: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    book: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      try {
        checkAuth(ctx);
        const book = await Book.findById(id);
        if (!book) {
          throw new Error("Book not found");
        }
        return book;
      } catch (error) {
        throw new Error(
          `Failed to fetch book: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    booksByAuthor: async (
      _: unknown,
      { author }: { author: string },
      ctx: Context
    ) => {
      try {
        checkAuth(ctx);
        return await Book.find({ author: { $regex: author, $options: "i" } });
      } catch (error) {
        throw new Error(
          `Failed to search books: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    me: async (_: unknown, __: unknown, ctx: Context) => {
      checkAuth(ctx);
      return ctx.user || null;
    },
  },
  Mutation: {
    createBook: async (
      _: unknown,
      {
        title,
        author,
        publishedYear,
      }: { title: string; author: string; publishedYear: number },
      ctx: Context
    ) => {
      try {
        checkAuth(ctx);
        const book = new Book({ title, author, publishedYear });
        return await book.save();
      } catch (error) {
        // Handle duplicate key error specifically
        if (error instanceof Error && error.message.includes("duplicate key")) {
          throw new Error(`Book "${title}" by ${author} already exists`);
        }
        throw new Error(
          `Failed to create book: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    updateBook: async (
      _: unknown,
      {
        id,
        title,
        author,
        publishedYear,
      }: { id: string; title: string; author: string; publishedYear: number },
      ctx: Context
    ) => {
      try {
        checkAuth(ctx);
        const book = await Book.findByIdAndUpdate(
          id,
          { title, author, publishedYear },
          { new: true }
        );
        if (!book) {
          throw new Error("Book not found");
        }
        return book;
      } catch (error) {
        throw new Error(
          `Failed to update book: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    deleteBook: async (_: unknown, { id }: { id: string }, ctx: Context) => {
      try {
        checkAuth(ctx);
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
          throw new Error("Book not found");
        }
        return book;
      } catch (error) {
        throw new Error(
          `Failed to delete book: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    register: async (
      _: unknown,
      {
        email,
        password,
        username,
      }: { email: string; password: string; username: string }
    ) => {
      return register(email, password, username);
    },
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ) => {
      return login(email, password);
    },
    // logout on client side
    // on a real world case I would enforce here token invalidation via token versions
    logout: async () => true,
  },
};
