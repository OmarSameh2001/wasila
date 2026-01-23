"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../../_services/user";
import {
  User,
  Mail,
  Calendar,
  Users,
  Building2,
  Hash,
  Edit2,
  Save,
  X,
  LinkIcon,
} from "lucide-react";
import ContactInputField from "../../_components/form/contact_field";
import SocialMediaField from "../../_components/form/social_field";
import MultiCompanySelect from "../../_components/form/companies_field";
import Link from "next/link";
import WasilaQRCode from "../../_utils/link/qr";
import CopyLinkButton from "../../_utils/link/copy";
import LoadingPage from "../../_utils/promise_handler/loading/loading";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<any>({});
  const queryClient = useQueryClient();
  const url = process.env.NEXT_PUBLIC_BASE_URL || "";

  const { isLoading, data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
    },
  });

  const profile = data?.data?.user;
  const publicLink =
    url && profile?.id && profile?.publicToken
      ? url + "/broker-profile/" + profile?.id + "?t=" + profile?.publicToken
      : "";

  const handleEdit = () => {
    // Extract company IDs from the nested structure
    const companyIds = profile?.companies?.map((c: any) => c.companyId) || [];

    setFormState({
      name: profile?.name || "",
      username: profile?.username || "",
      companies: companyIds,
      socialMedia: profile?.socialMedia || {},
      contactInfo: profile?.contactInfo || [],
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormState({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formState);
  };

  if (isLoading) {
    return (
      <LoadingPage height="h-[90vh]" width="w-full" />
    );
  }

  return (
    <div className="min-h-[90vh] bg-gray-200 dark:bg-black">
      <div className="p-5">
        <form onSubmit={(e) => handleSave(e)} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profile?.name || "User Profile"}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{profile?.username || "username"}
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    // onClick={handleSave}
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {mutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    type="button"
                    disabled={mutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Managed Quotes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile?.managedCount || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Member Since
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Profile Details */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h2>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={isEditing ? formState.name : profile?.name || ""}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:cursor-not-allowed"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Hash className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                value={isEditing ? formState.username : profile?.username || ""}
                onChange={(e) =>
                  setFormState({ ...formState, username: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-700 disabled:cursor-not-allowed"
              />
            </div>

            {/* Companies */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Building2 className="w-4 h-4" />
                Insurers
              </label>
              <MultiCompanySelect
                field={{ key: "companies" }}
                formState={formState}
                setFormState={setFormState}
                disabled={!isEditing}
                initialCompanies={profile?.companies || []}
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Information
              </label>
              {isEditing ? (
                <ContactInputField
                  field={{ key: "contactInfo" }}
                  formState={formState}
                  setFormState={setFormState}
                  disabled={false}
                />
              ) : (
                <div className="space-y-2">
                  {profile?.contactInfo &&
                  Array.isArray(profile.contactInfo) &&
                  profile.contactInfo.length > 0 ? (
                    profile.contactInfo.map((contact: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                          {contact.type}:
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {contact.value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2">
                      No contact information added
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Social Media
              </label>
              {isEditing ? (
                <SocialMediaField
                  field={{ key: "socialMedia" }}
                  formState={formState}
                  setFormState={setFormState}
                  disabled={false}
                />
              ) : (
                <div className="space-y-2">
                  {profile?.socialMedia &&
                  Object.keys(profile.socialMedia).length > 0 ? (
                    Object.entries(profile.socialMedia).map(
                      ([platform, url]: [string, any]) => (
                        <div
                          key={platform}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                            {platform}:
                          </span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {url}
                          </a>
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2">
                      No social media links added
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          {publicLink ? <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Public Link and Qr
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <Link
                  href={publicLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors h-fit"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="capitalize font-medium">{publicLink}</span>
                </Link>
                <CopyLinkButton url={publicLink} />
              </div>
              <WasilaQRCode url={publicLink} name={profile?.name} />
            </div>
          </div> : null}
        </form>
      </div>
    </div>
  );
}
