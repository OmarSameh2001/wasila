"use client";
import SinglePolicyEditable from "@/app/(frontend)/_components/single_page/policy/policy";
import { getPolicy } from "@/app/(frontend)/_services/policy";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";


export default function AdminSinglePolicy() {
    const { id } = useParams();
    const { isLoading, data } = useQuery({
        queryKey: ["adminPolicy", id],
        queryFn: () => (isNaN(Number(id)) ? null : getPolicy(Number(id))),
      });
    return (
        <div className="flex flex-col min-h-[70vh] justify-center items-center">
            <SinglePolicyEditable policy={data?.data} isLoading={isLoading}/>
        </div>
    );
}