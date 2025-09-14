# Title
Fake Drug Verification API

## Description
A RESTful API designed to help verify the authenticity of drugs and other products.
The system allows users to check drugs against a trusted database and detect counterfeit or unverified products.

## Features
-User Authentication (JWT-based)

-Drug Verification (Check authenticity by nafdac reg)

-CRUD Operations for Drug Records (Admin only)

-Search & Filtering (by drug name, manufacturer, batch number, etc.)

-MongoDB Integration for persistent storage

-Security: Helmet, XSS-clean, Mongo-sanitize, Rate limiting


## Installation & Usage instructions\
'''bash
git clone https://github.com/Don-pizu/fake-drug-verification.git

# Navigate into the project folder
cd fake-drug-verification

# Install dependencies
npm install

# Start the server
node server.js

project-root/
├── controllers/
│   ├── authController.js
│   ├── awarenessController.js
|   |-- profileImageController.js
|   |-- reportController.js
|   |-- verifyController.js
├── models/
|   |-- awareness.js
|   |-- report.jd
│   ├── User.js
│   ├── verify.js
├── routes/
│   ├── authRoutes.js
│   ├── awarenessRoutes.js
│   └── dashboardRoutes.js
|   |-- profileImageRoutes.js
|   |-- reportRoues.js
|   |-- verifyRoutes.js
├── middleware/
│   └── authMiddleware.js
|   |-- upload.js
├── config/
│   └── db.js
├── app.js
├── server.js
├── swagger.js
├── .env
├── .gitignore
└── README.md


## Technologies used
-Node.js
-multer
-Express.js
-MongoDB
-JWT Authentication
-Bcrypt.js (password hashing)
-Crypto
-dotenv (environment variables)
-Helmet, Express-rate-limit, Mongo-sanitize, XSS-clean (security)



API Endpoints

Auth Routes
Method       Endpoint                 Description              Access
POST    api/auth/register          Register a new user         Public
POST    api/auth/login            Login an existing user       Public
GET     api/auth/protected        Protected route              Private


Post Routes

Method       Endpoint       Description                                          Access
POST       /api/post        Make a post                                          Private
GET         /api/post/:id    Get a single post by id                             Private
GET         /api/getposts   Get all posts (with pagination + filtering)          Public
PUT        /api/update/:id   Update a post (only author and admin)               Private
DELETE     /api/delete/:id   Delete a post (only author abd admin)               Private


Comment Routes

Method       Endpoint                   Description                                Access
POST       /api/id/comment           Make a comment on a post                      Private
GET         /api/getcomment/id       Get all comment in s podt                     Public
PUT        /api/commentupdate/:id    Update a comment (only author and admin)      Private
DELETE     /api/commentdelete/:id    Delete a comment (only author abd admin)      Private



## Author name

-Asiru Adedolapo

## Stage, Commit, and Push**

```bash

git add .
git commit -m "feat: initial project setup with folder structure and README"
git branch -M main
git remote add origin https://github.com/Don-pizu/fake-drug-verification.git
git push -u origin main

