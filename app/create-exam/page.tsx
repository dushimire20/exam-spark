/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import Image from "next/image"; // Import Image for displaying existing images
import { Loader2 } from "lucide-react"; // Import Loader2 icon

interface Question {
	questionText: string;
	choices: string[];
	// correctAnswer: string; // Old field
	correctAnswers: string[]; // New field for one or more correct answers
	image?: File | null;
	imageURL?: string; // To store existing image URL in edit mode
	questionType: 'single' | 'multiple'; // New field
}

type ConfirmButtonType = 'default' | 'danger' | 'success';

interface ModalState {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm?: () => void;
	confirmText?: string;
	isConfirmation: boolean;
	confirmButtonType?: ConfirmButtonType;
}

const CreateExam: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const editId = searchParams.get("editId");

	const [isEditMode, setIsEditMode] = useState(!!editId);
	const [title, setTitle] = useState("");
	const [examImage, setExamImage] = useState<File | null>(null);
	const [existingExamImageURL, setExistingExamImageURL] = useState<string | null>(null);
	const [duration, setDuration] = useState<number>(30); // Duration in minutes
	const [questions, setQuestions] = useState<Question[]>([
		{ questionText: "", choices: ["", ""], correctAnswers: [], image: null, imageURL: undefined, questionType: 'single' },
	]);
	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(isEditMode); // For loading exam data in edit mode
	const [modalState, setModalState] = useState<ModalState>({
		isOpen: false,
		title: "",
		message: "",
		isConfirmation: false,
		confirmButtonType: 'default',
	});

	useEffect(() => {
		if (editId) {
			setIsEditMode(true);
			setPageLoading(true);
			const fetchExamData = async () => {
				try {
					const res = await fetch(`/api/exams?id=${editId}`);
					if (!res.ok) throw new Error("Failed to fetch exam data for editing.");
					const data = await res.json();
					if (data.exam) {
						setTitle(data.exam.title);
						setExistingExamImageURL(data.exam.picture || null);
						setDuration(data.exam.duration || 30);
						setQuestions(data.exam.examQuestions.map((q: any) => ({
							questionText: q.questionName,
							choices: q.choices,
							// Handle backward compatibility for correctAnswer vs correctAnswers
							correctAnswers: q.correctAnswers && q.correctAnswers.length > 0 ? q.correctAnswers : (q.correctAnswer ? [q.correctAnswer] : []),
							image: null,
							imageURL: q.image || undefined,
							questionType: q.questionType || 'single', // Default to single if not present
						})));
					} else {
						throw new Error("Exam not found.");
					}
				} catch (error) {
					console.error(error);
					const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
					openModal("Error", `Failed to load exam data: ${errorMessage}. Redirecting...`, () => router.push("/manage-exams"), "OK", "danger");
				} finally {
					setPageLoading(false);
				}
			};
			fetchExamData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editId, router]);


	const openModal = (
		title: string,
		message: string,
		onConfirm?: () => void,
		confirmText?: string,
		confirmButtonType: ConfirmButtonType = 'default'
	) => {
		setModalState({
			isOpen: true,
			title,
			message,
			onConfirm,
			confirmText,
			isConfirmation: !!onConfirm,
			confirmButtonType,
		});
	};

	const closeModal = () => {
		setModalState({ isOpen: false, title: "", message: "", isConfirmation: false, confirmButtonType: 'default' });
	};

	const handleQuestionChange = (
		index: number,
		field: keyof Question,
		value: any
	) => {
		const newQuestions = [...questions];
		if (field === 'image' && value === null) {
			newQuestions[index].imageURL = undefined;
		}
		// When changing question type, reset correct answers
		if (field === 'questionType') {
			newQuestions[index].correctAnswers = [];
		}
		newQuestions[index][field] = value;
		setQuestions(newQuestions);
	};

	const handleCorrectAnswerChange = (qIndex: number, choiceValue: string, isChecked?: boolean) => {
		const newQuestions = [...questions];
		const question = newQuestions[qIndex];
		if (question.questionType === 'single') {
			question.correctAnswers = [choiceValue];
		} else { // 'multiple'
			const currentCorrectAnswers = question.correctAnswers || [];
			if (isChecked) {
				if (!currentCorrectAnswers.includes(choiceValue)) {
					question.correctAnswers = [...currentCorrectAnswers, choiceValue];
				}
			} else {
				question.correctAnswers = currentCorrectAnswers.filter(ans => ans !== choiceValue);
			}
		}
		setQuestions(newQuestions);
	};


	const handleChoiceChange = (qIndex: number, cIndex: number, value: string) => {
		const newQuestions = [...questions];
		const oldChoiceValue = newQuestions[qIndex].choices[cIndex];
		newQuestions[qIndex].choices[cIndex] = value;

		// Update correctAnswers if the changed choice was part of it
		const correctAnswers = newQuestions[qIndex].correctAnswers;
		if (correctAnswers.includes(oldChoiceValue)) {
			newQuestions[qIndex].correctAnswers = correctAnswers.map(ans => ans === oldChoiceValue ? value : ans).filter(ans => ans !== ""); // Filter out empty if value becomes empty
		}
		// If choice becomes empty and it was the only correct answer for single type, clear correctAnswers
		if (newQuestions[qIndex].questionType === 'single' && value === "" && correctAnswers.length === 1 && correctAnswers[0] === oldChoiceValue) {
			newQuestions[qIndex].correctAnswers = [];
		}

		setQuestions(newQuestions);
	};

	const addQuestion = () => {
		setQuestions([
			...questions,
			{ questionText: "", choices: ["", ""], correctAnswers: [], image: null, imageURL: undefined, questionType: 'single' },
		]);
	};

	const removeQuestion = (index: number) => {
		openModal(
			"Confirm Removal",
			"Are you sure you want to remove this question?",
			() => {
				setQuestions(questions.filter((_, i) => i !== index));
				closeModal();
			},
			"Remove",
			'danger' // Specify danger type for removal
		);
	};

	const addChoice = (qIndex: number) => {
		const newQuestions = [...questions];
		newQuestions[qIndex].choices.push("");
		setQuestions(newQuestions);
	};

	const removeChoice = (qIndex: number, cIndex: number) => {
		const newQuestions = [...questions];
		const removedChoice = newQuestions[qIndex].choices[cIndex];
		newQuestions[qIndex].choices.splice(cIndex, 1);

		// If the removed choice was among correct answers, remove it
		newQuestions[qIndex].correctAnswers = newQuestions[qIndex].correctAnswers.filter(
			(ans) => ans !== removedChoice
		);
		setQuestions(newQuestions);
	};

	const handleExamImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setExamImage(e.target.files?.[0] || null);
		if (e.target.files?.[0]) {
			setExistingExamImageURL(null); // Clear existing image URL if new one is selected
		}
	};

	const handleRemoveExamImage = () => {
		setExamImage(null);
		setExistingExamImageURL(null);
		const fileInput = document.getElementById('examImageInput') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	const handleQuestionImageChange = (qIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuestions = [...questions];
		newQuestions[qIndex].image = e.target.files?.[0] || null;
		if (e.target.files?.[0]) {
			newQuestions[qIndex].imageURL = undefined; // Clear existing URL if new file selected
		}
		setQuestions(newQuestions);
	};

	const handleRemoveQuestionImage = (qIndex: number) => {
		const newQuestions = [...questions];
		newQuestions[qIndex].image = null;
		newQuestions[qIndex].imageURL = undefined; // Also clear the URL
		setQuestions(newQuestions);
		// Reset file input by ID if you assign unique IDs to question image inputs
		const fileInput = document.getElementById(`questionImageInput-${qIndex}`) as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
	};

	const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation: Ensure each question has at least one correct answer selected
		for (const q of questions) {
			if (q.choices.filter(c => c.trim() !== "").length > 0 && q.correctAnswers.length === 0) {
				openModal("Validation Error", `Question "${q.questionText.substring(0, 30)}..." must have at least one correct answer selected. Please review and select correct answer(s).`, undefined, "OK", "danger");
				return;
			}
		}

		setLoading(true);

		try {
			let pictureBase64: string | undefined = undefined;
			if (examImage) { // New image uploaded
				pictureBase64 = await fileToBase64(examImage);
			} else if (isEditMode && existingExamImageURL) {
				// In edit mode, if no new image is uploaded but an existing one was there,
				// we might need to send the URL or a flag to keep it.
				// For simplicity, if pictureBase64 is undefined, API can choose to keep old image.
				// Or, send existingExamImageURL to API to explicitly state "keep this image".
				// Current API POST expects pictureBase64. PUT needs to be more flexible.
			}


			const examQuestionsPayload = await Promise.all(
				questions.map(async (q) => ({
					questionName: q.questionText,
					choices: q.choices,
					correctAnswers: q.correctAnswers, // Use correctAnswers
					questionType: q.questionType,     // Send questionType
					image: q.image ? await fileToBase64(q.image) : (isEditMode && q.imageURL ? q.imageURL : undefined),
				}))
			);

			const payload = {
				title,
				duration, // Add duration to payload
				examQuestions: examQuestionsPayload,
				...(pictureBase64 && { pictureBase64 }), // Only include if new image is uploaded
				...(isEditMode && !pictureBase64 && existingExamImageURL && { existingPictureURL: existingExamImageURL }), // Signal to keep existing
			};

			const url = isEditMode ? `/api/exams?id=${editId}` : "/api/exams";
			const method = isEditMode ? "PUT" : "POST";

			const response = await fetch(url, {
				method: method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				let errorMessage = `Failed to ${isEditMode ? 'update' : 'submit'} exam. Status: ${response.status}`;
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorData.error || errorMessage;
				} catch (jsonError) {
					// If response is not JSON, try to get text
					const errorText = await response.text();
					console.error("Server response was not JSON. Raw response:", errorText);
					errorMessage += ` - Server response: ${errorText.substring(0, 100)}${errorText.length > 100 ? "..." : ""}`;
				}
				throw new Error(errorMessage);
			}

			const successMessage = isEditMode ? "Exam updated successfully!" : "Exam created successfully!";
			openModal("Success", successMessage, () => {
				if (isEditMode) {
					router.push("/manage-exams");
				} else {
					// Reset form for creation
					setTitle("");
					setExamImage(null);
					setExistingExamImageURL(null);
					setDuration(30);
					setQuestions([{ questionText: "", choices: ["", ""], correctAnswers: [], image: null, imageURL: undefined, questionType: 'single' }]);
					const fileInput = document.getElementById('examImageInput') as HTMLInputElement;
					if (fileInput) fileInput.value = "";
					questions.forEach((_, qIndex) => {
						const qFileInput = document.getElementById(`questionImageInput-${qIndex}`) as HTMLInputElement;
						if (qFileInput) qFileInput.value = "";
					});
				}
			}, "OK", 'success');

		} catch (error) {
			console.error("handleSubmit error:", error); // Log the full error object to the browser console
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
			// Add a note to check server logs for more details
			openModal("Error", `Client error: ${errorMessage}. Please check the server console for more details if this is a server-side issue.`, undefined, undefined, 'danger');
		} finally {
			setLoading(false);
		}
	};

	if (pageLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center md:my-32 py-10"> {/* Adjusted min-height and added padding like the main content */}
				<Loader2 className="animate-spin w-12 h-12 text-gray-700 mb-4" />
				<p className="text-xl text-gray-700">Loading exam data for editing...</p>
				<p className="text-sm text-gray-500">Please wait a moment.</p>
			</div>
		);
	}

	return (
		<>
			<Modal
				isOpen={modalState.isOpen}
				onClose={closeModal}
				title={modalState.title}
				message={modalState.message}
				onConfirm={modalState.onConfirm}
				confirmText={modalState.confirmText}
				confirmButtonType={modalState.confirmButtonType}
			/>
			<div className="md:my-32 py-10">
				<div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-2xl">
					<h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
						{isEditMode ? "Edit Exam" : "Create New Exam"}
					</h1>
					<form onSubmit={handleSubmit} className="space-y-8">
						<div>
							<label htmlFor="examTitle" className="block font-medium mb-1 text-gray-700">Exam Title</label>
							<input
								id="examTitle"
								type="text"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>

						<div>
							<label htmlFor="examDuration" className="block font-medium mb-1 text-gray-700">Duration (minutes)</label>
							<input
								id="examDuration"
								type="number"
								min="1"
								className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
								value={duration}
								onChange={(e) => setDuration(parseInt(e.target.value, 10) || 30)}
								required
							/>
						</div>

						<div>
							<label htmlFor="examImageInput" className="block font-medium mb-1 text-gray-700">Exam Cover Image</label>
							<input
								id="examImageInput"
								type="file"
								accept="image/*"
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
								onChange={handleExamImageChange}
							/>
							{(examImage || existingExamImageURL) && (
								<div className="mt-2">
									<Image // Use Next/Image for consistency and optimization
										src={examImage ? URL.createObjectURL(examImage) : existingExamImageURL!}
										alt="Exam Cover Preview"
										width={200} // Provide explicit width
										height={120} // Provide explicit height
										className="max-h-40 object-contain rounded-md border border-gray-200"
									/>
									<button
										type="button"
										onClick={handleRemoveExamImage}
										className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
										aria-label="Remove exam cover image"
									>
										Remove Image
									</button>
								</div>
							)}
						</div>

						{questions.map((q, qIndex) => (
							<div key={qIndex} className="border border-gray-200 p-4 rounded-lg shadow-sm space-y-4 bg-gray-50">
								<div className="flex justify-between items-center mb-3">
									<h2 className="text-xl font-semibold text-gray-700">Question {qIndex + 1}</h2>
									{questions.length > 1 && (
										<button
											type="button"
											onClick={() => removeQuestion(qIndex)}
											className="text-red-600 hover:text-red-800 font-medium text-sm"
										>
											Remove Question
										</button>
									)}
								</div>

								<div className="mb-3">
									<label htmlFor={`questionType-${qIndex}`} className="block font-medium mb-1 text-gray-700">Question Type</label>
									<select
										id={`questionType-${qIndex}`}
										className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
										value={q.questionType}
										onChange={(e) =>
											handleQuestionChange(qIndex, "questionType", e.target.value as 'single' | 'multiple')
										}
									>
										<option value="single">Single Correct Answer</option>
										<option value="multiple">Multiple Correct Answers</option>
									</select>
								</div>

								<div className="mb-3">
									<label htmlFor={`questionText-${qIndex}`} className="block font-medium mb-1 text-gray-700">Question Text</label>
									<textarea
										id={`questionText-${qIndex}`}
										className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
										value={q.questionText}
										onChange={(e) =>
											handleQuestionChange(qIndex, "questionText", e.target.value)
										}
										required
										rows={3}
									/>
								</div>

								<div className="mb-3">
									<label htmlFor={`questionImageInput-${qIndex}`} className="block font-medium mb-1 text-gray-700">Optional Question Image</label>
									<input
										id={`questionImageInput-${qIndex}`}
										type="file"
										accept="image/*"
										className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
										onChange={(e) => handleQuestionImageChange(qIndex, e)}
									/>
									{(q.image || q.imageURL) && (
										<div className="mt-2">
											<Image // Use Next/Image
												src={q.image ? URL.createObjectURL(q.image) : q.imageURL!}
												alt={`Question ${qIndex + 1} Preview`}
												width={200} // Provide explicit width
												height={120} // Provide explicit height
												className="max-h-40 object-contain rounded-md border border-gray-200"
											/>
											<button
												type="button"
												onClick={() => handleRemoveQuestionImage(qIndex)}
												className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
												aria-label={`Remove image for question ${qIndex + 1}`}
											>
												Remove Image
											</button>
										</div>
									)}
								</div>

								<div className="mb-3">
									<label className="block font-medium mb-1 text-gray-700">Choices</label>
									{q.choices.map((choice, cIndex) => (
										<div key={cIndex} className="flex items-center space-x-2 mb-2">
											<textarea
												className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
												placeholder={`Choice ${cIndex + 1}`}
												value={choice}
												onChange={(e) =>
													handleChoiceChange(qIndex, cIndex, e.target.value)
												}
												required
												rows={2}
											/>
											{q.choices.length > 2 && (
												<button
													type="button"
													onClick={() => removeChoice(qIndex, cIndex)}
													className="text-red-500 hover:text-red-700 text-sm p-1"
													aria-label={`Remove choice ${cIndex + 1}`}
												>
													Remove
												</button>
											)}
										</div>
									))}
									<button
										type="button"
										onClick={() => addChoice(qIndex)}
										className="mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
									>
										Add Choice
									</button>
								</div>

								<div className="mb-3">
									<label htmlFor={`correctAnswer-${qIndex}`} className="block font-medium mb-1 text-gray-700">Correct Answer(s)</label>
									{q.questionType === 'single' ? (
										<select
											id={`correctAnswer-${qIndex}`}
											className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
											value={q.correctAnswers[0] || ""}
											onChange={(e) =>
												handleCorrectAnswerChange(qIndex, e.target.value)
											}
											required={q.choices.filter(c => c.trim() !== "").length > 0} // Required if choices exist
										>
											<option value="">Select correct answer</option>
											{q.choices
												.filter((choice) => choice.trim() !== "")
												.map((choice, i) => (
													<option key={i} value={choice}>
														{choice}
													</option>
												))}
										</select>
									) : (
										<div className="space-y-2">
											{q.choices
												.filter((choice) => choice.trim() !== "")
												.map((choice, i) => (
													<label key={i} className="flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer">
														<input
															type="checkbox"
															className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
															value={choice}
															checked={q.correctAnswers.includes(choice)}
															onChange={(e) =>
																handleCorrectAnswerChange(qIndex, choice, e.target.checked)
															}
														/>
														{choice}
													</label>
												))}
											{q.choices.filter(c => c.trim() !== "").length === 0 && <p className="text-sm text-gray-500">Add choices to select correct answers.</p>}
										</div>
									)}
								</div>
							</div>
						))}

						<div className="flex justify-between items-center mt-6">
							<button
								type="button"
								onClick={addQuestion}
								className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium"
							>
								Add Another Question
							</button>

							<button
								type="submit"
								className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold disabled:opacity-70"
								disabled={loading || pageLoading || questions.some(q => q.choices.filter(c => c.trim() !== "").length > 0 && q.correctAnswers.length === 0)}
							>
								{loading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Exam" : "Submit Exam")}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default CreateExam;
