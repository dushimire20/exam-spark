"use client"
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TruestedCompanies } from "@/app/api/data";

// CAROUSEL SETTINGS
const Companies = () => {

	const settings = {
		dots: false,
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		autoplay: true,
		speed: 2000,
		autoplaySpeed: 2000,
		cssEase: "linear",
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
					infinite: true,
					dots: false
				}
			},
			{
				breakpoint: 700, // Consider 768 (md)
				settings: {
					slidesToShow: 3, // Adjusted from 2 to 3 for md screens
					slidesToScroll: 1,
					infinite: true,
					dots: false
				}
			},
			{
				breakpoint: 500, // Consider 640 (sm)
				settings: {
					slidesToShow: 2, // Adjusted from 1 to 2 for sm screens
					slidesToScroll: 1,
					infinite: true,
					dots: false
				}
			}
		]
	};

	return (
		<section className='text-center' >
			<div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-0 sm:px-4"> {/* Adjusted px for container */}
				<h2 className="text-midnight_text text-lg sm:text-xl md:text-2xl font-semibold">Trusted by companies of all sizes</h2>
				<div className="py-8 sm:py-10 md:py-14 border-b ">
					<Slider {...settings}>
						{TruestedCompanies.map((item, i) =>
							<div key={i} className="px-2 sm:px-4"> {/* Added padding around individual slide items for better spacing */}
								<Image src={`${item.imgSrc}`} alt={item.imgSrc} width={116} height={36} style={{ margin: 'auto' }} /> {/* Centering image */}
							</div>
						)}
					</Slider>
				</div>
			</div>
		</section>
	)

}

export default Companies;