import express, { json } from "express";
import cors from "cors";
import Feedback from "./models/Feedback.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

const mongoURI = process.env.MONGO_URI;
const SECRET = process.env.SECRET;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

mongoose
    .connect(mongoURI)
    .then(() => console.log("📦 Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Login Route
app.post("/admin/login", (req, res) => {
    const { email, password } = req.body;
    // Hardcoded creds for now
    if (email === "admin@rhino.com" && password === "rhino123") {
        const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// Middleware to protect admin routes
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token" });
    }
};

// POST /feedback
app.post("/feedback", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const feedback = new Feedback({ name, email, message });
        await feedback.save();

        // Send email notification
        await transporter.sendMail({
            from: `"RhinoFeedback" $ <{process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "New Feedback Received",
            html: `
                <h1>New Feedback Received</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p>Best Regards,</p>
                <p>RhinoFeedback</p>
                <p><small>This is an automated message. Please do not reply.</small></p>

            `,
        });

        res.status(201).json({ message: "Feedback saved successfully and mail sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save feedback" });
    }
});

// Getting all the feedbacks from the Database

app.get("/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // latest first
        res.json(feedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
});

// Exporting feedbacks as pdf
app.get("/feedback/export-pdf", verifyAdmin, async (req, res) => {
    try {
        const feedbacks = await Feedback.find().lean();

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=feedbacks.pdf");

        doc.pipe(res);

        doc.fontSize(20).text("Feedbacks Report", { underline: true });
        doc.moveDown();

        feedbacks.forEach((fb, index) => {
            doc.fontSize(12)
                .text(`#${index + 1}`)
                .text(`Name: ${fb.name}`)
                .text(`Email: ${fb.email}`)
                .text(`Message: ${fb.message}`)
                .text(`Date: ${new Date(fb.createdAt).toLocaleString()}`)
                .moveDown();
        });

        doc.end();
    } catch (err) {
        console.error("PDF Export Error:", err);
        res.status(500).json({ error: "Failed to export as PDF" });
    }
});

// DELETE + PDF Export – Only for admin
app.delete("/feedback/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Feedback.findByIdAndDelete(id);
        res.status(200).json({ message: "Feedback deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete feedback" });
    }
});

// Start in-memory MongoDB + Express server
const startServer = async () => {
    try {
        app.listen(5000, () => {
            console.log("🚀 Server running on http://localhost:5000");
        });
    } catch (err) {
        console.error("❌ Error starting server:", err);
    }
};

startServer();
