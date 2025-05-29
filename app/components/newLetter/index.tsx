import { SendHorizonal } from "lucide-react";

const Newsletter = () => {


	return (
		<section>
			<div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-0 sm:px-4"> {/* Adjusted px for container */}
				<div className="grid grid-cols-1 gap-y-6 sm:gap-y-10 gap-x-6 md:grid-cols-12 xl:gap-x-8">
					<div className="relative col-span-12 bg-gradient-to-r from-sky-900 via-cyan-600 to-sky-500 rounded-2xl sm:rounded-[30px] transform bg-contain bg-no-repeat">
						<div className="z-10 my-12 sm:my-16 md:my-20 lg:my-24 mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64">
							<h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-semibold text-white mb-2 sm:mb-3">Newsletter.</h3>
							<h3 className="text-xs sm:text-sm md:text-base font-normal text-white/75 text-center mb-6 sm:mb-8">
								Subscrible our newsletter for discounts, <br /> promo and many more.
							</h3>
							<div>
								<div className="relative bg-gray text-white focus-within:text-white flex flex-row-reverse rounded-full pt-3 lg:pt-0">
									<input type="Email address" name="q" className="py-4 sm:py-6 lg:py-8 text-xs sm:text-sm md:text-lg w-full mx-2 sm:mx-3 text-black rounded-full pl-4 sm:pl-6 md:pl-8 focus:outline-none focus:text-black" placeholder="Enter your email address" autoComplete="off" />
									<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 md:pr-4 lg:pr-6 pt-3 lg:pt-0">
										<button type="submit" className="p-2 sm:p-3 lg:p-5 focus:outline-none focus:shadow-outline bg-ultramarine hover:bg-midnightblue duration-150 ease-in-out rounded-full">
											<SendHorizonal className="text-accent text-lg sm:text-xl md:text-2xl lg:text-4xl inline-block" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Newsletter;