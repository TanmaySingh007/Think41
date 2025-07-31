# Think41 - E-Commerce Full-Stack Application

## Project Overview
A complete e-commerce web application built from scratch with 6 progressive milestones.

## Milestones
1. **Database Design & Data Loading** - Set up database schema and load data from CSV
2. **REST API for Products** - Create backend API endpoints for products
3. **Frontend UI for Products** - Build product list and detail views
4. **Database Refactoring** - Separate departments into their own table
5. **Departments API** - Add API endpoints for departments
6. **Department Filtering** - Implement department filtering in frontend

## Tech Stack
- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: SQLite (for development)
- **Authentication**: NextAuth.js (as per user preference)
- **Styling**: Tailwind CSS

## Project Structure
```
Think41/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   ├── data/              # CSV data files
│   └── package.json
├── database/              # Database files and migrations
└── README.md
```

## Getting Started
1. Clone the repository
2. Install dependencies for both client and server
3. Set up the database
4. Load initial data from CSV
5. Start development servers

## Development Commands
- `npm run dev:client` - Start frontend development server
- `npm run dev:server` - Start backend development server
- `npm run dev` - Start both servers concurrently
