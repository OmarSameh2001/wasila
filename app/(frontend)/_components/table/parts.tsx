
export function TableColumn({ type, data }: any) {
  switch (type) {
    case "logo": {
      const logo = typeof data === "string" ? data : data?.logo;

      const name = typeof data === "object" ? data?.name : null;

      return (
        <div className="flex flex-col items-center justify-center">
          {logo && (
            <div className="shrink-0 flex items-center">
              <img
                className="w-10 h-10 rounded object-cover"
                src={logo}
                // width={40}
                // height={40}
                alt={name || "logo"}
              />
            </div>
          )}

          {name && <span className="">{name}</span>}
        </div>
      );
    }
    case "text":
      return <div className="text-center">{data?.name || data}</div>;
    case "date":
      return <div className="text-center">{data.split("T")[0]}</div>;
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
  DocumentIcon,
} from "@heroicons/react/20/solid";
import { TableActionButton } from "../../_dto/general";
import { showConfirmToast } from "../utils/toaster/toaster";
import { queryInvalidator } from "../utils/query/query";
import { useRouter } from "next/navigation";

export function TableActionIcon({
  action,
  row,
  query,
  tabelName
}: {
  action: TableActionButton;
  row: any;
  query?: string;
  tabelName?: string
}) {
  const router = useRouter();
  console.log(row);
  const name = row.name;
  async function handleDelete() {
    showConfirmToast({
      message: `Are you sure you want to delete ${name || "this"}?`,
      tableName: tabelName,
      onConfirm: () => {action?.onClick?.(row.id)
        if(query) queryInvalidator(query)
      },
    })
  }

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
          onClick={() => action?.onClick?.(row.id, row)}
          title={name ? action.name + " " + name : action.name}
        />
      );
    case "pdf":
      return (
        <DocumentIcon
          className="text-blue-500 size-7 cursor-pointer p-1"
          onClick={() => window.open(`/admin/crm/${row.id}/pdf`, "_blank")}
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
