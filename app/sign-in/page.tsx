import { SignIn } from '@clerk/nextjs'

export default function Page() {
	return (
		<div className="flex items-center justify-center min-h-screen w-full  py-20">
			<SignIn routing="hash" />
		</div>
	)
}