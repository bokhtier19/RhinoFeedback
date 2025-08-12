import { useState } from "react";
import React from "react";
import axios from "axios";

const FeedbackForm = ({ onSubmitted }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [status, setStatus] = useState("idle");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            await axios.post("http://localhost:5000/feedback", form);
            setStatus("success");
            setForm({ name: "", email: "", message: "" });
            onSubmitted(); // Notify parent component to refresh feedback list
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-white mt-10 gap-4 w-3/5">
            <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full p-2 border rounded" required />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email" className="w-full p-2 border rounded" required />
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" className="w-full p-2 border rounded h-24" required />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition hover:cursor-pointer" disabled={status === "loading"}>
                    {status === "loading" ? "Sending..." : "Send Feedback"}
                </button>

                {status === "success" && <p className="text-green-600 text-sm">Feedback sent!</p>}
                {status === "error" && <p className="text-red-600 text-sm">Something went wrong.Please Try again!</p>}
            </form>
        </div>
    );
};

export default FeedbackForm;
