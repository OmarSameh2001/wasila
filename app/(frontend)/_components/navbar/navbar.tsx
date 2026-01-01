"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkToggle } from "./dark_mode";
// import { useActiveNav } from "@/hooks/useActiveNav";
export function useActiveNav(href: string) {
  const pathname = usePathname();

  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(href + "/");
}
const navigation = {
  main: [
    { name: "Broker", href: "/broker" },
    { name: "Admin", href: "/admin" },
  ],
  broker: [
    { name: "My Policies", href: "/broker" },
    { name: "Health Policies", href: "/broker/health" },
    { name: "My Clients", href: "/broker/clients" },
    { name: "My Records", href: "/broker/records" },
    { name: "Settings", href: "/broker/settings" },
  ],
  admin: [
    { name: "Records", href: "/admin/record" },
    { name: "Clients", href: "/admin/client" },
    { name: "Policies", href: "/admin/policy" },
    { name: "Brokers", href: "/admin/broker" },
    { name: "Companies", href: "/admin/company" },
  ],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  const nav = pathname.startsWith("/admin")
    ? navigation.admin
    : pathname.startsWith("/broker")
    ? navigation.broker
    : navigation.main;

  return (
    <Disclosure
      as="nav"
      className="relative w-full bg-white dark:bg-gray-800/50 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
              <Bars3Icon className="block size-6 group-data-open:hidden" />
              <XMarkIcon className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + Desktop Nav */}
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <Link href="/" className="flex items-center gap-x-4">
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
                alt="Wasila"
              />
              <span className="text-xl font-bold">Wasila</span>
            </Link>
            {/* <DarkToggle /> */}

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {nav.map((item) => {
                  const isActive = useActiveNav(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-gray-950/50 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {nav.map((item) => {
            const isActive = useActiveNav(item.href);

            return (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={classNames(
                  isActive
                    ? "bg-gray-950/50 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
