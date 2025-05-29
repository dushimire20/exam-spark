import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ExamQuestion {
    questionName: string;
    choices: string[];
    // correctAnswer: string; // Old field
    correctAnswers: string[]; // New field
    questionType?: 'single' | 'multiple'; // New field, optional for backward compatibility if some old data doesn't have it
    image?: string; // URL of the image
}

interface Exam {
    _id: string;
    title: string;
    picture?: string; // URL of the cover image
    examQuestions: ExamQuestion[];
    createdAt: string;
    updatedAt: string;
    duration?: number; // Duration in minutes
}

interface ViewExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    exam: Exam | null;
}

const ViewExamModal: React.FC<ViewExamModalProps> = ({ isOpen, onClose, exam }) => {
    if (!isOpen || !exam) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 whitespace-pre-line">View Exam: {exam.title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                    <div className="mb-4">
                        <span className="font-semibold text-gray-700">Duration: </span>
                        <span className="text-gray-600">{exam.duration || 30} minutes</span>
                    </div>

                    {exam.picture && (
                        <div className="mb-6 text-center">
                            <h4 className="text-lg font-medium text-gray-700 mb-2">Cover Image:</h4>
                            <Image
                                src={exam.picture}
                                alt={`${exam.title} cover image`}
                                width={500}
                                height={300}
                                className="rounded-md object-contain mx-auto max-h-60"
                            />
                        </div>
                    )}

                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Questions:</h4>
                    {exam.examQuestions.map((q, index) => {
                        const questionType = q.questionType || 'single'; // Default to single if not specified
                        return (
                            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                                <p className="font-semibold text-gray-700 mb-1">
                                    Question {index + 1}
                                    <span className="text-xs text-gray-500 ml-2">({questionType === 'multiple' ? 'Multiple Correct Answers' : 'Single Correct Answer'})</span>
                                </p>
                                <p className="font-normal whitespace-pre-line text-gray-800 mb-2">{q.questionName}</p>
                                {q.image && (
                                    <div className="my-3 text-center">
                                        <Image
                                            src={q.image}
                                            alt={`Question ${index + 1} image`}
                                            width={400}
                                            height={250}
                                            className="rounded-md object-contain mx-auto max-h-52"
                                        />
                                    </div>
                                )}
                                <ul className="list-disc list-inside space-y-1 pl-2 mb-2">
                                    {q.choices.map((choice, cIndex) => {
                                        const isCorrect = q.correctAnswers?.includes(choice);
                                        return (
                                            <li
                                                key={cIndex}
                                                className={`text-sm whitespace-pre-line ${isCorrect ? 'text-green-600 font-semibold' : 'text-gray-600'}`}
                                            >
                                                {choice}
                                                {isCorrect && <span className="text-green-600 ml-1">(Correct Answer)</span>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 sm:p-6 border-t border-gray-200 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewExamModal;

// Re-export Exam interface if needed by ManageExamsPage directly from here
// or ensure it's defined/imported in ManageExamsPage
export type { Exam as ExamDetails };
