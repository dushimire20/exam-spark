"use client";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, SearchCheck, CircleCheckBig } from "lucide-react";
import Exams from "./components/homeExams";
import Newsletter from "./components/newLetter";

const app = () => {
	return (
		<div className="w-full bg-[#ECE9E6] ">
			<div className="relative w-[90%] md:w-[80%] mx-auto pt-20 sm:pt-24">
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-x-0 lg:space-x-1 items-center'>
					<div className='col-span-12 lg:col-span-6 flex flex-col gap-6 sm:gap-8'>
						<div className='flex gap-2 text-green-900 mx-auto lg:mx-0'>
							<BadgeCheck className='text-lg sm:text-xl inline-block me-2' />
							<p className='text-xs sm:text-sm font-semibold text-center lg:text-start'>Get 30% off on first enroll</p>
						</div>
						<h1 className='text-[#6B6C65] text-3xl sm:text-4xl lg:text-5xl font-semibold pt-3 lg:pt-0 text-center lg:text-start'>Advance your engineering skills with us.</h1>
						<h3 className='text-black/70 text-base sm:text-lg pt-3 lg:pt-0 text-center lg:text-start'>Build skills with our practice exams, courses and mentor from world-class companies.</h3>
						<div className="relative rounded-full text-center">
							<input type="Email address" name="q" className="py-4 sm:py-6 lg:py-5 pl-6 pr-12 sm:pl-8 sm:pr-14 lg:pr-16 text-sm sm:text-base lg:text-lg w-full text-primary rounded-full focus:outline-none shadow-2xl" placeholder="search exams..." autoComplete="off" />
							<Link href="/" className="bg-[#728391] p-2 sm:p-[0.625rem] lg:p-3 rounded-full absolute right-2 sm:right-[0.625rem] lg:right-3 top-1/2 -translate-y-1/2">
								<SearchCheck className="text-white text-base sm:text-lg lg:text-xl inline-block" />
							</Link>
						</div>
						<div className='flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 sm:pt-10 lg:pt-4'>
							<div className='flex items-center gap-2'>
								<CircleCheckBig className='text-xl sm:text-2xl text-accent' />
								<p className='text-xs sm:text-sm md:text-base font-normal text-secondary'>Flexible</p>
							</div>
							<div className='flex items-center gap-2'>
								<CircleCheckBig className='text-xl sm:text-2xl text-accent' />
								<p className='text-xs sm:text-sm md:text-base font-normal text-secondary'>Learning path</p>
							</div>
							<div className='flex items-center gap-2'>
								<CircleCheckBig className='text-xl sm:text-2xl text-accent' />
								<p className='text-xs sm:text-sm md:text-base font-normal text-secondary'>Community</p>
							</div>
						</div>

					</div>
					<div className='col-span-12 lg:col-span-6 flex justify-center mt-8 lg:mt-0'>
						<Image src="/Hero.png" alt="nothing" width={1000} height={805} />
					</div>
				</div>

			</div>

			{/* <div className="w-full bg-white py-8 sm:py-10">
				<div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 sm:px-6 md:px-8">
					<Companies />
				</div>
			</div> */}

			<div className="w-full bg-white py-8 sm:py-10">
				<div className="container mx-auto px-4 sm:px-6 md:px-8">
					<Exams />
				</div>
			</div>

			<div className="w-full bg-white py-8 sm:py-10">
				<div className="container mx-auto px-4 sm:px-6 md:px-8">
					<Newsletter />
				</div>
			</div>

		</div>
	)
};

export default app;
