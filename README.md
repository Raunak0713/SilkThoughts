![SilkThoughts Blog](https://iiedtt3r8m.ufs.sh/f/dXzGhag6oavTxnt4ISh13rTNVkbtEpHwu0yzvK51ClciRmUS)


# SilkThoughts

A modern blogging platform built with Next.js and Strapi.

## Project Structure

```http
silkthoughts/
├── frontend/    # Next.js application
└── backend/     # Strapi CMS
```

## Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* Git

## Installation

### Backend
1.Navigate to the backend directory:

```
cd backend
```
2.Install Dependency
```http
npm install
```

3.Create a ```.env``` file in the backend directory and configure your environment variables:
```http
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

4.Start the development server
```http
npm run develop
```
5.Create your first admin user by visiting http://localhost:1337/admin

## Frontend (Next.js)

1.Navigate to the frontend directory:

```http
cd frontend
```
2.Install Dependency
```http
npm install
```

3.Create a ```.env.local``` file in the backend directory and configure your environment variables:
```http
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

4.Start the development server
```http
npm run dev
```
5.Open your browser and visit http://localhost:3000

## Development
* Backend: Runs on http://localhost:1337
* Frontend: Runs on http://localhost:3000

## Features
* Modern, responsive design
* Content management with Strapi
* Server-side rendering with Next.js
* RESTful API integration