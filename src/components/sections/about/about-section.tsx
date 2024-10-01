import { cn } from "@/lib/utils";
import { aboutData } from "./data";

const AboutSection = () => {
    return (
        <section className="grid xl:grid-cols-12 grid-cols-1 xl:px-16 md:px-12 mt-12 gap-8 px-2 container-main">
            <header className="xl:col-span-12">
                <h1 className="text-xl ml-2 font-semibold ">About us</h1>
            </header>
            <Card {...aboutData[0]} className="xl:col-span-5" />
            <div className="p-6 xl:col-span-7 gap-4 rounded-[30px] bg-white md:grid-cols-3 grid-cols-2 grid">
                <div className="md:h-full h-32 col-span-2 bg-[url('/images/about.png')] bg-cover bg-gray-100 rounded-[30px]" />

                <div className="flex flex-col gap-3 md:col-span-1 col-span-2 ">
                    <div className="bg-[#F9F4F0] flex-1 relative rounded-[30px] p-8">
                        <h3 className="text-5xl mb-2 relative z-10 font-semibold">1K+</h3>
                        <p className=" text-[#333]  relative z-10 text-lg">Products bought</p>
                        <Asterisk />
                    </div>
                    <div className="bg-[#F9F4F0] flex-1 relative rounded-[30px] p-8">
                        <h3 className="text-5xl mb-2 relative z-10 font-semibold">99%</h3>
                        <p className=" text-[#333]   relative z-10 text-lg">Positive reviews</p>
                        <Star />
                    </div>

                </div>
            </div>
            <Card {...aboutData[1]} className="xl:col-span-7" />
            <Card {...aboutData[2]} className="xl:col-span-5" />


        </section>
    );
}

type CardProps = {
    question: string,
    label: string,
    answer: string,
    className?: string
}

const Card = ({ className, question, answer, label }: CardProps) => {
    return <div className={cn("p-6 rounded-[30px] bg-white space-y-3", className)}>
        <h2 className=" text-primary font-semibold ">{question}</h2>
        <p className="text-2xl font-bold mb-4">{label}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{answer}</p>
    </div>
}

const Asterisk = () => {
    return (
        <svg
            className="absolute bottom-0 right-0"
            xmlns="http://www.w3.org/2000/svg"
            width="113"
            height="144"
            fill="none"
            viewBox="0 0 113 144"
        >
            <mask
                id="mask0_156_3270"
                style={{ maskType: "alpha" }}
                width="113"
                height="144"
                x="0"
                y="0"
                maskUnits="userSpaceOnUse"
            >
                <path
                    fill="#fff"
                    d="M0 30C0 13.431 13.431 0 30 0h53c16.569 0 30 13.431 30 30v84c0 16.569-13.431 30-30 30H30c-16.569 0-30-13.431-30-30V30z"
                ></path>
            </mask>
            <g mask="url(#mask0_156_3270)">
                <path
                    fill="#F1EBE6"
                    d="M68.825 80l1.782-39.563-33.385 21.47L27 44.093 62.448 26 27 7.906 37.222-9.906l33.385 21.468L68.825-28h20.35l-1.782 39.563 33.385-21.47L131 7.907 95.552 26 131 44.094l-10.222 17.812-33.385-21.468L89.175 80h-20.35z"
                ></path>
            </g>
        </svg>
    );

}

function Star() {
    return (
        <svg
            className="absolute bottom-0 right-0"
            xmlns="http://www.w3.org/2000/svg"
            width="199"
            height="192"
            fill="none"
            viewBox="0 0 199 192"
        >
            <mask
                id="mask0_160_739"
                style={{ maskType: "alpha" }}
                width="199"
                height="192"
                x="0"
                y="0"
                maskUnits="userSpaceOnUse"
            >
                <rect width="199" height="192" fill="#F9F4F0" rx="30"></rect>
            </mask>
            <g mask="url(#mask0_160_739)">
                <path
                    fill="#F1EBE6"
                    d="M172.667 117.359c1.436-6.337 9.981-7.469 13.017-1.723l17.108 32.382a6.996 6.996 0 004.643 3.557l35.719 8.092c6.337 1.436 7.469 9.981 1.723 13.016l-32.382 17.109a7 7 0 00-3.558 4.642l-8.091 35.719c-1.436 6.338-9.981 7.469-13.016 1.724l-17.109-32.383a7.002 7.002 0 00-4.642-3.557l-35.719-8.091c-6.338-1.436-7.469-9.981-1.724-13.017l32.383-17.108a7.001 7.001 0 003.557-4.643l8.091-35.719z"
                    opacity="0.9"
                ></path>
            </g>
        </svg>
    );
}

export default AboutSection;
