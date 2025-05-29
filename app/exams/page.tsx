"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpenCheck, Users, Image as ImageIcon } from "lucide-react"; // Added ImageIcon

const SkeletonCard = () => (
	<div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
		<div className="relative h-56 w-full bg-gray-300 flex items-center justify-center">
			<ImageIcon className="w-12 h-12 text-gray-400" />
		</div>
		<div className="p-6">
			<div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
			<div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
			<div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
			<div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
				<div className="h-5 bg-gray-300 rounded w-1/3"></div>
				<div className="h-5 bg-gray-300 rounded w-1/4"></div>
			</div>
		</div>
	</div>
);

const AvailableExams = () => {
	const [exams, setExams] = useState<any[]>([]); // Explicitly type exams
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getExams = async () => {
			setIsLoading(true);
			try {
				const res = await fetch("/api/exams");
				const data = await res.json();
				setExams(data.exams || []); // Ensure exams is an array
			} catch (error) {
				console.error("Failed to fetch exams:", error);
				setExams([]); // Set to empty array on error
			} finally {
				setIsLoading(false);
			}
		};
		getExams();
	}, []);

	return (
		<div className="container mx-auto mt-20 px-4 py-12 lg:max-w-screen-xl min-h-screen"> {/* Added min-h-screen for better layout during loading/empty states */}
			<h1 className="text-primary text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-10 md:mb-12">
				Available Exams
			</h1>

			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{[...Array(6)].map((_, index) => ( // Show more skeletons on this page
						<SkeletonCard key={index} />
					))}
				</div>
			) : exams.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{exams.map((exam) => (
						<div
							key={exam._id}
							className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl duration-300 flex flex-col"
						>
							<Link href={`/exams/${exam._id}`} className="block">
								<div className="relative h-56 w-full">
									<Image
										src={exam.picture || '/placeholder-image.png'} // Added placeholder
										alt={exam.title || 'Exam image'}
										fill
										className="object-cover w-full h-full"
										onError={(e) => {
											// Fallback for broken images
											e.currentTarget.src = '/placeholder-image.png';
										}}
									/>
									<div className="absolute right-4 bottom-4 bg-secondary text-white text-xs uppercase font-bold px-4 py-2 rounded-full shadow-md">
										Trending
									</div>
								</div>
							</Link>

							<div className="p-6 flex flex-col flex-grow justify-between">
								<div>
									<h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
										{exam.title}
									</h2>
									<p className="text-gray-600 text-sm mb-4 line-clamp-3"> {/* Increased line-clamp for description */}
										Test your knowledge with this exam.
									</p>
								</div>

								<div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-300">
									<Link
										href={`/exams/${exam._id}`}
										className="text-blue-600 font-medium hover:underline flex items-center gap-1"
									>
										<BookOpenCheck className="w-5 h-5" />
										Take Exam
									</Link>

									<div className="flex items-center text-sm text-accent gap-1">
										<Users className="w-4 h-4" />
										100+ Enrolled
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-20">
					<BookOpenCheck className="w-24 h-24 text-gray-400 mx-auto mb-6" />
					<p className="text-2xl text-gray-500 mb-2">No Exams Available Yet</p>
					<p className="text-gray-400">Please check back later, or explore other sections of our site.</p>
				</div>
			)}
		</div>
	);
};

export default AvailableExams;
