# Bookstore

A study case demonstrating the use of **Fastify**, **TypeScript**, **MongoDB**, and **GraphQL**.

## Overview

This project is a backend application for a bookstore, built as a learning exercise integrating modern technologies:

- **Fastify**: High-performance Node.js web framework.
- **TypeScript**: Type-safe JavaScript development.
- **MongoDB**: NoSQL document database.
- **GraphQL**: Flexible API query language.

## Features

- REST API endpoints for managing books and authors.
- GraphQL API for flexible querying.
- MongoDB integration for persistent data storage.
- Built with TypeScript for safety and maintainability.
- Designed for extensibility and experimentation.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- npm or yarn

### Installation

```bash
git clone https://github.com/m00nk0d3/bookstore.git
cd bookstore
npm install
```

### Configuration

Copy the example environment file and set your MongoDB connection string and other variables:

```bash
cp .env.example .env
# Edit .env to set MONGODB_URI and other secrets
```

### Running the Application

```bash
npm run dev
```

The server should start on the default port (see `.env`).  
Access REST endpoints at `http://localhost:PORT/api/`  
GraphQL Playground is available at `http://localhost:PORT/graphiql`

## Project Structure

```
src/
  ├── context/          # Application context management
  ├── db.ts             # Database connection setup
  ├── graphql/          # GraphQL schema & resolvers
  ├── middleware/       # Fastify middlewares
  ├── models/           # MongoDB schemas/models
  ├── server.ts         # Server entry point
  ├── services/         # Business logic/services
  └── types/            # Shared TypeScript types
```

## Contributing

Pull requests, issues, and suggestions are welcome!  
This project is for study and experimentation.

## License

[MIT](LICENSE) *(if applicable)*

---

**Repository:** [m00nk0d3/bookstore](https://github.com/m00nk0d3/bookstore)
