const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load local .env from server directory
dotenv.config({ path: path.join(__dirname, ".env") });

// User Model
const User = require("./models/User");

const seedAdmin = async () => {
    try {
        console.log("🚀 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🟢 Connected!");

        const email = "roshanafazf@gmail.com";
        const passwordPrefill = "1234";
        const hashedPassword = await bcrypt.hash(passwordPrefill, 10);

        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (user) {
            console.log("🛡️ User Detected! Promoting to Admin AND Resetting Password to 1234...");
            user.role = "admin";
            user.password = hashedPassword;
            user.name = "Roshan Afaz"; // Ensure name is set
            await user.save();
            console.log("✅ Admin credentials reset successfully!");
        } else {
            console.log("✨ Creating NEW Admin account...");
            user = new User({
                name: "Roshan Afaz",
                email: email,
                password: hashedPassword,
                role: "admin",
                department: "IT"
            });
            await user.save();
            console.log("👑 New Admin seeded successfully!");
        }

        console.log("📧 Email:", email);
        console.log("🔑 Password:", passwordPrefill);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
};

seedAdmin();
