import React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
} from "@tanstack/react-table";
import { useWorks, Work } from "../hooks/useWorks"; // Assuming you create this hook similar to useEvents
import Table from "../components/reactTable/Table";
import Pagination from "../components/reactTable/Pagination";
import { useSkipper } from "../hooks/useSkipper.ts";
import CellDefault from "../components/reactTable/CellDefault.tsx";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateWorks: (rowIndex: string, columnId: string, value: unknown) => void;
  }
}

const defaultColumn: Partial<ColumnDef<Work>> = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateWorks(row.original.id, id, value);
    };

    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <CellDefault
        value={value as string}
        onChange={(newValue) => setValue(newValue)}
        onBlur={onBlur}
      />
    );
  },
};

export default function Works() {
  const columns = React.useMemo<ColumnDef<Work>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        footer: (props) => props.column.id,
      },
      {
        header: "Medium",
        accessorKey: "medium",
        footer: (props) => props.column.id,
      },
      {
        header: "Year",
        accessorKey: "year",
        footer: (props) => props.column.id,
      },
      {
        header: "Images",
        accessorKey: "images",
        footer: (props) => props.column.id,
      },
      {
        header: "Events",
        accessorKey: "events",
        footer: (props) => props.column.id,
      },
      {
        header: "Actions",
        cell: () => (
          <>
            <span>b1</span> <span>b2</span>
          </>
        ),
      },
    ],
    []
  );

  const { works, loading, error, updateWork } = useWorks();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: works,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    meta: {
      updateWorks: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        updateWork(rowIndex, columnId, value);
      },
    },
    debugTable: true,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Table table={table} />
      <Pagination table={table} />
    </div>
  );
}
