import {
  Building2,
  ChartLine,
  Scroll,
  ScrollText,
  Users,
  Users2,
} from "lucide-react";
import Link from "next/link";

export default function BrokerHomePage() {
  const links = [
    { href: "/broker/client", title: "My Clients", Icon: Users },
    { href: "/broker/product", title: "My Products", Icon: ScrollText },
    { href: "/broker/wasila-products", title: "Wasila Products", Icon: Scroll },
    { href: "/broker/crm", title: "CRM", Icon: ChartLine },
    { href: "/broker/insurer", title: "Insurers", Icon: Building2 },
  ];
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <h1 className="text-2xl font-bold">Welcome Broker</h1>
      <div className="flex gap-10 mt-5 sm:flex-row flex-col">
        {links.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="flex flex-col items-center justify-center gap-2 hover:scale-105 hover:underline duration-300"
          >
            <div className="bg-gray-300 dark:bg-gray-800 p-6 rounded relative">
              <link.Icon className="scale-180" />

              {link.title === "Wasila Products" && (
                <>
                  <img
                    src="/logo.svg"
                    alt="logo"
                    className="w-[18px] h-[20px] absolute inset-y-[23px] right-[26px] dark:invert"
                  />
                </>
              )}
            </div>
            <span>{link.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
