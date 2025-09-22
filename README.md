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
│   ├── profileImageController.js
│   ├── reportController.js
│   ├── verifyController.js
├── models/
│   ├── awareness.js
│   ├── report.js
│   ├── User.js
│   ├── verify.js
├── routes/
│   ├── authRoutes.js
│   ├── awarenessRoutes.js
│   ├── dashboardRoutes.js
│   ├── profileImageRoutes.js
│   ├── reportRoutes.js
│   ├── statsRoutes.js
│   ├── verifyRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   ├── upload.js
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



## API Endpoints

## Auth Routes
Method       Endpoint                 Description              Access
POST    api/auth/register          Register a new user         Public
POST    api/auth/verifyOtp         Verify OTP code             Public
POST    api/auth/resendOtp         Resend OTP code             Public
POST    api/auth/forgotPassword    Forgot password             Public
POST    api/auth/reset-password/:token    Reset password       Public
POST    api/auth/login             Login an existing user      Public
GET     api/auth/allusers          Get all users route         Private
GET     api/auth/me                Get user profile            Private
PUT     api/auth/update            Update user                 Private


## Verify Routes

Method	            Endpoint	                        Description	                                Access
POST	            /api/verify	                    Create a product record (with image)	        Private
GET	                /api/verify	                    Get all products (pagination + filter)	        Public
GET              	/api/verify/:nafdacReg	        Get product by NAFDAC Reg						Public
GET					/api/verifyId/:id				Get product by ID								Public
PUT					/api/verify/:id					Update product (Admin/Author)					Private
DELETE				/api/verify/:id					Delete product (Admin/Author)					Private


## Awareness Routes

Method				Endpoint							Description									Access
POST				/api/awareness					Create awareness post (with image)				Private
GET					/api/awareness					Get all awareness posts							Public
GET					/api/awareness/:id				Get awareness post by ID						Public
PUT					/api/awareness/:id				Update awareness post							Private
DELETE				/api/awareness/:id				Delete awareness post							Private

## Report Routes

Method				Endpoint							Description									Access
POST				/api/report						Create a report (with image)					Private
GET					/api/reportall					Get all reports									Public
GET					/api/report/:nafdacReg			Get report by NAFDAC Reg						Public
PUT					/api/report/:id					Update report									Private
DELETE				/api/report/:id					Delete report									Private

## Dashboard Route

Method				Endpoint							Description									Access
GET					/api/dashboard					Get dashboard stats (monthly/total)				Private

## Profile Image Routes

Method				Endpoint							Description									Access
POST				/api/upload-image				Upload a profile image							Private

## Stats Routes
Method				Endpoint							Description									Access
GET					/api/stats						Get system statistics							Private (Admin)


## Report Routes

Method				Endpoint							Description									Access
POST				/api/feedbacks		             Create feedback        					    Public
GET					/api/feedbacks					 Get all feedbacks								Private
GET					/api/feedbacks/:id			     Get feedbacks by id						    Private
PUT					/api/feedbacks/:id				 Update feedbacks								Private
DELETE				/api/feedbacks/:id				 Delete feedbacks								Private




## Author name

-Asiru Adedolapo

## Stage, Commit, and Push**

```bash

git add .
git commit -m "feat: initial project setup with folder structure and README"
git branch -M main
git remote add origin https://github.com/Don-pizu/fake-drug-verification.git
git push -u origin main

