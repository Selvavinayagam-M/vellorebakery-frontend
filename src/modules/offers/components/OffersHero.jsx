const HERO_DATA = {
    title: "Sweet Deals & Savory Steals",
    subtitle: "Grab your favorites at unbeatable prices. Limited time offers strictly for you.",
    bgImage: "https://res.cloudinary.com/demo/image/upload/v1/laddu_sample.jpg"
};

const OffersHero = () => {
    const { title, subtitle, bgImage } = HERO_DATA;

    return (
        <div className="bg-brand-mahogany text-white pt-12 pb-24 relative overflow-hidden">
            <div
                className="absolute top-0 left-0 w-full h-full opacity-10"
                style={{ backgroundImage: `url('${bgImage}')` }}
            ></div>
            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-brand-turmeric">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-brand-cream/90 font-light max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default OffersHero;
