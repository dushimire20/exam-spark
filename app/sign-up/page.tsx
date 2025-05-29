import { SignUp } from '@clerk/nextjs'

export default function Page() {
	return (
		<div className="flex items-center justify-center min-h-screen w-full  py-20">
			<SignUp routing="hash" />
		</div>
	)
}