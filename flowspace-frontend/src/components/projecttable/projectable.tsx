
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

import { useState } from "react";

interface Project {
  id: number;
  name: string;
  description: string | null;
}

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable = ({ projects }: ProjectTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-400">
          #{String(row.original.id).padStart(3, "0")}
        </span>
      ),
    },

    {
      accessorKey: "name",
      header: "Project",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
            {row.original.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">
              {row.original.name}
            </p>

            <p className="text-xs text-slate-400">
              Project
            </p>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <p className="max-w-md truncate text-sm text-slate-500">
          {row.original.description || "No description provided"}
        </p>
      ),
    },

    {
      id: "status",
      header: "Status",
      cell: () => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">

          {/* Edit */}
          <button
            onClick={() => console.log("Edit", row.original.id)}
            title="Edit project"
            className="group rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 3.487a2.1 2.1 0 013.051 2.9L8.9 17.4l-4.4 1.1 1.1-4.4 10.262-10.613z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.5 5l3.5 3.5"
              />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => console.log("Delete", row.original.id)}
            title="Delete project"
            className="group rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 11v6M14 11v6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 7l1 13h10l1-13"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7V4h6v3"
              />
            </svg>
          </button>

        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,

    state: {
      sorting,
      globalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    globalFilterFn: "includesString",

    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="bg-white">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            All Projects
          </h2>

          <p className="mt-0.5 text-sm text-slate-400">
            {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"} in total
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">

          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search projects..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[750px]">

          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-slate-100 bg-slate-50/70"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className={`flex items-center gap-1.5 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-slate-600"
                            : ""
                        }`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getCanSort() && (
                          <span className="text-slate-300">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted() as string] ?? "↕"}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100">

            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <svg
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                        />
                      </svg>
                    </div>

                    <p className="font-medium text-slate-600">
                      No projects found
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Try adjusting your search.
                    </p>

                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-medium text-slate-600">
            {table.getRowModel().rows.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-600">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          projects
        </p>

        <div className="flex items-center gap-2">

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <div className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600">
            {table.getState().pagination.pageIndex + 1}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProjectTable;
