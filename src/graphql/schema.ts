export const schema = `

type Book {
  id: ID!
  title: String!
  author: String!
  publishedYear: Int
}

type User {
  id: ID!
  email: String!
  username: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  books: [Book]
  book(id: ID!): Book
  booksByAuthor(author: String!): [Book]
  me: User
}

type Mutation {
  createBook(title: String!, author: String, publishedYear: Int): Book
  updateBook(id: ID!, title: String, author: String, publishedYear: Int): Book
  deleteBook(id: ID!): Book
  register(email: String!, password: String!, username: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
}

`;
