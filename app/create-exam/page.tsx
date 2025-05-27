"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Question {
  questionText: string;
  choices: string[];
  correctAnswer: string;
  image?: File | null;
}

const CreateExam: React.FC = () => {
  const [title, setTitle] = useState("");
  const [examImage, setExamImage] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", choices: ["", "", "", ""], correctAnswer: "", image: null },
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: any
  ) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (qIndex: number, cIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices[cIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", choices: ["", "", "", ""], correctAnswer: "", image: null },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (confirm("Are you sure you want to remove this question?")) {
      setQuestions(questions.filter((_, i) => i !== index));
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
    setLoading(true);

    try {
      let pictureBase64 = "";
      if (examImage) {
        pictureBase64 = await fileToBase64(examImage);
      }

      const examQuestions = await Promise.all(
        questions.map(async (q) => ({
          questionName: q.questionText,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          image: q.image ? await fileToBase64(q.image) : undefined,
        }))
      );

      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          pictureBase64,
          examQuestions,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit exam");

      alert("Exam created successfully!");
      // Optionally reset the form here
    } catch (error) {
      console.error(error);
      alert("Something went wrong while submitting the exam.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:my-32 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">Create Exam</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Exam Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Exam Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setExamImage(e.target.files?.[0] || null)}
            />
            {examImage && (
              <img
                src={URL.createObjectURL(examImage)}
                alt="Exam Cover Preview"
                className="mt-2 max-h-40 object-contain"
              />
            )}
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Question {qIndex + 1}</h2>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Question Text</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "questionText", e.target.value)
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Optional Question Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "image", e.target.files?.[0] || null)
                  }
                />
                {q.image && (
                  <img
                    src={URL.createObjectURL(q.image)}
                    alt={`Question ${qIndex + 1} Preview`}
                    className="mt-2 max-h-40 object-contain"
                  />
                )}
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Choices</label>
                {q.choices.map((choice, cIndex) => (
                  <textarea
                    key={cIndex}
                    className="w-full border px-3 py-2 rounded mb-2"
                    placeholder={`Choice ${cIndex + 1}`}
                    value={choice}
                    onChange={(e) =>
                      handleChoiceChange(qIndex, cIndex, e.target.value)
                    }
                    required
                  />
                ))}
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Correct Answer</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                  }
                  required
                >
                  <option value="">Select correct answer</option>
                  {q.choices
                    .filter((choice) => choice !== "")
                    .map((choice, i) => (
                      <option key={i} value={choice}>
                        {choice}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Question
          </button>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Exam"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
