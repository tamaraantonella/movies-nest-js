# Movies API 🎥🎬​

Movies API is a RESTful API built with NestJS Framework that allows you to manage movie information. It includes features such as CRUD operations for movies, integration with the Star Wars API, user authentication, and roles.

## Features 

- **Movie Management**: Full CRUD to manage movie information.
- **Star Wars API Integration**: Synchronizes movie data from the Star Wars API.
- **Authentication and Roles**: Implementation of user roles with password encryption.
- **Scheduled Tasks**: Runs scheduled tasks to keep data in sync.

## Prerequisites

- Node.js >= 20 (.nvmrc file included)
- Yarn >= 1.22 (optional)
- PostgreSQL 

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tamaraantonella/movies-nest-js.git
cd movies-nest-js
```

### 2. Install Dependencies

```bash
yarn 
```

### 3. Set Environment Variables
Create a `.env` file in the root directory, following the example in the `.env.template` file.

### 4. Create your database and run migrations
Migrations are already included  `/src/prisma/migrations`

```bash
yarn db:migrate:apply
```

### 5. Run the Application

```bash
yarn start:dev
```

## API Documentation
Swagger documentation is available at `/api-docs`
