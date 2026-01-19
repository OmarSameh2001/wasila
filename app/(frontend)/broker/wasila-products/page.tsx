import Link from "next/link";
import { Heart, Briefcase, Car } from "lucide-react";

export default function BrokerProduct() {
  const products = [
    {
      title: "Individual Medical",
      icon: Heart,
      href: "/broker/wasila-products/individual_medical",
      gradient: "from-gray-400 dark:from-gray-900 to-blue-900"
    },
    {
      title: "SME Medical",
      icon: Briefcase,
      href: "/broker/wasila-products/sme",
      gradient: "from-gray-400 dark:from-gray-900 to-blue-900"
    },
    {
      title: "Motor Insurance",
      icon: Car,
      href: "",
      gradient: "from-gray-900 to-gray-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-[90vh] justify-center items-center bg-gray-200 dark:bg-black px-4 py-12">
      <h1 className="text-gray-900 dark:text-white text-3xl font-semibold mb-12">Wasila Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <Link
              key={product.title}
              href={product.href || "#"}
              className={"group" + (product.href ? " cursor-pointer" : " cursor-not-allowed")}
            >
              <div className={`bg-gradient-to-b ${product.gradient} rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50`}>
                <div className="bg-white/10 dark:bg-black/10 rounded-full p-4 mb-4 group-hover:bg-white/20 transition-colors">
                  <Icon className="w-12 h-12 dark:text-white text-black" strokeWidth={1.5} />
                </div>
                <h2 className="text-white text-xl font-medium text-center">
                  {!product.href ? product.title + " - Soon" : product.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}