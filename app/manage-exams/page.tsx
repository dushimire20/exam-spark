"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";
import ViewExamModal, { ExamDetails } from "@/app/components/ViewExamModal"; // Import ViewExamModal and its type
import { Loader2, Edit3, Trash2, PlusCircle, Eye } from "lucide-react";

// interface ExamQuestion { // Already defined in ViewExamModal, can be removed if not used elsewhere directly
//     questionName: string;
//     choices: string[];
//     correctAnswer: string;
//     image?: string;
// }

// interface Exam { // Use ExamDetails from ViewExamModal
//     _id: string;
//     title: string;
//     picture?: string;
//     examQuestions: ExamQuestion[];
//     createdAt: string;
//     updatedAt: string;
// }

type ConfirmButtonType = 'default' | 'danger' | 'success';

interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    confirmButtonType?: ConfirmButtonType;
}

const ManageExamsPage: React.FC = () => {
    const [exams, setExams] = useState<ExamDetails[]>([]); // Use ExamDetails type
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        title: "",
        message: "",
        confirmButtonType: 'default',
    });
    // const [examToDelete, setExamToDelete] = useState<string | null>(null);
    const [selectedExamForView, setSelectedExamForView] = useState<ExamDetails | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const router = useRouter();

    const fetchExams = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/exams");
            if (!res.ok) throw new Error("Failed to fetch exams");
            const data = await res.json();
            setExams(data.exams || []);
        } catch (error) {
            console.error(error);
            // Optionally show an error message to the user via modal or other UI element
            openModal("Error", "Failed to load exams. Please try again later.", undefined, undefined, 'danger');
            setExams([]);
        } finally {
            setIsLoading(false);
        }
    }, []); // Removed openModal from dependencies as it's stable

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

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
            confirmButtonType,
        });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, title: "", message: "", confirmButtonType: 'default' });
        setExamToDelete(null);
    };

    const handleDeleteClick = (examId: string) => {
        setExamToDelete(examId);
        openModal(
            "Confirm Deletion",
            "Are you sure you want to delete this exam? This action cannot be undone.",
            () => confirmDeleteExam(examId),
            "Delete",
            "danger"
        );
    };

    const confirmDeleteExam = async (examId: string | null) => {
        if (!examId) return;
        try {
            const res = await fetch(`/api/exams?id=${examId}`, { method: "DELETE" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete exam");
            }
            openModal("Success", "Exam deleted successfully.", undefined, undefined, 'success');
            fetchExams(); // Refresh the list
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            openModal("Error", `Failed to delete exam: ${errorMessage}`, undefined, undefined, 'danger');
        } finally {
            closeModal(); // Close confirmation modal regardless of outcome, success/error modal will show
        }
    };

    const handleEditClick = (examId: string) => {
        router.push(`/create-exam?editId=${examId}`);
    };

    const handleViewClick = (exam: ExamDetails) => {
        setSelectedExamForView(exam);
        setIsViewModalOpen(true);
    };


    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
                <Loader2 className="animate-spin w-12 h-12 text-gray-600 mb-4" />
                <p className="text-xl text-gray-700">Loading exams...</p>
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
            <ViewExamModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                exam={selectedExamForView}
            />
            <div className="container mx-auto mt-20 px-4 py-12 lg:max-w-screen-xl min-h-screen">
                <div className="flex justify-between items-center mb-10 md:mb-12">
                    <h1 className="text-primary text-3xl sm:text-4xl font-semibold">
                        Manage Exams
                    </h1>
                    <Link
                        href="/create-exam"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        Create New Exam
                    </Link>
                </div>

                {exams.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-500 mb-2">No exams found.</p>
                        <p className="text-gray-400">
                            Get started by creating a new exam.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {exams.map((exam) => (
                                    <tr key={exam._id}>
                                        { console.log("The exam", exam)}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{exam.examQuestions.length}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{new Date(exam.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => handleViewClick(exam)} className="text-blue-600 hover:text-blue-800" title="View Exam">
                                                <Eye size={18} className="inline-block" />
                                            </button>
                                            <button onClick={() => handleEditClick(exam._id)} className="text-indigo-600 hover:text-indigo-800" title="Edit Exam">
                                                <Edit3 size={18} className="inline-block" />
                                            </button>
                                            <button onClick={() => handleDeleteClick(exam._id)} className="text-red-600 hover:text-red-800" title="Delete Exam">
                                                <Trash2 size={18} className="inline-block" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageExamsPage;
