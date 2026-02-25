import Image from "next/image"

export function HeroBanner() {
    return (
        <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
            <Image
                src="/hero-banner.jpg"
                alt="TechBlog Hero"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
                <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm md:text-4xl lg:text-5xl text-balance">
                    {'Share your tech knowledge'}
                </h1>
                <p className="max-w-lg text-sm font-mono tracking-wider text-white/80 md:text-base">
                    {'The platform for engineers to share and learn'}
                </p>
            </div>
        </div>
    )
}
