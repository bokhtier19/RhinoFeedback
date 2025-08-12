import { useState, useEffect } from "react";
import React from "react";
import AdminLogin from "./components/AdminLogin";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";

function App() {
    const [refreshSignal, setRefreshSignal] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) setIsAdmin(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        setIsAdmin(false);
    };

    return (
        <div className="grid grid-[1fr_2fr] min-h-screen bg-gray-100 p-4 gap-4">
            {isAdmin ? (
                <>
                    <div className="">
                        <div className="flex justify-end gap-4">
                            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                                Logout
                            </button>
                        </div>
                        <FeedbackForm onSuccess={() => setRefreshSignal((prev) => prev + 1)} />
                    </div>
                    <FeedbackList refreshSignal={refreshSignal} isAdmin={isAdmin} />
                </>
            ) : (
                <AdminLogin setIsAdmin={setIsAdmin} />
            )}
        </div>
    );
}

export default App;
