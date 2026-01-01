import { Button } from "@headlessui/react";
import { TableColumn, TableIcon } from "./parts";
import { Axios, AxiosResponse } from "axios";

export interface ActionButton {
  name: string;
  onClick: (id: number, value?: any) => Promise<AxiosResponse<any, any, {}>> | void;
}
interface TableProps {
  name: string;
  columns: any[];
  data: any[];
  actions?: ActionButton[];
  loading: boolean;
  query: string
  addNew?: () => void;
}

function Table({ name, columns, data, actions, loading, query, addNew }: TableProps) {
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          {name || "Table"}
        </h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer" onClick={addNew}>Add New {name || ""}</button>
      </header>
      <div className="p-3">
        {/* Table */}
        {!loading && data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {(columns ?? []).map((column: any) => (
                    <th className="p-2 whitespace-nowrap" key={column.key}>
                      <span className="font-semibold text-left">
                        {column.name}
                      </span>
                    </th>
                  ))}
                  {actions?.length && actions?.length > 0 ? (
                    <th className="p-2 whitespace-nowrap">
                      <span className="font-semibold text-left">Actions</span>
                    </th>
                  ): null}
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={row.id ?? rowIndex} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    {columns.map((column) => (
                      <td key={column.key} className="p-2 whitespace-nowrap">
                        <TableColumn
                          type={column.type}
                          data={row[column.key]}
                        />
                      </td>
                    ))}
                    {actions && actions.length > 0  && (
                      <td className="p-2 whitespace-nowrap flex gap-2 items-center justify-center">
                        {actions?.map((action, index) => (
                            <TableIcon action={action} key={action.name + index} row={row} query={query}/>
                        ))}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="text-center">No data</div>
        )}
      </div>
    </div>
  );
}

export default Table;
