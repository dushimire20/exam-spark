// models/Exam.ts
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	questionName: { type: String, required: true },
	image: String,
	choices: [{ type: String, required: true }],
	correctAnswer: { type: String, required: true },
});

const examSchema = new mongoose.Schema({
	title: { type: String, required: true },
	picture: String,
	examQuestions: [questionSchema],
}, { timestamps: true });

export const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
