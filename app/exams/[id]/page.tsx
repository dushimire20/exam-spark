/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Clock, CheckCircle, PlayCircle, Info, RotateCcw, ListChecks, XCircle, Check, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import Modal from "@/app/components/Modal";

type ExamHeaderProps = {
	title: string;
	timeLeft: number;
};

const formatTime = (sec: number) => {
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	return `${m}:${s < 10 ? "0" + s : s}`;
};

const ExamHeader = ({ title, timeLeft }: ExamHeaderProps) => (
	<div className="flex justify-between items-center mb-6">
		<h1 className="text-3xl font-bold text-gray-800">{title}</h1>
		<div className="flex items-center gap-2 text-red-600 text-lg font-semibold">
			<Clock className="w-5 h-5" />
			<span>{formatTime(timeLeft)}</span>
		</div>
	</div>
);

// Updated Question type to match the backend model
type Question = {
	_id?: string; // Mongoose subdocument ID
	questionName: string;
	image?: string;
	choices: string[];
	questionType: 'single' | 'multiple';
	correctAnswers: string[]; // Changed from correctAnswer
};

// Updated Exam type for fetched data
type ExamData = {
	_id: string;
	title: string;
	examQuestions: Question[];
	duration?: number;
	picture?: string;
};


type QuestionDisplayProps = {
	question: Question;
	index: number;
	total: number;
	selectedAnswer: string | string[]; // Can be a single string or an array of strings
	onAnswerChange: (questionIndex: number, answer: string | string[]) => void;
};

const QuestionDisplay = ({
	question,
	index,
	total,
	selectedAnswer,
	onAnswerChange,
}: QuestionDisplayProps) => {
	const handleSingleChoiceChange = (choice: string) => {
		onAnswerChange(index, choice);
	};

	const handleMultipleChoiceChange = (choice: string, isChecked: boolean) => {
		const currentAnswers = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
		if (isChecked) {
			if (!currentAnswers.includes(choice)) {
				currentAnswers.push(choice);
			}
		} else {
			const choiceIndex = currentAnswers.indexOf(choice);
			if (choiceIndex > -1) {
				currentAnswers.splice(choiceIndex, 1);
			}
		}
		onAnswerChange(index, currentAnswers);
	};

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4 text-gray-700">
				Question {index + 1} of {total}
			</h2>
			{question.questionType === 'multiple' && (
				<p className="text-sm text-gray-500 mb-3">(Select all that apply)</p>
			)}

			{question.image && (
				<div className="w-full mb-4">
					<Image
						src={question.image}
						alt={`Question ${index + 1}`}
						width={600}
						height={400}
						className="rounded-lg object-cover"
					/>
				</div>
			)}

			<p className="mb-4 text-gray-800 text-lg font-medium whitespace-pre-line leading-relaxed">
				{question.questionName}
			</p>

			<div className="space-y-3">
				{question.choices.map((opt, i) => {
					if (question.questionType === 'single') {
						const isSelected = selectedAnswer === opt;
						return (
							<label
								key={i}
								className={`flex items-center border px-4 py-3 rounded-md whitespace-pre-line cursor-pointer transition ${isSelected
									? "bg-blue-50 border-blue-600"
									: "hover:bg-gray-50 border-gray-300"
									}`}
							>
								<input
									type="radio"
									name={`question-${index}`}
									value={opt}
									checked={isSelected}
									onChange={() => handleSingleChoiceChange(opt)}
									className="mr-3"
								/>
								<span className="text-gray-700 font-medium">{opt}</span>
							</label>
						);
					} else { // multiple
						const isSelected = Array.isArray(selectedAnswer) && selectedAnswer.includes(opt);
						return (
							<label
								key={i}
								className={`flex items-center border px-4 py-3 rounded-md whitespace-pre-line cursor-pointer transition ${isSelected
									? "bg-blue-50 border-blue-600"
									: "hover:bg-gray-50 border-gray-300"
									}`}
							>
								<input
									type="checkbox"
									name={`question-${index}-${i}`}
									value={opt}
									checked={isSelected}
									onChange={(e) => handleMultipleChoiceChange(opt, e.target.checked)}
									className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span className="text-gray-700 font-medium">{opt}</span>
							</label>
						);
					}
				})}
			</div>
		</div>
	);
};


