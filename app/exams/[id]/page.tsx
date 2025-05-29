/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import Image from "next/image";
import Link from "next/link"; // Import Link
import { Loader2, Clock, CheckCircle, PlayCircle, Info, RotateCcw, ListChecks, XCircle, Check } from "lucide-react"; // Added more icons

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

type Question = {
	questionName: string;
	image?: string;
	choices: string[];
	correctAnswer: string;
};

type QuestionDisplayProps = {
	question: Question;
	index: number;
	total: number;
	selected: string;
	onChange: (index: number, value: string) => void;
};

const QuestionDisplay = ({
	question,
	index,
	total,
	selected,
	onChange,
}: QuestionDisplayProps) => (
	<div>
		<h2 className="text-xl font-semibold mb-4 text-gray-700">
			Question {index + 1} of {total}
		</h2>

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
			{question.choices.map((opt, i) => (
				<label
					key={i}
					className={`flex items-center border px-4 py-3 rounded-md cursor-pointer transition ${selected === opt
						? "bg-blue-50 border-blue-600"
						: "hover:bg-gray-50 border-gray-300"
						}`}
				>
					<input
						type="radio"
						name={`question-${index}`}
						value={opt}
						checked={selected === opt}
						onChange={() => onChange(index, opt)}
						className="mr-3"
					/>
					<span className="text-gray-700 font-medium">{opt}</span>
				</label>
			))}
		</div>
	</div>
);

type ResultsDisplayProps = {
	exam: {
		title: string;
		examQuestions: Question[];
	};
	answers: { [key: number]: string };
	score: number;
	timeTaken: number; // New prop
	totalDuration: number; // New prop
	onRetakeExam: () => void; // New prop
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
				const isUnanswered = answers[idx] === undefined;
				const userAnswer = answers[idx];
				const isCorrectUserAnswer = userAnswer === q.correctAnswer;

				return (
					<div key={idx} className="mb-6 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
						<div className="flex justify-between items-start mb-2">
							<h2 className="text-lg sm:text-xl font-semibold text-gray-700">
								Question {idx + 1}
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
								const isCorrectChoice = choice === q.correctAnswer;
								const isUserSelectedChoice = choice === userAnswer;

								let itemClass = "border-gray-200 bg-gray-50"; // Default
								if (isCorrectChoice) {
									itemClass = "border-green-500 bg-green-50 text-green-800";
								}
								if (isUserSelectedChoice && !isCorrectChoice) {
									itemClass = "border-red-400 bg-red-50 text-red-800";
								}


								return (
									<li
										key={i}
										className={`px-4 py-3 rounded-md border transition flex items-center justify-between text-sm ${itemClass}`}
									>
										<span>{choice}</span>
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
								Correct Answer: <span className="font-semibold">{q.correctAnswer}</span>
							</p>
						)}

						{isUnanswered && (
							<p className="mt-2 text-sm text-red-600 font-semibold">
								You did not answer this question. The correct answer was: <span className="font-bold">{q.correctAnswer}</span>
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
	exam: {
		title: string;
		examQuestions: Question[];
		duration?: string;
	};
	onStartExam: () => void;
};

const PreExamScreen = ({ exam, onStartExam }: PreExamScreenProps) => {
	const durationMinutes = parseInt(exam.duration?.replace(/\D/g, '') || '30');
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

			<p className="text-gray-600 mb-8 text-sm sm:text-base">
				Please ensure you have a stable internet connection and a quiet environment. Once you start, the timer will begin.
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

const TakeExam = () => {
	const { id } = useParams();
	const router = useRouter(); // Initialize router
	const [exam, setExam] = useState<any>(null);
	const [answers, setAnswers] = useState<{ [key: number]: string }>({});
	const [currentIndex, setCurrentIndex] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);
	const [initialDuration, setInitialDuration] = useState(0); // New state for total duration
	const [showResults, setShowResults] = useState(false);
	const [score, setScore] = useState(0);
	const [examStarted, setExamStarted] = useState(false); // New state
	const [isLoading, setIsLoading] = useState(true); // For initial data loading

	useEffect(() => {
		const fetchExam = async () => {
			setIsLoading(true);
			try {
				const res = await fetch(`/api/exams?id=${id}`);
				const data = await res.json();
				if (data.exam) {
					setExam(data.exam);
					const mins = parseInt(data.exam.duration?.replace(/\D/g, '')) || 30;
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

	useEffect(() => {
		if (timeLeft === 0 && examStarted && !showResults) {
			// Automatically submit if time runs out after exam has started
			handleSubmit(true); // Pass a flag to indicate auto-submission
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeLeft, examStarted, showResults]);

	const handleOptionChange = (index: number, value: string) => {
		setAnswers((prev) => ({ ...prev, [index]: value }));
	};

	const handleSubmit = (autoSubmit = false) => {
		if (!autoSubmit) {
			const confirmSubmit = window.confirm("Are you sure you want to submit your exam?");
			if (!confirmSubmit) return;
		}

		let correct = 0;
		exam.examQuestions.forEach((q: Question, idx: number) => {
			if (answers[idx] === q.correctAnswer) correct++;
		});

		setScore(correct);
		setShowResults(true);
		// Time taken is initialDuration - timeLeft (at the moment of submission)
		// This will be passed to ResultsDisplay
	};

	const handleStartExam = () => {
		setExamStarted(true);
	};

	const handleRetakeExam = () => {
		setAnswers({});
		setCurrentIndex(0);
		setTimeLeft(initialDuration); // Reset timer to full duration
		setShowResults(false);
		setScore(0);
		setExamStarted(false); // Go back to pre-exam screen
		// Optionally, re-fetch exam if content could change, though not typical for a retake
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
			<section className="container mx-auto mt-16 sm:mt-20 py-12 w-full flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
				<PreExamScreen exam={exam} onStartExam={handleStartExam} />
			</section>
		);
	}

	if (showResults) {
		return (
			<section className="container mx-auto mt-16 sm:mt-20 py-8 sm:py-12 w-full px-4">
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
		<section className="container mx-auto mt-16 sm:mt-20 py-8 sm:py-12 w-full px-4">
			<div className="w-full md:w-[80%] lg:w-[65%] mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-xl">
				<ExamHeader title={exam.title} timeLeft={timeLeft} />

				<QuestionDisplay
					question={currentQuestion}
					index={currentIndex}
					total={totalQuestions}
					selected={answers[currentIndex]}
					onChange={handleOptionChange}
				/>

				<div className="flex justify-between mt-8">
					<button
						onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
						disabled={currentIndex === 0}
						className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
					>
						Previous
					</button>

					{currentIndex === totalQuestions - 1 ? (
						<button
							onClick={handleSubmit}
							className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
						>
							<CheckCircle className="w-5 h-5" />
							Submit
						</button>
					) : (
						<button
							onClick={() =>
								setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))
							}
							className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Next
						</button>
					)}
				</div>
			</div>
		</section>
	);
};

export default TakeExam;
