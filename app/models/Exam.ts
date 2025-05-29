// models/Exam.ts
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	questionName: { type: String, required: true },
	image: String,
	choices: [{ type: String, required: true }],
	questionType: { type: String, enum: ['single', 'multiple'], default: 'single' },
	correctAnswers: { type: [String], default: [] },
});

// Add a validator to ensure correctAnswers is not empty if choices are present
questionSchema.path('correctAnswers').validate(function (value) {
	// `this` refers to the document being validated
	// Allow empty correctAnswers if there are no choices (though unlikely for a valid question)
	if (this.choices && this.choices.length > 0) {
		return value && value.length > 0;
	}
	return true; // If no choices, validation passes (or handle as error if choices are always required)
}, 'At least one correct answer must be specified if choices are provided.');


const examSchema = new mongoose.Schema({
	title: { type: String, required: true },
	picture: String,
	examQuestions: [questionSchema],
	duration: { type: Number, default: 30 },
}, { timestamps: true });

export const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
