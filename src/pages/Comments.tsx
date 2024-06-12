import React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
} from "@tanstack/react-table";
import { useComments, Comment } from "../hooks/useComments"; // Import the hook
import Table from "../components/reactTable/Table";
import Pagination from "../components/reactTable/Pagination";
import { useSkipper } from "../hooks/useSkipper";
import CellDefault from "../components/reactTable/CellDefault.tsx";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateComments: (
      rowIndex: string,
      columnId: string,
      value: unknown
    ) => void;
  }
}

const defaultColumn: Partial<ColumnDef<Comment>> = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateComments(row.original.id, id, value);
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

export default function Comments() {
  const columns = React.useMemo<ColumnDef<Comment>[]>(
    () => [
      // Define your columns
      {
        header: "Author",
        accessorKey: "author",
        footer: (props) => props.column.id,
      },
      {
        header: "Post Title",
        accessorKey: "post",
        footer: (props) => props.column.id,
      },

      {
        header: "Text",
        accessorKey: "text",
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const { comments, loading, error, updateComment } = useComments(); // Use the comments hook
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: comments,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    meta: {
      updateComments: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        updateComment(rowIndex, columnId, value);
      },
    },
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
