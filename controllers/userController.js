const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users'
});

//@desc Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
    const { user_id, username, email, password } = req.body;

    try {
        if (!user_id || !username || !email || !password) {
            res.status(400).json({ message: "All fields are mandatory" });
            return;
        }

        // Check if the username or email already exists
        con.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, results) => {
            if (err) {
                res.status(500).json({ message: "Internal Server Error" });
            } else {
                if (results.length > 0) {
                    // User with the same username or email already exists
                    res.status(409).json({ message: "User already exists" });
                } else {
                    // Hash the password using bcrypt
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // Insert the new user into the database
                    const query = "INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)";
                    const values = [user_id, username, email, hashedPassword];

                    con.query(query, values, (err, result) => {
                        if (err) {
                            console.error("Database insertion error:", err);
                            res.status(500).json({ message: "Failed to create a new user in the database" });
                        } else {
                            res.status(201).json({ message: "Create new user successfully", userId: result.insertId });
                        }
                    });
                }
            }
        });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});

//@desc login a User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    res.json({ message: "login User" });
});

//@desc Current User info
//@route POST /api/users/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "Current user info" });
});

module.exports = { registerUser, loginUser, currentUser };
