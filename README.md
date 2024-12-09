# WIRA Dashboard

## Description
WIRA Dashboard is a web application designed to manage and display rankings, accounts, characters, and scores for WIRA players. The application includes functionality to create, view, update, and delete accounts, manage associated characters, and view their scores. The dashboard also features search, pagination, and caching for efficient data management and retrieval.

---

## Features
- Public leaderboard with rankings and scores.
- Account creation and management.
- Character and score association for each account.
- Search and pagination to handle large datasets.
- Backend caching to improve performance.
- Interactive and user-friendly dashboard.

---

## Technology Stack
- **Frontend:** React, Chart.js, CSS
- **Backend:** Node.js
- **Database:** PostgreSQL
- **Web Server:** Nginx
- **Data Generation:** Faker.js

---

## Installation Instructions

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (version 16 or later)
- PostgreSQL (version 13 or later)
- Nginx (optional for deployment)
- Git

---

### 2. Setup Instructions

#### Clone the Repository
```bash
git clone https://github.com/<YourGitHubUsername>/WIRA-Dashboard.git
cd WIRA-Dashboard

## Backend Setup
- Navigate to the backend folder
- install dependencies
- setup database
- generate mock data
- start the backend server
  npm start
  The backend server will run at http://localhost:5001.

## Frontend Setup
- Navigate to the frontend folder
- Install dependencies
- Build the project
- Serve the frontend locally
  npm start
or deploy it using Nginx at http://localhost:8081

WIRA-Dashboard/
├── backend/
│   ├── db/
│   │   ├── db.js        # Database connection
│   │   ├── schema.sql   # Database schema
│   │   └── mockData.js  # Mock data generation
│   ├── routes/          # API routes
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── App.js       # Main React app
│   ├── public/          # Public files
│   └── build/           # Production build
├── README.md            # Project documentation
└── package.json         # Dependencies


