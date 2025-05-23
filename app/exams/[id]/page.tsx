"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

const TakeExam = () => {
  const { id } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // default 30 min
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      const res = await fetch(`/api/exams?id=${id}`);
      const data = await res.json();
      setExam(data.exam);

      if (data.exam.duration) {
        const mins = parseInt(data.exam.duration.replace(/\D/g, '')) || 30;
        setTimeLeft(mins * 60);
      }
    };
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (!timeLeft || showResults) return;
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, showResults]);

  useEffect(() => {
    if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleOptionChange = (questionIndex, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = () => {
    const confirm = window.confirm("Are you sure you want to submit your exam?");
    if (!confirm) return;

    let correct = 0;
    exam.examQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct += 1;
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  if (!exam) {
    return (
      <div className="text-center mt-12">
        <Loader2 className="animate-spin" />
        Loading exam...
      </div>
    );
  }

  if (showResults) {
    return (
      <section className="container mx-auto mt-20 py-12 w-full">
        <div className="w-[85%] mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{exam.title} - Results</h1>
          <p className="text-lg font-semibold text-green-600 mb-6">
            You scored {score} / {exam.examQuestions.length}
          </p>

          {exam.examQuestions.map((q, idx) => (
            <div key={idx} className="mb-6 border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">
                Question {idx + 1}
              </h2>
              {q.image && (
                <div className="w-full mb-3">
                  <Image
                    src={q.image}
                    alt={`Question ${idx + 1} image`}
                    width={600}
                    height={400}
                    className="rounded"
                  />
                </div>
              )}
              <p className="font-medium mb-2">{q.questionName}</p>
              <ul className="space-y-2">
                {q.choices.map((choice, i) => {
                  const isCorrect = choice === q.correctAnswer;
                  const isUserChoice = choice === answers[idx];
                  const unanswered = answers[idx] === undefined;

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
                      {isCorrect && <span className="ml-2 text-green-600 font-semibold">(Correct)</span>}
                      {isUserChoice && !isCorrect && (
                        <span className="ml-2 text-red-500 font-medium">(Your Answer)</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {answers[idx] === undefined && (
                <p className="mt-2 text-red-600 font-semibold">You did not answer this question.</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  const currentQuestion = exam.examQuestions[currentIndex];

  return (
    <section className="container mx-auto mt-20 py-12 w-full">
      <div className="w-[70%] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{exam.title}</h1>
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">
            Question {currentIndex + 1} of {exam.examQuestions.length}
          </h2>

          {currentQuestion.image && (
            <div className="w-full mb-4">
              <Image
                src={currentQuestion.image}
                alt={`Question ${currentIndex + 1} image`}
                width={600}
                height={400}
                className="rounded"
              />
            </div>
          )}

          <p className="mb-4 text-gray-800 font-semibold">
            {currentQuestion.questionName}
          </p>
          <div className="space-y-2">
            {currentQuestion.choices.map((opt, idx) => (
              <label
                key={idx}
                className="block border rounded-md px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name={`question-${currentIndex}`}
                  value={opt}
                  checked={answers[currentIndex] === opt}
                  onChange={() => handleOptionChange(currentIndex, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>

          {currentIndex === exam.examQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Submit
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex(prev =>
                  Math.min(prev + 1, exam.examQuestions.length - 1)
                )
              }
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
