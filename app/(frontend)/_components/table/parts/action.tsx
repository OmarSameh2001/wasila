import {
  TrashIcon,
  PencilSquareIcon,
  InformationCircleIcon,
  DocumentIcon,
} from "@heroicons/react/20/solid";
import { TableActionButton } from "../../../_dto/general";
import {
  showConfirmToast,
  showErrorToast,
  showSuccessToast,
} from "../../../_utils/toaster/toaster";
import { queryInvalidator } from "../../../_utils/query/query";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/app/(frontend)/_utils/context/auth";
import { Trash2 } from "lucide-react";

export function TableActionIcon({
  action,
  row,
  query,
  tabelName,
}: {
  action: TableActionButton;
  row: any;
  query?: string;
  tabelName?: string;
}) {
  const { type } = useContext(AuthContext);
  const name = row?.name;
  async function handleDelete() {
    showConfirmToast({
      message: `Are you sure you want to delete ${name || "this"}?`,
      tableName: tabelName,
      onConfirm: async () => {
        try {
          await action?.onClick?.(row?.id);
          if (query) queryInvalidator(query);
          showSuccessToast("Successfully deleted!");
        } catch (e) {
          showErrorToast("Failed to delete");
        }
      },
    });
  }

  switch (action.name.toLowerCase()) {
    case "delete":
      return (
        <div
          className="cursor-pointer"
          title={name ? action.name + " " + name : action.name}
        >
          <Trash2
            className={
              "text-red-500 size-7 cursor-pointer p-1" + type === "ADMIN" &&
              (row?.brokerId || "")
                ? " hidden"
                : ""
            }
            onClick={handleDelete}
          />
        </div>
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
          className="text-blue-500 size-10 cursor-pointer p-1 hover:animate-pulse"
          onClick={() =>
            window.open(`/${type.toLowerCase()}/crm/${row.id}/pdf`, "_blank")
          }
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
