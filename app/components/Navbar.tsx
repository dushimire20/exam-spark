"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import useMediaQuery from "@/app/hook/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// 👇 Clerk imports
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const Navbar = () => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuToggled(false);
  }, [pathname]);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Take Exam", href: "/exams" },
    { label: "Create Exam", href: "/create-exam" },
  ];

  return (
    <nav className=" fixed top-0 left-0 right-0 z-30 w-full h-[80.81px] bg-white shadow items-center font-medium justify-center ">
      <div className="flex items-center justify-between w-[80%] mx-auto py-4 ">
        {/* Logo */}
        <Link href="/" className=" opacity-100 ">
          <Image src="/Logo.png" alt="Logo" width={150} height={60} />
        </Link>

        {/* Desktop Menu */}
        {isAboveMediumScreens && (
          <div className="flex gap-x-[24px] items-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className=" text-primary hover:text-accent transition duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Auth Section */}
        {isAboveMediumScreens ? (
          <div className="flex gap-x-[24px] items-center">
            <SignedOut>
              <Link href="/sign-in" className="text-primary hover:text-accent">
                Sign In
              </Link>
              <span className="text-gray bg-secondary px-2 py-2 rounded hover:text-accent">
                <Link href="/sign-up">Open an Account</Link>
                <ArrowUpRight className="inline-block ml-1" />
              </span>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        ) : (
          <button
            className="rounded-full p-2"
            onClick={() => setIsMenuToggled((prev) => !prev)}
          >
            <Menu className="h-6 w-6 " />
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {!isAboveMediumScreens && isMenuToggled && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-40 h-full w-[250px] bg-secondary-100 drop-shadow-xl"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsMenuToggled(false)}>
                <X className="h-6 w-6 text-primary-100" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-6 mt-12 text-lg font-medium text-primary-100">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}

              {/* Mobile Sign In/Out */}
              <SignedOut>
                <Link href="/sign-in">Sign In</Link>
                <Link href="/sign-up">Open an Account</Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
