import { type Metadata } from 'next'
import {
	ClerkProvider,
	// SignInButton,
	// SignUpButton,
	// SignedIn,
	// SignedOut,
	// UserButton,
} from '@clerk/nextjs'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const poppins = Poppins({
	variable: '--font-poppins',
	subsets: ['latin'],
	display: 'swap',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
	title: 'Exam Spark',
	description: 'A platform for creating and taking exams',
	icons: {
		icon: '/brand.png',
		shortcut: '/brand.png',
		apple: '/brand.png',
	},
	openGraph: {
		title: 'Exam Spark',
		description: 'A platform for creating and taking exams',
		url: 'https://examspark.vercel.app',
		siteName: 'Exam Spark',
		images: [
			{
				url: '/Logo.png',
				width: 800,
				height: 600,
				alt: 'Exam Spark Logo',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Exam Spark',
		description: 'A platform for creating and taking exams',
		images: '/Logo.png',
		creator: '@exam_spark',
	},


}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={poppins.variable} suppressHydrationWarning>
					<Navbar />
					{children}
					<Footer />
				</body>
			</html>
		</ClerkProvider>
	)
}