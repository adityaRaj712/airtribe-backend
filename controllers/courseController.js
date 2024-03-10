const asyncHandler = require("express-async-handler")
const mysql = require("mysql");
const con = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:"courses_database"
})
//@desc Get all courses
//@route GET /api/course
//@access public
const getCourses = asyncHandler(async (req, res) => {
    con.query("SELECT * FROM courses", (err, result) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.json({ courses: result, message: "All courses fetched successfully" });
        }
    });
});




//@desc create new courses
//@route POST /api/course
//@access public
const createCourse = asyncHandler(async (req, res, next) => {
    console.log("The request body is:", req.body);
    const { id, Name, description, educator, price } = req.body;

    try {
        if (!id ||!Name || !description || !educator || !price) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }

         const query = "INSERT INTO courses (id, Name, description, educator, price) VALUES (?, ?, ?, ?, ?)";
         const values = [id, Name, description, educator, price];
 
         con.query(query, values, (err, result) => {
            if (err) {
                console.error("Database insertion error:", err);
                res.status(500).json({ message: "Failed to create a new course in the database" });
            } else {
                res.status(201).json({ message: "Create new course successfully", courseId: result.insertId });
            }
        });
        
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});


//@desc update course by id
//@route PUT /api/courses/1
//@access public
const updateCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const { id, Name, description, educator, price } = req.body; // Assuming data is sent in the request body

    // Check if the course with the given ID exists
    con.query("SELECT * FROM courses WHERE id = ?", [courseId], (err, results) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: "Course not found" });
            } else {
                // Update the course details
                con.query("UPDATE courses SET name = ?, description = ?, educator = ?, price = ? WHERE id = ?", [Name, description, educator, price, courseId], (err, result) => {
                    if (err) {
                        res.status(500).json({ message: "Internal Server Error" });
                    } else {
                        res.status(200).json({ message: "Course updated successfully" });
                    }
                });
            }
        }
    });
});

//@desc delete courses by id
//@route DELETE /api/course/1
//@access public
const deleteCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    con.query("DELETE FROM courses WHERE id = ?", [courseId], (err, result) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: `Course with id ${courseId} not found` });
            } else {
                res.status(200).json({ message: `Delete course for ${courseId}` });
            }
        }
    });
});


//@desc Get course by id
//@route GET /api/courses/2
//@access public
const getCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;

    con.query("SELECT * FROM courses WHERE id = ?", [courseId], (err, result) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: `Course with id ${courseId} not found` });
            } else {
                res.status(200).json({ course: result[0] });
            }
        }
    });
});





module.exports = {getCourses, createCourse, updateCourse, deleteCourse, getCourse};


