"use client";
import SingleProductEditable from "@/app/(frontend)/_components/single_page/product/product";
import ProductsByType from "@/app/(frontend)/_components/single_page/product/products_by_type";
import { getPolicy } from "@/app/(frontend)/_services/policy";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function AdminSinglePolicy() {
  const { id } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ["product", id],
    queryFn: () => (isNaN(Number(id)) ? null : getPolicy(Number(id))),
  });
  if (["sme", "individual_medical"].includes(id?.toString() || ""))
    return <ProductsByType type={id?.toString() || ""} />;

  return (
    <div className="flex flex-col min-h-[70vh] justify-center items-center">
      <SingleProductEditable policy={data?.data} isLoading={isLoading} />
    </div>
  );
}
