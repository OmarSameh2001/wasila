import TablePart from "./parts";

interface TableProps {
  name: string;
  columns: any[];
  data: any[];
  actions: any[];
}

function Table({ name, columns, data, actions }: TableProps) {
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          {name || "Table"}
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {columns?.map((column: any) => (
                  <th className="p-2 whitespace-nowrap" key={column.key}>
                    <div className="font-semibold text-left">{column.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key} className="p-2 whitespace-nowrap">
                      <TablePart type={column.type} data={row[column.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
