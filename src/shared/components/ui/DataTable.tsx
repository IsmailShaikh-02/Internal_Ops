import { useMemo, useState, useEffect, useRef, type ReactNode } from "react";
import { Search, ChevronDown, Download, ArrowUpDown, Check, Pin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Column<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
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
  onExport?: () => void;

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
  searchPlaceholder = "Search records...",
  searchFields = [],
  selectable = false,
  showColumnsButton = true,
  showExportButton = true,
  onExport,
  toolbarActions,
  emptyMessage = "No data found matching your query.",
  pageSize = 6,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Column visibility state (default all visible)
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    columns.map((c) => String(c.key))
  );

  // Smart Sticky state: Instantly evaluate screen width on mount (false for mobile, true for desktop/tablet)
  const [isSticky, setIsSticky] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // Sorting state (filtered strictly to opt-in sortable columns)
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Dropdown toggles
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const columnsRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnsRef.current && !columnsRef.current.contains(event.target as Node)) {
        setIsColumnsOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Search Filtering
  const searchedData = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return data;
    return data.filter((row) =>
      searchFields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchFields, searchable, searchTerm]);

  // 2. Opt-in Sorting (supporting custom sortFn for dates, etc.)
  const sortedData = useMemo(() => {
    if (!sortConfig) return searchedData;
    const activeColumn = columns.find((c) => String(c.key) === sortConfig.key);

    return [...searchedData].sort((a, b) => {
      let comparison = 0;

      if (activeColumn?.sortFn) {
        comparison = activeColumn.sortFn(a, b);
      } else {
        const aVal = a[sortConfig.key as keyof T];
        const bVal = b[sortConfig.key as keyof T];

        if (aVal === bVal) comparison = 0;
        else if (aVal == null) comparison = 1;
        else if (bVal == null) comparison = -1;
        else comparison = aVal < bVal ? -1 : 1;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [searchedData, sortConfig, columns]);

  // 3. Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIdx, startIdx + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);

  const start = sortedData.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const end = Math.min(safeCurrentPage * pageSize, sortedData.length);

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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumnKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const activeColumns = useMemo(
    () => columns.filter((col) => visibleColumnKeys.includes(String(col.key))),
    [columns, visibleColumnKeys]
  );

  const sortableColumns = useMemo(
    () => columns.filter((col) => col.sortable),
    [columns]
  );

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm relative transition-all">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/20 rounded-t-xl">
          <h3 className="font-semibold tracking-tight text-base">{title}</h3>
          {selectedRows.length > 0 && (
            <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {selectedRows.length} row(s) selected
            </span>
          )}
        </div>
      )}

      {/* Toolbar */}
      {(searchable || toolbarActions || showColumnsButton || showExportButton) && (
<div className={`flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3.5 bg-background relative z-30 ${!title ? "rounded-t-xl" : ""}`}>          {searchable ? (
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            {toolbarActions}

            {/* Sort Dropdown */}
            {sortableColumns.length > 0 && (
              <div className="relative" ref={sortRef}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-9 shadow-sm"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                >
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  Sort
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
                {isSortOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 max-w-[calc(100vw-2rem)] rounded-lg border bg-popover p-1.5 shadow-xl z-50 text-popover-foreground animate-in fade-in-80">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">
                      Sort by column
                    </div>
                    {sortableColumns.map((col) => (
                      <button
                        key={String(col.key)}
                        onClick={() => {
                          setSortConfig((prev) => ({
                            key: String(col.key),
                            direction:
                              prev?.key === String(col.key) && prev.direction === "asc"
                                ? "desc"
                                : "asc",
                          }));
                          setIsSortOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors text-left"
                      >
                        <span>{col.header}</span>
                        {sortConfig?.key === String(col.key) && (
                          <span className="text-primary font-bold">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    ))}
                    {sortConfig && (
                      <button
                        onClick={() => {
                          setSortConfig(null);
                          setIsSortOpen(false);
                        }}
                        className="w-full mt-1 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10 text-center font-medium"
                      >
                        Clear Sort
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Columns & Sticky Toggle Dropdown */}
            {showColumnsButton && (
              <div className="relative" ref={columnsRef}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-9 shadow-sm"
                  onClick={() => setIsColumnsOpen((prev) => !prev)}
                >
                  Columns
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
                {isColumnsOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-lg border bg-popover p-2 shadow-xl z-50 text-popover-foreground animate-in fade-in-80">
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b mb-1">
                      Toggle Columns
                    </div>
                    {columns.map((col) => {
                      const isVisible = visibleColumnKeys.includes(String(col.key));
                      return (
                        <button
                          key={String(col.key)}
                          onClick={() => toggleColumnVisibility(String(col.key))}
                          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors text-left"
                        >
                          <span>{col.header}</span>
                          {isVisible && <Check className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      );
                    })}

                    <div className="border-t my-2 pt-1">
                      <button
                        onClick={() => setIsSticky((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs hover:bg-muted transition-colors text-left font-medium"
                      >
                        <span className="flex items-center gap-1.5">
                          <Pin className="h-3 w-3 text-muted-foreground" /> Sticky 1st Col
                        </span>
                        {isSticky && <Check className="h-3.5 w-3.5 text-primary" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {showExportButton && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-9 shadow-sm"
                onClick={onExport}
              >
                Export
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table with Smart Sticky First Column */}
      <div className="overflow-x-auto relative">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b bg-muted/40 text-muted-foreground">
            <tr>
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-input accent-primary cursor-pointer"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((row) => selectedRows.includes(rowKey(row)))
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}

              {activeColumns.map((column, index) => {
                const isFirst = index === 0 && !selectable;
                const shouldStick = isFirst && isSticky;
                return (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                      shouldStick
                        ? "sticky left-0 z-20 bg-muted/95 backdrop-blur-md shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                        : ""
                    } ${column.headerClassName ?? ""}`}
                  >
                    {column.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedData.length ? (
              paginatedData.map((row) => {
                const id = rowKey(row);
                const isSelected = selectedRows.includes(id);
                return (
                  <tr
                    key={id}
                    className={`transition-colors hover:bg-muted/40 ${
                      isSelected ? "bg-muted/60" : ""
                    }`}
                  >
                    {selectable && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-input accent-primary cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}

                    {activeColumns.map((column, index) => {
                      const isFirst = index === 0 && !selectable;
                      const shouldStick = isFirst && isSticky;
                      return (
                        <td
                          key={String(column.key)}
                          className={`px-6 py-4 whitespace-nowrap ${
                            shouldStick
                              ? `sticky left-0 z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] ${
                                  isSelected ? "bg-muted/60" : ""
                                }`
                              : ""
                          } ${column.className ?? ""}`}
                        >
                          {column.render
                            ? column.render(row)
                            : String(row[column.key as keyof T] ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={activeColumns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-muted-foreground text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination Controls */}
      <div className="flex items-center justify-between border-t px-6 py-3.5 bg-muted/10 text-xs text-muted-foreground rounded-b-xl">
        <span className="font-medium">
          Showing <strong className="text-foreground">{start}</strong> to{" "}
          <strong className="text-foreground">{end}</strong> of{" "}
          <strong className="text-foreground">{sortedData.length}</strong> entries
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs shadow-sm"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          >
            Previous
          </Button>

          <span className="px-2 font-medium text-foreground">
            Page {safeCurrentPage} of {totalPages || 1}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs shadow-sm"
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