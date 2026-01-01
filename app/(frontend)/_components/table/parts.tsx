import Image from "next/image";

export function TableColumn({ type, data }: any) {
  switch (type) {
    case "logo": {
  const logo =
    typeof data === "string"
      ? data
      : data?.logo;

  const name =
    typeof data === "object"
      ? data?.name
      : null;

  return (
    <div className="flex items-center justify-center">
      {logo && (
        <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
          <Image
            className="rounded-full"
            src={logo}
            width={40}
            height={40}
            alt={name || "logo"}
          />
        </div>
      )}

      {name && <span className="pb-4">{name}</span>}
    </div>
  );
}
    case "text":
      return <div className="text-center">{data?.name || data}</div>;
    case "action":
      return (
        <div className="flex flex-col gap-2">
          <span className="font-bold">{data.name}</span>
          <span className="text-sm">{data.description}</span>
        </div>
      );
    case "price":
      return <div className="text-left font-medium text-green-500">{data}</div>;
    default:
      return null;
  }
}

import {
  TrashIcon,
  PencilSquareIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import { ActionButton } from "./table";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { PopupContext } from "../utils/context/popup_provider";

export function TableIcon({
  action,
  row,
  query,
}: {
  action: ActionButton;
  row: any;
  query?: string;
}) {
  const {setComponent} = useContext(PopupContext)
  const queryClient = useQueryClient();
  const name = row.name;
  async function handleDelete() {
    const del = window.confirm(
      `Are you sure you want to delete ${name || "this"}?`
    );
    if (del) {
      await action.onClick(row.id);
    }
    if (query)
      queryClient.invalidateQueries([query] as InvalidateQueryFilters<
        readonly unknown[]
      >);
  }

  // async function handleEdit() {
  //   setComponent(

  //   )
  // }
  switch (action.name.toLowerCase()) {
    case "delete":
      return (
        <TrashIcon
          className="text-red-500 size-7 cursor-pointer p-1"
          onClick={handleDelete}
          title={name ? action.name + " " + name : action.name}
        />
      );
    case "edit":
      return (
        <PencilSquareIcon
          className="text-yellow-500 size-7 cursor-pointer p-1"
          onClick={() => action.onClick(row.id, row)}
          title={name ? action.name + " " + name : action.name}
        />
      );
    default:
      return null;
      return (
        <InformationCircleIcon
          className="text-blue-500 size-7 cursor-pointer p-1"
          // onClick={action.onClick}
          title={name ? action.name + " " + name : action.name}
        />
      );
  }
}
