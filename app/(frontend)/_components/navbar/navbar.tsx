"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkToggle } from "./dark_mode";
import { AuthContext } from "../../_utils/context/auth";
import { useContext, useEffect } from "react";
import { logout } from "../../_services/auth";
import {
  showLoadingError,
  showLoadingSuccess,
  showLoadingToast,
} from "../../_utils/toaster/toaster";
// import { useActiveNav } from "@/hooks/useActiveNav";
export function useActiveNav(href: string, pathname: string) {
  if (href === "/") return pathname === "/";

  return pathname === href || pathname.startsWith(href + "/");
}
const navigation = {
  guest: [
    { name: "Become Broker", href: "/register" },
    { name: "Login", href: "/login" },
  ],
  broker: [
    { name: "My Clients", href: "/broker/client" },
    { name: "My Products", href: "/broker/product" },
    { name: "Wasila Products", href: "/broker/wasila-products" },
    { name: "CRM", href: "/broker/crm" },
    { name: "Insurers", href: "/broker/insurer" },
    // { name: "Settings", href: "/broker/settings" },
  ],
  admin: [
    { name: "Brokers", href: "/admin/broker" },
    { name: "Clients", href: "/admin/client" },
    { name: "Products", href: "/admin/product" },
    { name: "Insurers", href: "/admin/insurer" },
    { name: "CRM", href: "/admin/crm" },
  ],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { type, isLoading, refetchAuth } = useContext(AuthContext);
  const pathname = usePathname();
  console.log(pathname);
  const nav = isLoading
    ? []
    : type === "ADMIN"
      ? navigation.admin
      : type === "BROKER"
        ? navigation.broker
        : pathname.split("/")[1] === "broker-profile"
          ? []
          : navigation.guest;

  return (
    <Disclosure
      as="nav"
      className="relative w-full bg-white dark:bg-gray-800/50 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile button */}
          {nav?.length > 0 ? <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
              <Bars3Icon className="block size-6 group-data-open:hidden" />
              <XMarkIcon className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div> : null}

          {/* Logo + Desktop Nav */}
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <Link
              href={type ? `/${type.toLowerCase()}` : "/"}
              className="flex items-center xs:gap-x-2"
            >
              {/* <div className="w-11 h-11 bg-blue-500 rounded flex items-center justify-center">
                <div className="rounded-full text-2xl font-bold">W</div>
              </div> */}
              <img
                src="/logo.svg"
                alt="logo"
                className="w-11 h-10 dark:invert"
              />
              <span className="text-xl font-bold hidden xs:block">Wasila</span>
            </Link>
            {/* <DarkToggle /> */}

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex md:space-x-4">
                {nav?.map((item) => {
                  const isActive = useActiveNav(item.href, pathname);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-gray-400 dark:bg-gray-950/50 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:text-dark dark:hover:bg-white/5 dark:hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium flex items-center",
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          {!isLoading && type && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Menu as="div" className="relative ml-3">
                <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {type === "BROKER" && (
                    <MenuItem>
                      <Link
                        href={"/broker/profile"}
                        className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                      >
                        {"Profile"}
                      </Link>
                    </MenuItem>
                  )}
                  {/* <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                    >
                      Settings
                    </a>
                  </MenuItem> */}
                  <MenuItem>
                    <span
                      onClick={async () => {
                        if (!confirm("Are you sure you want to sign out?"))
                          return;
                        let toastId = showLoadingToast("Signing Out...");
                        try {
                          await logout();
                          await refetchAuth();
                          showLoadingSuccess(
                            toastId,
                            "Signed Out Successfully",
                          );
                        } catch (e) {
                          showLoadingError(toastId, "Something went wrong");
                        }
                      }}
                      className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer"
                    >
                      Sign out
                    </span>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {nav?.map((item) => {
            const isActive = useActiveNav(item.href, pathname);

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={classNames(
                  isActive
                    ? "bg-gray-950/50 text-white"
                    : "text-gray-900 hover:bg-gray-200 hover:text-gray-900 dark:text-white dark:hover:bg-white/5 dark:hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium",
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