type ResultsDisplayProps = {
	exam: ExamData; // Use updated ExamData type
	answers: { [key: number]: string | string[] }; // Answers can be string or string array
	score: number;
	timeTaken: number;
	totalDuration: number;
	onRetakeExam: () => void;
};

const ResultsDisplay = ({ exam, answers, score, timeTaken, totalDuration, onRetakeExam }: ResultsDisplayProps) => {
	const router = useRouter();
	const percentage = totalDuration > 0 ? ((totalDuration - timeTaken) / totalDuration * 100) : 0;


	return (
		<div className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-2xl">
			<h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">{exam.title}</h1>
			<p className="text-lg text-gray-600 mb-6 text-center">Exam Results</p>

			{/* Summary Section */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg border">
				<div className="text-center">
					<p className="text-sm font-semibold text-gray-500 mb-1">SCORE</p>
					<p className={`text-2xl font-bold ${score / exam.examQuestions.length >= 0.5 ? 'text-green-600' : 'text-red-600'}`}>
						{score} / {exam.examQuestions.length}
					</p>
				</div>
				<div className="text-center">
					<p className="text-sm font-semibold text-gray-500 mb-1">TIME TAKEN</p>
					<p className="text-2xl font-bold text-gray-700">{formatTime(totalDuration - timeTaken)}</p>
				</div>
				<div className="text-center">
					<p className="text-sm font-semibold text-gray-500 mb-1">TOTAL DURATION</p>
					<p className="text-2xl font-bold text-gray-700">{formatTime(totalDuration)}</p>
				</div>
			</div>


			{exam.examQuestions.map((q, idx) => {
				const userAnswer = answers[idx];
				const isUnanswered = userAnswer === undefined || (Array.isArray(userAnswer) && userAnswer.length === 0);
				let isCorrectUserAnswer = false;

				if (!isUnanswered) {
					if (q.questionType === 'single') {
						isCorrectUserAnswer = userAnswer === q.correctAnswers[0];
					} else { // multiple
						const sortedUserAnswers = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
						const sortedCorrectAnswers = [...q.correctAnswers].sort();
						isCorrectUserAnswer = JSON.stringify(sortedUserAnswers) === JSON.stringify(sortedCorrectAnswers);
					}
				}

				return (
					<div key={idx} className="mb-6 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
						<div className="flex justify-between items-start mb-2">
							<h2 className="text-lg sm:text-xl font-semibold text-gray-700">
								Question {idx + 1} ({q.questionType === 'multiple' ? 'Multiple Choice' : 'Single Choice'})
							</h2>
							{isUnanswered ? (
								<span className="flex items-center text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
									<Clock className="w-3 h-3 mr-1" /> Unanswered
								</span>
							) : isCorrectUserAnswer ? (
								<span className="flex items-center text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
									<CheckCircle className="w-3 h-3 mr-1" /> Correct
								</span>
							) : (
								<span className="flex items-center text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
									<XCircle className="w-3 h-3 mr-1" /> Incorrect
								</span>
							)}
						</div>

						{q.image && (
							<Image
								src={q.image}
								alt={`Question ${idx + 1}`}
								width={600}
								height={400}
								className="rounded-lg mb-3 object-contain max-h-80 w-auto mx-auto" // Adjusted image styling
							/>
						)}

						<p className="mb-3 text-gray-800 font-medium whitespace-pre-line leading-relaxed">{q.questionName}</p>

						<ul className="space-y-2">
							{q.choices.map((choice, i) => {
								const isCorrectChoice = q.correctAnswers.includes(choice);
								let isUserSelectedChoice = false;
								if (q.questionType === 'single') {
									isUserSelectedChoice = choice === userAnswer;
								} else {
									isUserSelectedChoice = Array.isArray(userAnswer) && userAnswer.includes(choice);
								}

								let itemClass = "border-gray-200 bg-gray-50";
								if (isCorrectChoice) {
									itemClass = "border-green-500 bg-green-50 text-green-800";
								}
								if (isUserSelectedChoice && !isCorrectChoice) {
									itemClass = "border-red-400 bg-red-50 text-red-800";
								}
								// If it's a correct choice and user selected it (for multiple choice, this is handled by the green above)
								if (isUserSelectedChoice && isCorrectChoice && q.questionType === 'multiple') {
									itemClass = "border-green-500 bg-green-50 text-green-800";
								}


								return (
									<li
										key={i}
										className={`px-4 py-3 rounded-md border transition flex items-center justify-between text-sm ${itemClass}`}
									>
										<span className="whitespace-pre-line">{choice}</span>
										<div className="flex items-center">
											{isUserSelectedChoice && (
												<span className={`text-xs font-semibold mr-2 ${isCorrectChoice ? 'text-green-700' : 'text-red-600'}`}>
													(Your Answer)
												</span>
											)}
											{isCorrectChoice && <Check className="w-4 h-4 text-green-600" />}
											{isUserSelectedChoice && !isCorrectChoice && <XCircle className="w-4 h-4 text-red-500" />}
										</div>
									</li>
								);
							})}
						</ul>
						{!isUnanswered && !isCorrectUserAnswer && (
							<p className="mt-2 text-sm text-green-700">
								Correct Answer(s): <span className="font-semibold">{q.correctAnswers.join(", ")}</span>
							</p>
						)}

						{isUnanswered && (
							<p className="mt-2 text-sm text-red-600 font-semibold">
								You did not answer this question. The correct answer(s) was/were: <span className="font-bold">{q.correctAnswers.join(", ")}</span>
							</p>
						)}
					</div>
				);
			})}

			{/* Action Buttons */}
			<div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
				<button
					onClick={onRetakeExam}
					className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
				>
					<RotateCcw className="w-5 h-5" />
					Retake Exam
				</button>
				<Link
					href="/exams"
					className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
				>
					<ListChecks className="w-5 h-5" />
					Back to All Exams
				</Link>
			</div>
		</div>
	);
};

type PreExamScreenProps = {
	exam: ExamData; // Use updated ExamData type
	onStartExam: () => void;
};

const PreExamScreen = ({ exam, onStartExam }: PreExamScreenProps) => {
	const durationMinutes = exam.duration || 30; // Use exam.duration directly
	const numberOfQuestions = exam.examQuestions.length;

	return (
		<div className="w-full md:w-[80%] lg:w-[65%] mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-xl text-center">
			<Info className="w-16 h-16 text-blue-600 mx-auto mb-6" />
			<h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">You are about to start:</h1>
			<p className="text-xl sm:text-2xl text-primary font-semibold mb-6">{exam.title}</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
				<div className="bg-gray-100 p-4 rounded-lg">
					<h3 className="text-sm font-semibold text-gray-500 mb-1">DURATION</h3>
					<p className="text-lg text-gray-700 font-medium">{durationMinutes} minutes</p>
				</div>
				<div className="bg-gray-100 p-4 rounded-lg">
					<h3 className="text-sm font-semibold text-gray-500 mb-1">QUESTIONS</h3>
					<p className="text-lg text-gray-700 font-medium">{numberOfQuestions} questions</p>
				</div>
			</div>

			<p className="text-gray-600 mb-2 text-sm sm:text-base">
				Please ensure you have a stable internet connection and a quiet environment. Once you start, the timer will begin.
			</p>
			<p className="text-gray-500 text-xs sm:text-sm mb-8 font-medium">
				Note: The exam will attempt to enter fullscreen mode automatically.
			</p>
			<button
				onClick={onStartExam}
				className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center gap-2 mx-auto"
			>
				<PlayCircle className="w-6 h-6" />
				Start Exam
			</button>
		</div>
	);
};

// Define ModalState type, similar to CreateExam page
type ConfirmButtonType = 'default' | 'danger' | 'success';
interface ModalState {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm?: () => void;
	confirmText?: string;
	isConfirmation: boolean; // To differentiate between info and confirmation modals
	confirmButtonType?: ConfirmButtonType;
}


const TakeExam = () => {
	const { id } = useParams();
	const router = useRouter();
	const [exam, setExam] = useState<ExamData | null>(null);
	const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
	const [currentIndex, setCurrentIndex] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);
	const [initialDuration, setInitialDuration] = useState(0);
	const [showResults, setShowResults] = useState(false);
	const [score, setScore] = useState(0);
	const [examStarted, setExamStarted] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [skippedQuestionWarning, setSkippedQuestionWarning] = useState<string>("");
	const [modalState, setModalState] = useState<ModalState>({
		isOpen: false,
		title: "",
		message: "",
		isConfirmation: false,
	});
	const examContentRef = useRef<HTMLElement | null>(null);
	const [focusLostCount, setFocusLostCount] = useState(0);

	useEffect(() => {
		const fetchExam = async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`/api/exams?id=${id}`);
				const data = await res.json();
				if (data.exam) {
					// Ensure correctAnswers is always an array, even if old data has correctAnswer
					const processedExam = {
						...data.exam,
						examQuestions: data.exam.examQuestions.map((q: any) => ({
							...q,
							questionType: q.questionType || 'single',
							correctAnswers: q.correctAnswers || (q.correctAnswer ? [q.correctAnswer] : []),
						})),
					};
					setExam(processedExam);
					const mins = processedExam.duration || 30;
					setTimeLeft(mins * 60);
					setInitialDuration(mins * 60); // Store initial duration
				} else {
					// Handle exam not found scenario if necessary
					console.error("Exam not found");
					setExam(null); // Or redirect, show error message
				}
			} catch (error) {
				console.error("Failed to fetch exam:", error);
				setExam(null);
			} finally {
				setIsLoading(false);
			}
		};
		if (id) {
			fetchExam();
		}
	}, [id]);

	useEffect(() => {
		if (!examStarted || !timeLeft || showResults) return; // Timer runs only if exam started and not showing results
		const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
		return () => clearInterval(interval);
	}, [timeLeft, showResults, examStarted]);

	// Effect for focus and visibility tracking
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden && examStarted && !showResults) {
				setFocusLostCount(prev => prev + 1);
				openModal(
					"Attention Required",
					`You have navigated away from the exam screen. Please return immediately. This is warning #${focusLostCount + 1}.`,
					undefined, // No onConfirm, just an info modal
					"OK",
					'danger'
				);
			}
		};

		const handleBlur = () => {
			if (examStarted && !showResults) {
				// Check if a modal is already open to avoid stacking warnings
				if (!modalState.isOpen && document.visibilityState === 'visible') {
					setFocusLostCount(prev => prev + 1);
					openModal(
						"Focus Lost",
						`The exam window has lost focus. Please click back into the exam. This is warning #${focusLostCount + 1}.`,
						undefined,
						"OK",
						'danger'
					);
				}
			}
		};

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (examStarted && !showResults) {
				event.preventDefault();
				event.returnValue = "Are you sure you want to leave? Your exam progress might be lost if you haven't submitted.";
				return event.returnValue;
			}
		};

		if (examStarted && !showResults) {
			document.addEventListener("visibilitychange", handleVisibilityChange);
			window.addEventListener("blur", handleBlur);
			window.addEventListener("beforeunload", handleBeforeUnload);
		}

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("blur", handleBlur);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [examStarted, showResults, modalState.isOpen, focusLostCount]);


	// Effect to request fullscreen when exam starts and examContentRef is available
	useEffect(() => {
		const requestFs = async () => {
			if (examStarted && !showResults && examContentRef.current && !document.fullscreenElement) {
				try {
					if (examContentRef.current.requestFullscreen) {
						await examContentRef.current.requestFullscreen();
					} else if ((examContentRef.current as any).mozRequestFullScreen) { /* Firefox */
						await (examContentRef.current as any).mozRequestFullScreen();
					} else if ((examContentRef.current as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
						await (examContentRef.current as any).webkitRequestFullscreen();
					} else if ((examContentRef.current as any).msRequestFullscreen) { /* IE/Edge */
						await (examContentRef.current as any).msRequestFullscreen();
					}
				} catch (err) {
					console.warn("Could not enter fullscreen mode:", err);
					openModal(
						"Fullscreen Mode",
						"We recommend using fullscreen mode for the best exam experience. You can usually enable it by pressing F11 or through your browser's view menu.",
						undefined,
						"OK"
					);
				}
			}
		};
		requestFs();
	}, [examStarted, showResults]); // Runs when examStarted or showResults changes


	useEffect(() => {
		if (timeLeft === 0 && examStarted && !showResults) {
			handleSubmit(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeLeft, examStarted, showResults]);

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
		setModalState({ isOpen: false, title: "", message: "", isConfirmation: false });
	};

	const handleOptionChange = (questionIndex: number, answer: string | string[]) => {
		setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
		if (skippedQuestionWarning) { // Clear warning if user answers
			setSkippedQuestionWarning("");
		}
	};

	const proceedToSubmit = () => {
		let correct = 0;
		exam?.examQuestions.forEach((q: Question, idx: number) => {
			const userAnswer = answers[idx];
			if (userAnswer === undefined || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
				return;
			}

			if (q.questionType === 'single') {
				if (userAnswer === q.correctAnswers[0]) {
					correct++;
				}
			} else {
				if (Array.isArray(userAnswer)) {
					const sortedUserAnswers = [...userAnswer].sort();
					const sortedCorrectAnswers = [...q.correctAnswers].sort();
					if (JSON.stringify(sortedUserAnswers) === JSON.stringify(sortedCorrectAnswers)) {
						correct++;
					}
				}
			}
		});

		setScore(correct);
		setShowResults(true);
		// Attempt to exit fullscreen when results are shown
		if (document.fullscreenElement) {
			document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
		}
	};


	const handleSubmit = (autoSubmit = false) => {
		if (autoSubmit) { // Auto-submit due to timer
			proceedToSubmit();
			return;
		}

		let unansweredQuestionsCount = 0;
		exam?.examQuestions.forEach((_, idx) => {
			const userAnswer = answers[idx];
			if (userAnswer === undefined || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
				unansweredQuestionsCount++;
			}
		});

		let confirmationMessage = "Are you sure you want to submit your exam?";
		if (unansweredQuestionsCount > 0) {
			confirmationMessage = `You have ${unansweredQuestionsCount} unanswered question(s). Are you sure you want to submit?`;
		}

		openModal(
			"Confirm Submission",
			confirmationMessage,
			() => {
				proceedToSubmit();
				// closeModal is called by Modal component onConfirm
			},
			"Submit Exam",
			unansweredQuestionsCount > 0 ? 'danger' : 'success' // Use danger if skipping, success otherwise
		);
	};

	const handleNextQuestion = () => {
		const currentAnswer = answers[currentIndex];
		if (currentAnswer === undefined || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
			setSkippedQuestionWarning("You've skipped this question. You can come back to it later.");
			setTimeout(() => setSkippedQuestionWarning(""), 3000); // Clear warning after 3 seconds
		} else {
			setSkippedQuestionWarning(""); // Clear warning if question was answered before moving
		}
		setCurrentIndex((prev) => Math.min(prev + 1, (exam?.examQuestions.length || 0) - 1));
	};

	const handlePreviousQuestion = () => {
		setSkippedQuestionWarning(""); // Clear warning when navigating back
		setCurrentIndex((prev) => Math.max(prev - 1, 0));
	};


	const handleStartExam = () => { // Simplified: just sets examStarted
		setExamStarted(true);
		setFocusLostCount(0);
	};

	const handleRetakeExam = () => {
		setAnswers({});
		setCurrentIndex(0);
		setTimeLeft(initialDuration);
		setShowResults(false);
		setScore(0);
		setExamStarted(false);
		setSkippedQuestionWarning("");
		setFocusLostCount(0);
		// Attempt to exit fullscreen if still in it
		if (document.fullscreenElement) {
			document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
		}
	};


	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen text-center">
				<Loader2 className="animate-spin w-12 h-12 text-gray-600 mb-4" />
				<p className="text-xl text-gray-700">Loading exam details...</p>
			</div>
		);
	}

	if (!exam) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen text-center">
				<Info className="w-12 h-12 text-red-500 mb-4" />
				<p className="text-xl text-gray-700">Could not load the exam.</p>
				<p className="text-gray-500">Please try again later or contact support.</p>
			</div>
		);
	}

	if (!examStarted) {
		return (
			// This section is NOT fullscreened. examContentRef is not used here.
			<section className="container mx-auto mt-16 sm:mt-20 py-12 w-full flex items-center justify-center min-h-[calc(100vh-80px)] px-4 bg-white">
				<PreExamScreen exam={exam} onStartExam={handleStartExam} />
			</section>
		);
	}

	if (showResults) {
		return (
			// This section is also NOT typically fullscreened as fullscreen is exited on submit.
			<section className="container mx-auto mt-16 sm:mt-20 py-8 sm:py-12 w-full px-4 bg-white">
				<ResultsDisplay
					exam={exam}
					answers={answers}
					score={score}
					timeTaken={timeLeft} // timeLeft at submission is remaining time
					totalDuration={initialDuration} // Pass total duration
					onRetakeExam={handleRetakeExam} // Pass retake handler
				/>
			</section>
		);
	}

	const totalQuestions = exam.examQuestions.length;
	const currentQuestion = exam.examQuestions[currentIndex];

	return (
		<>
			<section ref={examContentRef} className="container mx-auto pt-8 sm:pt-12 pb-8 sm:pb-12 w-full px-4 bg-white min-h-screen">
				{/* Modal is now a child of the fullscreen target element */}
				<Modal
					isOpen={modalState.isOpen}
					onClose={closeModal}
					title={modalState.title}
					message={modalState.message}
					onConfirm={modalState.onConfirm}
					confirmText={modalState.confirmText}
					confirmButtonType={modalState.confirmButtonType}
				/>
				<div className="w-full md:w-[80%] lg:w-[65%] mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-xl">
					<ExamHeader title={exam.title} timeLeft={timeLeft} />

					{skippedQuestionWarning && (
						<div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md flex items-center">
							<AlertTriangle className="w-5 h-5 mr-2" />
							{skippedQuestionWarning}
						</div>
					)}

					<QuestionDisplay
						question={currentQuestion}
						index={currentIndex}
						total={totalQuestions}
						selectedAnswer={answers[currentIndex]}
						onAnswerChange={handleOptionChange}
					/>

					<div className="flex justify-between mt-8">
						<button
							onClick={handlePreviousQuestion}
							disabled={currentIndex === 0}
							className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
						>
							Previous
						</button>

						{currentIndex === totalQuestions - 1 ? (
							<button
								onClick={() => handleSubmit(false)}
								className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
							>
								<CheckCircle className="w-5 h-5" />
								Submit
							</button>
						) : (
							<button
								onClick={handleNextQuestion}
								className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Next
							</button>
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default TakeExam;
