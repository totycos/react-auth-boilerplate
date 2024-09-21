# React boilerplate : Authentication + TypeScript + Unit tests

## Project Overview

---

This is a boilerplate project for a modern web application, built with React, TypeScript, and Vitest. It provides a solid foundation for building scalable and maintainable applications.

## Features

---

- Axios for API requests
- React Query for data fetching and caching
- React Hook Form for efficient and flexible form handling
- Context to authentication managment
- JS-Cookie for session managment
- TypeScript for type safety and code quality
- Zod for schema validation and type inference
- ESLint and Prettier for consistent code formatting and linting
- Vitest for unit testing

## Getting started

---

1. Install dependencies: `npm install` or `yarn instal`
2. Start the development server: `npm start` or `yarn start`
3. Adapting to a Different Backend :

This boilerplate uses a specific backend API, but you can easily adapt it to work with a different backend. Here's what you need to do:

Data to transmit: The backend API expects a specific data format for requests and responses. You'll need to update the `axiosInstance` in `src/utils/axiosInstance.ts` to match your backend's API format.
Environment variables: You'll need to update the `VITE_API_URL` environment variable in `.env` to point to your backend API URL.
API endpoints: You'll need to update the API endpoints in `src/hooks/useLogin.tsx` and other API-related files to match your backend's API endpoints.
Data models: You may need to update the data models in to match your backend's data format.
Don't forget to update schemas and types too.

## Contributing

---

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.
