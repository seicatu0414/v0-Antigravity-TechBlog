import Image from "next/image"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"

export function HeroBanner({ images = [] }: { images?: { id: string, url: string }[] }) {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    const hasImages = images && images.length > 0;

    return (
        <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
            <Carousel
                plugins={[plugin.current]}
                className="w-full h-full"
                opts={{
                    loop: true,
                    align: "start",
                }}
            >
                <CarouselContent className="h-full ml-0">
                    {hasImages ? (
                        images.map((img) => (
                            <CarouselItem key={img.id} className="relative h-64 w-full md:h-80 lg:h-96 pl-0">
                                <Image
                                    src={img.url}
                                    alt="TechBlog Hero"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </CarouselItem>
                        ))
                    ) : (
                        <CarouselItem className="relative h-64 w-full md:h-80 lg:h-96 pl-0">
                            <Image
                                src="/hero-banner.jpg"
                                alt="TechBlog Hero"
                                fill
                                className="object-cover"
                                priority
                            />
                        </CarouselItem>
                    )}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
