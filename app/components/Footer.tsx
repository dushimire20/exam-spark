"use client";

import Link from "next/link";
import Image from "next/image";
import {
	FacebookIcon,
	TwitterIcon,
	InstagramIcon,
	MapPinCheck,
	PhoneOutgoing,
	Folders,
} from "lucide-react";

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
		<footer className="bg-accent/5 py-8 sm:py-12 border-t border-gray-200 mt-8 sm:mt-10">
			<div className="container mx-auto px-4 sm:px-6 lg:max-w-screen-xl">
				<div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-12">
					{/* Logo & Socials */}
					<div className="lg:col-span-4">
						<Image
							src="/Logo.png"
							alt="ExamSpark Logo"
							width={150}
							height={60}
						/>
						<div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
							<Link href="#" aria-label="Facebook">
								<FacebookIcon className="text-accent hover:text-primary w-5 h-5 sm:w-6 sm:h-6" />
							</Link>
							<Link href="#" aria-label="Twitter">
								<TwitterIcon className="text-accent hover:text-primary w-5 h-5 sm:w-6 sm:h-6" />
							</Link>
							<Link href="#" aria-label="Instagram">
								<InstagramIcon className="text-accent hover:text-primary w-5 h-5 sm:w-6 sm:h-6" />
							</Link>
						</div>
					</div>

					{/* Useful Links */}
					<div className="lg:col-span-2">
						<h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
							Links
						</h3>
						<ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-black/60">
							{headerData.map((item, index) => (
								<li key={index}>
									<Link
										href={item.href}
										className="hover:text-primary transition duration-300"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Other */}
					<div className="lg:col-span-2">
						<h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
							Other
						</h3>
						<ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-black/60">
							<li>
								<Link href="#" className="hover:text-primary">
									About Us
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary">
									Our Team
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary">
									Career
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary">
									Services
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-primary">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="lg:col-span-4 space-y-4 sm:space-y-6 text-sm sm:text-base text-black/60">
						<div className="flex items-start gap-2 sm:gap-3">
							<MapPinCheck className="text-accent w-4 h-4 sm:w-auto" />
							<span>Kigali, KG 15 Avenue</span>
						</div>
						<div className="flex items-start gap-2 sm:gap-3">
							<PhoneOutgoing className="text-accent w-4 h-4 sm:w-auto" />
							<span>+250 784 861 255 / +250 789 912 852</span>
						</div>
						<div className="flex items-start gap-2 sm:gap-3">
							<Folders className="text-accent w-4 h-4 sm:w-auto" />
							<span>info@examspark.com</span>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-8 sm:mt-12 border-t border-gray-200 pt-4 sm:pt-6 flex flex-col text-center sm:flex-row items-center justify-between text-xs sm:text-sm text-black/50 gap-3 sm:gap-4">
					<p>&copy; 2025 ExamSpark. All rights reserved.</p>
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
						<Link href="#" className="hover:text-primary">
							Privacy Policy
						</Link>
						<Link href="#" className="hover:text-primary">
							Terms & Conditions
						</Link>
					</div>
					<p>
						Distributed by{" "}
						<Link href="tel:+250784861255" className="hover:text-primary">
							Oscar Dushimire
						</Link>
						{" & "}
						<Link href="tel:+250789912852" className="hover:text-primary">
							Jean Lionel Ndabaga
						</Link>
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
