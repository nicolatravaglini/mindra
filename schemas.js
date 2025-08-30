import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    googleId: String,
    email: String,
    name: String,
    picture: String,
});

const CourseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    materialIds: [{ type: Schema.Types.ObjectId, ref: "Material" }],
    course: [
        {
            title: String,
            description: String,
            micro: [
                {
                    title: String,
                    description: String,
                    content: String,
                    estimatedPomodoros: Number,
                    quizzes: [String],
                },
            ],
        },
    ],
    progress: [
        {
            macroIndex: Number,
            microIndex: Number,
            quizIndex: Number,
            answer: String,
            valutation: Number,
            comment: String,
        },
    ],
});

const MaterialSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    fileName: String,
    content: String,
});

const User = model("User", UserSchema);
const Course = model("Course", CourseSchema);
const Material = model("Material", MaterialSchema);

export { User, Course, Material };
