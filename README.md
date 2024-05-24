# Task Manager API

This is a Task Manager API built using NestJS, Prisma, and PostgreSQL. The API allows users to create, update, delete, and retrieve tasks. Each user can only access their own tasks.

## Features

- User authentication with JWT
- Role-based access control (admin and non-admin users)
- Task management (create, update, delete, get tasks)
- File upload for tasks
- Automatic cascading deletion of user tasks
- Postman documentation

## Tools Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: A next-generation ORM that helps with database access and migrations.
- **PostgreSQL**: A powerful, open-source relational database management system.
- **JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties.
- **Postman**: A collaboration platform for API development that simplifies each step of building an API and streamlines collaboration so you can create better APIs—faster.

## Prerequisites

- Node.js
- PostgreSQL

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mofaraz/task-manager.git
   cd task-manager

## Installation

```bash
$ npm install
```
## Create .env file

DATABASE_URL="postgresql://username:password@localhost:5432/task_manager"
JWT_SECRET="your_jwt_secret"

## Migrate Database

npx prisma migrate dev --name init


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## License
This project is licensed under the MIT License.




