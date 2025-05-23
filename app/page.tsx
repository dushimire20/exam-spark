"use client";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, SearchCheck, CircleCheckBig } from "lucide-react";
import Companies from "./components/companies";
import Exams from "./components/homeExams";
import Newsletter from "./components/newLetter";

const app = () => {
  return (
    <div className="container w-full bg-[#ECE9E6] ">
    <div className="relative w-[80%] mx-auto pt-24">
       <div className='grid grid-cols-1 lg:grid-cols-12 space-x-1 items-center'>
                    <div className='col-span-6 flex flex-col gap-8 '>
                        <div className='flex gap-2 text-green-900 mx-auto lg:mx-0'>
                          <BadgeCheck className='text-xl inline-block me-2' />
                            <p className='text-success text-sm font-semibold text-center lg:text-start'>Get 30% off on first enroll</p>
                        </div>
                        <h1 className='text-primary text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0'>Advance your engineering skills with us.</h1>
                        <h3 className='text-black/70 text-lg pt-5 lg:pt-0'>Build skills with our practice exams, courses and mentor from world-class companies.</h3>
                        <div className="relative rounded-full pt-5 lg:pt-0 text-center">
                            <input type="Email address" name="q" className="py-6 lg:py-8 pl-8 pr-20 text-lg w-full text-primary rounded-full focus:outline-none shadow-2xl" placeholder="search exams..." autoComplete="off" />
                            <Link href="/" className="bg-secondary p-5 rounded-full absolute right-2 top-2 ">
                                <SearchCheck className="text-white text-4xl inline-block" />
                               
                            </Link>
                        </div>
                        <div className='flex items-center justify-between pt-10 lg:pt-4'>
                            <div className='mad:flex gap-2'>
                                <CircleCheckBig className='text-2xl text-accent' />
                                <p className='text-sm sm:text-lg font-normal text-secondary'>Flexible</p>
                            </div>
                            <div className='flex gap-2'>
                               <CircleCheckBig className='text-2xl text-accent' />
                                <p className='text-sm sm:text-lg font-normal text-secondary'>Learning path</p>
                            </div>
                            <div className='flex gap-2'>
                               <CircleCheckBig className='text-2xl text-accent' />
                                <p className='text-sm sm:text-lg font-normal text-secondary'>Community</p>
                            </div>
                        </div>

                    </div>
                    <div className='col-span-6 flex justify-center'>
                        <Image src="/Hero.png" alt="nothing" width={1000} height={805} />
                    </div>
                </div>

    </div>

    <div className="w-full bg-white py-10">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <Companies />
      </div>
    </div>

    <div className="w-full bg-white py-10">
      <div className="container mx-auto ">
        <Exams />
      </div>
    </div>

     <div className="w-full bg-white py-10">
      <div className="container mx-auto ">
        <Newsletter />
      </div>
    </div>

   



  </div>
  )
};

export default app;
