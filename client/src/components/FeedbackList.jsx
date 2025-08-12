import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

const FeedbackList = ({ refreshSignal }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/feedback");
            setFeedbacks(res.data);
        } catch (err) {
            console.error("Error fetching feedbacks:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return; // Confirm deletion

        try {
            await axios.delete(`http://localhost:5000/feedback/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });

            fetchFeedbacks(); // Refresh feedbacks after deletion
        } catch (err) {
            console.error("Error deleting feedback:", err);
        }
    };

    const handleExportPDF = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("http://localhost:5000/feedback/export-pdf", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "feedbacks.pdf";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Failed to export PDF:", err);
            alert("Export failed. Are you logged in as admin?");
        }
    };

    const filteredFeedbacks = feedbacks.filter((fb) => `${fb.name} ${fb.email}`.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        fetchFeedbacks();
    }, [refreshSignal]); // re-fetch when signal changes

    return (
        <div className="bg-white shadow rounded-xl p-6 flex flex-col gap-4 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">Feedbacks</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-300" onClick={handleExportPDF}>
                    Export Feedbacks (PDF)
                </button>
            </div>

            <input
                type="text"
                placeholder="Search by name or email"
                className="border w-2/5 rounded px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredFeedbacks.length === 0 ? (
                <p className="text-gray-400 italic text-center mt-4">No feedbacks yet. Be the first to speak up! 🗣️</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFeedbacks.map((fb) => (
                        <div key={fb._id} className="bg-gray-100 p-4 rounded-lg shadow flex flex-col gap-2">
                            <p className="font-semibold">
                                {fb.name} ({fb.email})
                            </p>
                            <p className="text-sm text-gray-600">{fb.message}</p>
                            <p className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString()}</p>
                            <button className="text-red-500 hover:text-red-700 hover:cursor-pointer mt-2 inline-block justify-end text-end" onClick={() => handleDelete(fb._id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
