
const chooseUsData = [
    {
        "title": "Get paid quickly",
        "description": "No more waiting for weeks to get paid. Sell to us and receive quick payment!",
        "imageUrl": "/images/icons/money.svg"
    },
    {
        "title": "Top Dollar for Your Goods",
        "description": "Unlock the highest payout for your products.",
        "imageUrl": "/images/icons/money-goods.svg"

    },
    {
        "title": "Bulk Sales Made Easy",
        "description": "Simplify your sales process by selling to us in bulk - no need to worry about customer management.",
        "imageUrl": "/images/icons/bulk.svg"
    },
    {
        "title": "hassle-free sales with us",
        "description": "Say goodbye to return policies - sell to us and keep your profit.",
        "imageUrl": "/images/icons/care.svg"
    }
];

const ChooseUsSection = () => {
    return (
        <section className="container-main poppins mt-12">
            <header className="mb-8">
                <h2 className="text-[32px] text-[#36261D] text-center">Why choose us?</h2>
                <p className="text-center text-[#333] ">We are the best in the market and here are some reasons why</p>
            </header>
            <section className="py-[66px]  bg-white md:rounded-[30px] md:px-[72px] md:mx-auto -mx-6 px-0 rounded-none">
                <div className="grid grid-cols-1 gap-8  lg:grid-cols-2">
                    {chooseUsData.map((item, index) => (
                        <Card key={index} {...item} />
                    ))}
                </div>
            </section>
        </section>
    );
}

type CardProps = {
    title: string;
    description: string;
    imageUrl: string;
}

const Card = ({ title, description, imageUrl }: CardProps) => {
    return (
        <div className="flex  items-center h-[210px]  rounded-3xl    relative ">
            <img alt="circular png" src="/images/circular.png" className="h-[210px] relative -mr-10" />
            <div className=" top-0 left-0   absolute">
                <div className="flex justify-center bg-[#fafafa] p-4 items-center rounded-[30px] box-border  w-[120px] h-[100px]"  >
                    <img alt={title} src={imageUrl} className="w-12 h-12" />
                </div>
            </div>
            <div className="relative h-full flex-1  flex flex-col justify-center bg-[#fafafa] rounded-r-3xl py-10  sm:px-8 px-2 mx-auto">
                <h3 className="sm:text-[22px] text-lg font-medium  text-[#462512]">{title}</h3>
                <p className=" text-[15px] text-[#4B4B4B]">{description}</p>
            </div>
        </div>
    );
}

export function CircularLayer({ className }: PropsWithClassName) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="204"
            height="213"
            fill="none"
            viewBox="0 0 204 213"
        >
            <path
                fill="#FAFAFA"
                d="M20 121c-11.046 0-20 8.954-20 20v32c0 22.091 17.909 40 40 40h124c22.091 0 40-17.909 40-40V40c0-22.091-17.909-40-40-40h-3c-11.046 0-20 8.954-20 20v41c0 33.137-26.863 60-60 60H20z"
            ></path>
        </svg>
    );
}

export default ChooseUsSection;