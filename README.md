# RhinoFeedback

A full-stack feedback collection platform that lets businesses gather user feedback, export reports as PDF or CSV, and receive email notifications — with JWT-based authentication and an admin dashboard.

## Features

- 📝 Collect and manage user feedback via a clean form interface
- 📄 Export feedback reports as **PDF** (PDFKit) or **CSV** (json2csv)
- 📧 Email notifications via **Nodemailer** on new feedback submission
- 🔐 JWT authentication for admin access
- 📊 Admin dashboard to view, filter, and manage all feedback
- 🌐 RESTful API with Express and MongoDB

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Email | Nodemailer |
| Export | PDFKit, json2csv |

## Getting Started

```bash
git clone https://github.com/bokhtier19/RhinoFeedback.git
cd RhinoFeedback

# Server
cd server
cp .env.example .env
npm install && npm run dev

# Client (new terminal)
cd client && npm install && npm run dev
```

### Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PORT=5000
```

## License
MIT