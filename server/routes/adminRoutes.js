const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Get all users (Admin Only)
router.get("/users", auth, auth.isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update user role (Admin Only)
router.put("/users/:id/role", auth, auth.isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!["admin", "user", "hr"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.json({ message: `User role updated to ${role} successfully` });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
