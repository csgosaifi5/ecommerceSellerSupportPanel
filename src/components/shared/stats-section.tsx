import { cn } from "@/lib/utils";

const Stats = [
  {
    label: "Total offers",
    value: "890",
    image_url: "/images/offers.svg",
  },
  {
    label: "Items sold",
    value: "12k",
    image_url: "/images/items.svg",
  },
  {
    label: "Earned by users",
    value: "$1M+",
    image_url: "/images/money.svg",
  },
  {
    label: "Success rate",
    value: "99.99%",
    image_url: "/images/thumbs-up.svg",
  },
];
const StatsSection = ({size}:{size:'lg'|'md'}) => {
  return (
    <section className={cn("poppins ",size=="md"?"bg-[#eeeee]":"bg-white  py-5")}>
      <div className="container-main  ">
        <main className="flex  md:justify-evenly  justify-center flex-wrap md:flex-row flex-col">
          {Stats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              size={size}
              value={stat.value}
              imageUrl={stat.image_url}
            />
          ))}
        </main>
      </div>
    </section>
  );
};
type StatsCardProps = {
  label: string;
  value: string;
  imageUrl: string;
  size:'md' | 'lg'
};

const StatsCard = ({ label, value, imageUrl,size='lg' }: StatsCardProps) => {
  //tailwind
  return (
    <div className="flex items-center justify-center  p-3 rounded-[30px]  gap-3">
      <img className="mt-4" src={imageUrl} alt={label} />
      <div>
        <h3 className={cn("text-[36px] leading-[110%]",size === 'md' ? 'text-2xl font-semibold' : 'text-[36px]  font-semibold')}>{value}</h3>
        <p className="text-sm uppercase  text-[#6D6D6D] ">{label}</p>
      </div>
    </div>
  );
};
export default StatsSection;
