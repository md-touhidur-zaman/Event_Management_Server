# 📅 Event Management API.

A robust and scalable Backend API for the Events & Activities Platform, designed to connect people through local events, hobbies, and social activities. This backend powers authentication, event management, participant matching, payments, reviews, and role-based access control.
**Express.js**, 
**TypeScript**, 
**MongoDB** 
**Mongoose**.

---

## 🎯 Objective

<pre>
=> Develop a RESTful backend API for event-based social interaction
=> Implement secure authentication and authorization
=> Support role-based access (User, Host, Admin)
=> Enable event creation, participation, and management
=> Integrate secure online payment handling
=> Ensure clean architecture and maintainable codebase
</pre>
---

## 🛠️ Tech Stack

- **Backend Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Runtime**: Node.js

---

## 🗂️ Project Structure
<pre>
src/
|--app
    ├── config/ # Environment Variable Config
    ├── errorhelpers/ # Custom error functionality
    ├── interfaces/ # All global interfaces
    ├── middleware/ # All middlewares
    ├── modules/ # All modules
    ├── routes/ # API route definitions
    ├── utils/ # All utility functionality
├── app.ts # app setup
└── server.ts # Entry point
</pre>

## 🔧 Core Features

- 🔓 User login functionality. (JWT Login and password hasing).
- 👨🏻 Role based middleware.
- 📅 Create Event.
- ✅ Booked A Event By Paying.
- ❌ Follow if Payment cancel or failed or success.
- 💵 Payment functionality after completing a Booking.
- 🔍 History of Event

## 🌐 API Endpoints
<pre>
    Base API: 
        # https://eventmanagementserver-delta.vercel.app/api/v1
    
    1. 👤 User:- 
            # /user
                # POST /create-user --> User Register
                # GET /get-all-users -->  Get All Users
                # PATCH /update-user --> Update all user info
                # GET /user-info --> Get single user info
                # PATCH /block-unblock --> Block A Specific User
  
    2. 🔐 Auth:-
            # /auth
                # POST /login --> User Login
                # POST /logout --> User Logout
    3. 📅 Event:
            # /event
                # POST /create-event --> Create Event
                # POST /:id --> Get single event
                # GET / --> Get all event
                # PATCH /update/:id --> Update event
                # DELETE /delete/:id --> Delete event
    4. 👨🏻‍🦱Host:
            # /host
                # POST /become-host --> Request become host
                # PATCH /update-approval/:id --> Update approval info
                # GET /requested-host --> Get All requested host Information
                # GET /published-event --> Get Published Event info
    5. 💵 Payment:
            # /payment
                # POST /init-payment/:rideId --> Get Payment URL
                # POST /success --> Payment Success 
                # POST /cancel --> Payment Cancel 
                # POST /failed --> Payment Failed 
                # POST /validate-payment --> IPN Payment Validate 
    
    
    
</pre>
    
    

**Getting Started**
- git clone [https://github.com/tzmehedy/Event_Management_Server.git](https://github.com/tzmehedy/Event_Management_Server.git)
- cd event-mangement-server**
- npm install**

**Run**
- npm run dev        # Development
- npm run build      # Build

**Live Link**
- [https://eventmanagementserver-delta.vercel.app](https://eventmanagementserver-delta.vercel.app/)






