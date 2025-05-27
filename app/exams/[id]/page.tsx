"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, Clock, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ExamHeader = ({ title, timeLeft }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">{title}</h1>
    <div className="flex items-center gap-2 text-red-600 font-semibold">
      <Clock className="w-5 h-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  </div>
);

const QuestionDisplay = ({
  question,
  index,
  total,
  selected,
  onChange,
}) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">
      Question {index + 1} of {total}
    </h2>

    {question.image && (
      <div className="w-full mb-4">
        <Image
          src={question.image}
          alt={`Question ${index + 1}`}
          width={600}
          height={400}
          className="rounded"
        />
      </div>
    )}

    <p className="mb-4 text-gray-800 font-medium whitespace-pre-line">
      {question.questionName}
    </p>

    <div className="space-y-2">
      {question.choices.map((opt, i) => (
        <label
          key={i}
          className={`block border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100 ${
            selected === opt ? "border-blue-500 bg-blue-50" : ""
          }`}
        >
          <input
            type="radio"
            name={`question-${index}`}
            value={opt}
            checked={selected === opt}
            onChange={() => onChange(index, opt)}
            className="mr-2"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

const ResultsDisplay = ({ exam, answers, score }) => (
  <div className="w-[85%] mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h1 className="text-2xl font-bold mb-4">{exam.title} - Results</h1>
    <p className="text-lg font-semibold text-green-600 mb-6">
      You scored {score} / {exam.examQuestions.length}
    </p>

    {exam.examQuestions.map((q, idx) => {
      const isUnanswered = answers[idx] === undefined;

      return (
        <div key={idx} className="mb-6 border-b pb-4">
          <h2 className="text-lg font-semibold mb-2">
            Question {idx + 1}
          </h2>

          {q.image && (
            <Image
              src={q.image}
              alt={`Question ${idx + 1}`}
              width={600}
              height={400}
              className="rounded mb-3"
            />
          )}

          <p className="mb-2 font-medium">{q.questionName}</p>
          <ul className="space-y-2">
            {q.choices.map((choice, i) => {
              const isCorrect = choice === q.correctAnswer;
              const isUserChoice = choice === answers[idx];

              return (
                <li
                  key={i}
                  className={`px-4 py-2 rounded border ${
                    isCorrect
                      ? "bg-green-100 border-green-500"
                      : isUserChoice
                      ? "bg-red-100 border-red-400"
                      : "bg-white"
                  }`}
                >
                  {choice}
                  {isCorrect && (
                    <span className="ml-2 text-green-600 font-semibold">(Correct)</span>
                  )}
                  {isUserChoice && !isCorrect && (
                    <span className="ml-2 text-red-500 font-medium">(Your Answer)</span>
                  )}
                </li>
              );
            })}
          </ul>

          {isUnanswered && (
            <p className="mt-2 text-red-600 font-semibold">You did not answer this question.</p>
          )}
        </div>
      );
    })}
  </div>
);

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" + s : s}`;
};

const TakeExam = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Load exam
  useEffect(() => {
    const fetchExam = async () => {
      const res = await fetch(`/api/exams?id=${id}`);
      const data = await res.json();
      setExam(data.exam);
      const mins = parseInt(data.exam.duration?.replace(/\D/g, '')) || 30;
      setTimeLeft(mins * 60);
    };
    fetchExam();
  }, [id]);

  // Timer logic
  useEffect(() => {
    if (!timeLeft || showResults) return;
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, showResults]);

  // Auto-submit on time up
  useEffect(() => {
    if (timeLeft === 0 && !showResults) handleSubmit();
  }, [timeLeft]);

  const handleOptionChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit your exam?");
    if (!confirmSubmit) return;

    let correct = 0;
    exam.examQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });

    setScore(correct);
    setShowResults(true);
  };

  if (!exam) {
    return (
      <div className="text-center mt-12">
        <Loader2 className="animate-spin mx-auto" />
        <p>Loading exam...</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <section className="container mx-auto mt-20 py-12 w-full">
        <ResultsDisplay exam={exam} answers={answers} score={score} />
      </section>
    );
  }

  const totalQuestions = exam.examQuestions.length;
  const currentQuestion = exam.examQuestions[currentIndex];

  return (
    <section className="container mx-auto mt-20 py-12 w-full">
      <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <ExamHeader title={exam.title} timeLeft={timeLeft} />

        <QuestionDisplay
          question={currentQuestion}
          index={currentIndex}
          total={totalQuestions}
          selected={answers[currentIndex]}
          onChange={handleOptionChange}
        />

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(prev + 1, totalQuestions - 1))}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
