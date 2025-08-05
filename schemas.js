import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Schemas
const UserSchema = new Schema({
    googleId: String,
    email: String,
    name: String,
    picture: String,
});

const CourseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
});

const User = model("User", UserSchema);
const Course = model("Course", CourseSchema);

export { User, Course };
