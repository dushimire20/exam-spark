"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpenCheck, Users } from "lucide-react";

const AvailableExams = () => {
	const [exams, setExams] = useState([]);

	useEffect(() => {
		const getExams = async () => {
			const res = await fetch("/api/exams");
			const data = await res.json();
			setExams(data.exams);
		};
		getExams();
	}, []);

	return (
		<div className="container mx-auto mt-20 px-4 py-12 lg:max-w-screen-xl">
			<h1 className="text-primary text-4xl sm:text-5xl font-semibold text-center mb-12">
				Available Exams
			</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{exams.map((exam) => (
					<div
						key={exam._id}
						className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl duration-300"
					>
						<div className="relative h-56 w-full">
							<Image
								src={exam.picture}
								alt={exam.title}
								fill
								className="object-cover w-full h-full"
							/>
							<div className="absolute right-4 bottom-4 bg-secondary text-white text-xs uppercase font-bold px-4 py-2 rounded-full shadow-md">
								Trending
							</div>
						</div>

						<div className="p-6 flex-col justify-between h-full">
							<div>
								<h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
									{exam.title}
								</h2>
								<p className="text-gray-600 text-sm mb-4 line-clamp-2">
									Test your knowledge with this exam.
								</p>
							</div>


							<div className="flex justify-between items-center mt-auto pt-4 border-t">
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
		</div>
	);
};

export default AvailableExams;
