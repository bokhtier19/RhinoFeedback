import { useState } from "react";
import axios from "axios";
import React from "react";

const AdminLogin = ({ setIsAdmin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("http://localhost:5000/admin/login", {
                email,
                password,
            });
            localStorage.setItem("adminToken", res.data.token);
            setIsAdmin(true);
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mx-auto mt-12">
            <h2 className="text-xl font-bold mb-4">Admin Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
