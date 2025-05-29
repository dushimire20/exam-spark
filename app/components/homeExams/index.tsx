"use client";
import { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpenCheck, Users } from "lucide-react";


const Exams = () => {


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
		<section id="courses">
			<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-0 sm:px-4'> {/* Adjusted px for container */}
				<div className="sm:flex justify-between items-center mb-10 sm:mb-16 lg:mb-20">
					<h2 className="text-midnight_text text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-3 sm:mb-0 text-center sm:text-left">Popular Exams.</h2>
					<Link href={'/'} className="text-primary text-sm sm:text-base lg:text-lg font-medium hover:tracking-widest duration-500 block text-center sm:text-right">Explore exams&nbsp;&gt;&nbsp;</Link>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{exams.map((exam: any) => ( // Added type 'any' for exam, consider defining a proper type
						<div
							key={exam._id}
							className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl duration-300"
						>
							<div className="relative h-48 sm:h-52 md:h-56 w-full">
								<Image
									src={exam.picture}
									alt={exam.title}
									fill
									className="object-cover w-full h-full"
								/>
								<div className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 bg-secondary text-white text-[10px] sm:text-xs uppercase font-bold px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full shadow-md">
									Trending
								</div>
							</div>

							<div className="p-4 sm:p-6 flex flex-col justify-between h-full"> {/* Consider min-height if content varies a lot */}
								<div>
									<h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1.5 sm:mb-2 line-clamp-2">
										{exam.title}
									</h2>
									<p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
										Test your knowledge with this exam.
									</p>
								</div>


								<div className="flex justify-between items-center mt-auto pt-3 sm:pt-4 border-t">
									<Link
										href={`/exams/${exam._id}`}
										className="text-blue-600 text-xs sm:text-sm font-medium hover:underline flex items-center gap-1"
									>
										<BookOpenCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
										Take Exam
									</Link>

									<div className="flex items-center text-xs sm:text-sm text-accent gap-1">
										<Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
										100+ Enrolled
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Exams;
