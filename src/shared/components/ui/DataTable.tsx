import { useMemo, useState, useEffect, type ReactNode } from "react";
import { Search, ChevronDown, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: Column<T>[];

  rowKey: (row: T) => string | number;

  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];

  selectable?: boolean;

  showColumnsButton?: boolean;
  showExportButton?: boolean;

  toolbarActions?: ReactNode;

  emptyMessage?: string;
  pageSize?: number;
}

export function DataTable<T>({
  title,
  data,
  columns,
  rowKey,

  searchable = false,
  searchPlaceholder = "Search...",
  searchFields = [],

  selectable = false,

  showColumnsButton = true,
  showExportButton = true,

  toolbarActions,

  emptyMessage = "No data found.",
  pageSize=6
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data;

    return data.filter((row) =>
      searchFields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchFields, searchable, searchTerm]);
  
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Ensure current page is safely bounded without problematic effects
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Ensure paginatedData uses pageSize and safeCurrentPage properly
  const paginatedData = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return filteredData.slice(startIdx, startIdx + pageSize);
  }, [filteredData, safeCurrentPage, pageSize]);

  const start =
    filteredData.length === 0
      ? 0
      : (safeCurrentPage - 1) * pageSize + 1;

  const end = Math.min(safeCurrentPage * pageSize, filteredData.length);

  // Reset to page 1 on a fresh search term change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const toggleSelectAll = () => {
    const pageIds = paginatedData.map(rowKey);
    const allSelected = pageIds.every((id) => selectedRows.includes(id));

    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const toggleRow = (id: string | number) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold">{title}</h3>
        </div>
      )}

      {/* Toolbar */}
      {(searchable || toolbarActions || showColumnsButton || showExportButton) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3">
          {searchable ? (
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm"
              />
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {toolbarActions}

            {showColumnsButton && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
              >
                Columns
                <ChevronDown className="h-3 w-3" />
              </Button>
            )}

            {showExportButton && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
              >
                Export
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="border-b bg-muted/40">
            <tr>
              {selectable && (
                <th className="w-10 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) => selectedRows.includes(rowKey(row)))
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {paginatedData.length ? (
              paginatedData.map((row) => {
                const id = rowKey(row);
                return (
                  <tr
                    key={id}
                    className={`hover:bg-muted/30 ${
                      selectedRows.includes(id) ? "bg-muted/20" : ""
                    }`}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(id)}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}

                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`px-6 py-4 ${column.className ?? ""}`}
                      >
                        {column.render
                          ? column.render(row)
                          : String(row[column.key as keyof T] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination Controls */}
      <div className="flex items-center justify-between border-t px-6 py-4 text-xs">
        <span>
          Showing {start}-{end} of {filteredData.length}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={safeCurrentPage >= totalPages || totalPages === 0}
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}