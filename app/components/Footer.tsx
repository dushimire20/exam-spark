"use client";

import Link from "next/link";
import Image from "next/image";
import { FacebookIcon, TwitterIcon, InstagramIcon, MapPinCheck, PhoneOutgoing, Folders } from "lucide-react";
const Footer = () => {
    const headerData = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/#courses" },
  { label: "Mentor", href: "/#mentor" },
  { label: "Group", href: "/#portfolio" },
  { label: "Testimonial", href: "/#testimonial" },
  { label: "Docs", href: "/documentation" },
];
  return (
    <footer className="bg-accent/5  py-10 mt-2">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">
          <div className='col-span-4 md:col-span-12 lg:col-span-4'>
             <Image
                        src="/logo.png"
                        alt="Logo"
                        width={150}
                        height={60}
            />

            <div className='flex items-center gap-4'>
              <Link href="#" className='hover:text-accent text-black text-3xl'>
              <FacebookIcon className="text-accent text-3xl inline-block me-2" />
                
              </Link>
              <Link href="#" className='hover:text-accent text-black text-3xl'>
                <TwitterIcon className="text-accent text-3xl inline-block me-2" />
                
              </Link>
              <Link href="#" className='hover:text-accent text-black text-3xl'>
                <InstagramIcon className="text-accent text-3xl inline-block me-2" />
                
              </Link>
            </div>
          </div>
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium">Links</h3>
            <ul>
              {headerData.map((item, index) => (
                <li key={index} className="mb-2 text-black/50 hover:text-primary w-fit">
                  <Link href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2">
            <h3 className="mb-4 text-2xl font-medium">Other</h3>
            <ul>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">
                  About Us
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">
                  Our Team
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">
                  career
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">
                  Services
                </Link>
              </li>
              <li className="mb-2 text-black/50 hover:text-primary w-fit">
                <Link href="#">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className='col-span-4 md:col-span-4 lg:col-span-4'>
            <div className="flex items-center gap-2">
                <MapPinCheck className="text-accent text-3xl inline-block me-2" />
              <h5 className="text-lg text-black/60">Kg 15 Avenue Kigali</h5>
            </div>
            <div className="flex gap-2 mt-10">
                <PhoneOutgoing className="text-accent text-3xl inline-block me-2" />
             
              <h5 className="text-lg text-black/60">+250 784 861 255</h5>
            </div>
            <div className="flex gap-2 mt-10">
                <Folders className="text-accent text-3xl inline-block me-2" />
              
              <h5 className="text-lg text-black/60">info@gmail.com</h5>
            </div>
          </div>
        </div>

        <div className='mt-10 lg:flex items-center justify-between'>
          <h4 className='text-black/50 text-sm text-center lg:text-start font-normal'>@2025 ExamSpark. All Rights Reserved by <Link href="/" target="_blank" className="hover:text-primary"> ExamSpark.com</Link></h4>
          <div className="flex gap-5 mt-5 lg:mt-0 justify-center lg:justify-start">
            <Link href="/" className='text-black/50 text-sm font-normal hover:text-accent'>Privacy policy</Link>
            <Link href="/" className='text-black/50 text-sm font-normal hover:text-accent'>Terms & conditions</Link>
          </div>
          <h4 className='text-black/50 text-sm text-center lg:text-start font-normal'>Distributed by <Link href="/" target="_blank" className="hover:text-primary"> OscarDushimire</Link></h4>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
