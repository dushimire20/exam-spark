"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
import useMediaQuery from "@/app/hook/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
		{ label: "Manage Exams", href: "/manage-exams" }, // New link
	];

	return (
		<nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
			<div className="flex items-center justify-between w-[90%] max-w-7xl mx-auto h-16 sm:h-20">
				{/* Left: Logo */}
				<Link href="/" className="opacity-100">
					<Image src="/Logo.png" alt="Logo" width={150} height={60} />
				</Link>

				{/* Desktop Layout */}
				{isAboveMediumScreens ? (
					<div className="flex items-center justify-between w-full ml-6">
						{/* Center: Menu Items */}
						<div className="flex-1 flex justify-center gap-10">
							{menuItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`transition duration-300 hover:text-accent ${pathname === item.href ? "text-accent font-semibold" : "text-gray-700"
										}`}
								>
									{item.label}
								</Link>
							))}
						</div>

						{/* Right: Auth */}
						<div className="flex items-center gap-4">
							<SignedOut>
								<Link
									href="/sign-in"
									className="text-gray-700 hover:text-accent transition"
								>
									Sign In
								</Link>
								<Link
									href="/sign-up"
									className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-1 hover:bg-accent transition"
								>
									Open an Account
									<ArrowUpRight size={18} />
								</Link>
							</SignedOut>

							<SignedIn>
								<UserButton afterSignOutUrl="/" />
							</SignedIn>
						</div>
					</div>
				) : (
					// Mobile Menu Button
					<button
						onClick={() => setIsMenuToggled((prev) => !prev)}
						className="rounded-full p-2"
						aria-label="Toggle menu"
					>
						<Menu className="h-6 w-6 text-gray-800" />
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
						className="fixed top-0 right-0 z-40 h-full w-64 bg-white shadow-xl flex flex-col"
					>
						<div className="flex justify-end p-6">
							<button onClick={() => setIsMenuToggled(false)} aria-label="Close menu">
								<X className="h-6 w-6 text-gray-700" />
							</button>
						</div>

						{/* Auth items at the top for mobile */}
						<div className="flex flex-col items-center gap-4 mb-6 px-4">
							<SignedIn>
								<UserButton afterSignOutUrl="/" />
							</SignedIn>
							<SignedOut>
								<Link href="/sign-in" className="w-full text-center py-2 hover:bg-gray-100 rounded-md">Sign In</Link>
								<Link
									href="/sign-up"
									className="w-full text-center py-2 bg-primary text-white rounded-md hover:bg-accent transition flex items-center justify-center gap-1"
								>
									Open an Account <ArrowUpRight size={18} />
								</Link>
							</SignedOut>
						</div>

						{/* Divider */}
						{(menuItems.length > 0) && (
							<hr className="border-gray-200 mx-4 mb-4" />
						)}

						{/* Navigation items */}
						<div className="flex flex-col items-center gap-6 text-lg font-medium text-gray-800 px-4">
							{menuItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`w-full text-center py-2 hover:bg-gray-100 rounded-md ${pathname === item.href ? "text-accent font-semibold bg-gray-50" : ""
										}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navbar;
