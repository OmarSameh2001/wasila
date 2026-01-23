// app/profile/server-view/page.tsx
import { getServerSideBroker } from "@/app/(backend)/_dal/user";
import { notFound } from "next/navigation";
import {
  Mail,
  Calendar,
  User as UserIcon,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { VscCallOutgoing } from "react-icons/vsc";

type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ServerProfilePage({
  params,
  searchParams,
}: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const userId = resolvedParams.id;
  const token = resolvedSearchParams.t;

  // 2. Direct Database Call (No API fetch)
  const user = await getServerSideBroker(Number(userId), token || "");

  // 3. Handle 404
  if (!user) {
    return notFound();
  }

  // Helper for date formatting
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-[90vh] bg-gray-200 dark:bg-black p-5">
      <div className="max-w-4xl mx-auto">
        {/* --- Header Card --- */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              {/* Name & Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name || "User Profile"}
                </h1>
              </div>
            </div>
          </div>

          {/* --- Quick Stats --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Managed Quotes */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Managed Quotes on Wasila
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.managedCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wasila Member Since
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Profile Details --- */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b dark:border-gray-800 pb-2">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4" /> Email
              </label>
              <div className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                <Link
                  href={
                    "https://mail.google.com/mail/?view=cm&fs=1&to=" +
                    user.email
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {user.email}
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.isArray(user.contactInfo) &&
              user.contactInfo.length > 0 ? (
                user.contactInfo.map((contact: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {contact.type}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {contact.value}
                      </span>
                    </div>

                    {/* Check if it's a mobile number starting with 01 */}
                    {contact?.type?.toLowerCase() === "mobile" ? (
                        <div className="flex gap-3">
                          <Link
                            href={`tel:${contact.value}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            title="Call"
                          >
                            <VscCallOutgoing className="w-5 h-5" />
                          </Link>

                          {contact?.value?.startsWith("01") ? <Link
                            href={`https://wa.me/2${contact.value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm font-semibold"
                            title="WhatsApp"
                          >
                            <FaWhatsapp className="w-5 h-5" />
                          </Link> : null}
                        </div>
                      ): null}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No contact info provided.
                </p>
              )}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Social Media
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.socialMedia && Object.keys(user.socialMedia).length > 0 ? (
                Object.entries(user.socialMedia).map(([platform, url]) => (
                  <Link
                    key={platform}
                    href={url as string || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="capitalize font-medium">{platform}</span>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 italic">No social links.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
