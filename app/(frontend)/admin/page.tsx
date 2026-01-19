import { Building2, ChartLine, Heart, ScrollText, Users, Users2 } from "lucide-react";
import Link from "next/link";

export default function AdminHomePage() {
  const links = [
    { href: "/admin/broker", title: "Brokers", Icon: Users2 },
    { href: "/admin/client", title: "Clients", Icon: Users },
    { href: "/admin/product", title: "Products", Icon: ScrollText },
    { href: "/admin/insurer", title: "Insurers", Icon: Building2 },
    { href: "/admin/crm", title: "CRM", Icon: ChartLine },
  ];
  return (
    <div className="flex flex-col min-h-screen h-full justify-center items-center">
      <h1 className="text-2xl font-bold">Welcome Admin</h1>
      <div className="flex gap-10 mt-5 sm:flex-row flex-col">
        {links.map((link) => (
          <Link key={link.title} href={link.href} className="flex flex-col items-center justify-center gap-2 hover:scale-105 duration-300">
            <div className="bg-gray-300 dark:bg-gray-800 p-6 rounded">
              <link.Icon className="scale-180"/>
            </div>
            <span>{link.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

