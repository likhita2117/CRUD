require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true, collection: 'users' });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;

const adminUsername = "Lokesh";
const adminRawPassword = "password";
const username_db = process.env.ADMIN_USERNAME;
const password_db = process.env.ADMIN_PASSWORD;
const dbUri = `mongodb+srv://${username_db}:${password_db}@node-practice.nyxbhhf.mongodb.net/MCQ-Battle`;

// mongoose.connect(dbUri)
//   .then(async () => {
//     console.log("Connected to DB");

//     const existing = await Admin.findOne({ username: adminUsername });
//     if (existing) {
//       console.log("Admin already exists. Not creating again.");
//       return mongoose.disconnect();
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(adminRawPassword, salt);

//     const admin = new Admin({ username: adminUsername, password: hashedPassword });
//     await admin.save();
//     console.log("Admin user created successfully.");
//     mongoose.disconnect();
//   })
//   .catch((error) => console.log("Connection error:", error));
