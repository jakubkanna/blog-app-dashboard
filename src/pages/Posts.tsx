// components/Posts.tsx
import React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
} from "@tanstack/react-table";
import { usePosts, Post } from "../hooks/usePosts";
import Table from "../components/reactTable/Table";
import Pagination from "../components/reactTable/Pagination";
import CellBolean from "../components/reactTable/CellBolean";
import CellDate from "../components/reactTable/CellDate";
import { useSkipper } from "../hooks/useSkipper";
import CellDefault from "../components/reactTable/CellDefault";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updatePosts: (rowIndex: string, columnId: string, value: unknown) => void;
  }
}

const defaultColumn: Partial<ColumnDef<Post>> = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updatePosts(row.original.id, id, value);
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

export default function Posts() {
  const columns = React.useMemo<ColumnDef<Post>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        footer: (props) => props.column.id,
      },
      {
        header: "Timestamp",
        accessorKey: "timestamp",
        footer: (props) => props.column.id,
        cell: ({ getValue, row, column: { id }, table }) => (
          <CellDate
            value={getValue() as string}
            onBlur={(value) =>
              table.options.meta?.updatePosts(row.original.id, id, value)
            }
          />
        ),
      },
      {
        header: "Public",
        accessorKey: "public",
        footer: (props) => props.column.id,
        cell: ({ getValue, row, column: { id }, table }) => (
          <CellBolean
            value={getValue() as boolean}
            onBlur={(value) =>
              table.options.meta?.updatePosts(row.original.id, id, value)
            }
          />
        ),
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

  const { posts, loading, error, updatePost } = usePosts();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: posts,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    meta: {
      updatePosts: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        updatePost(rowIndex, columnId, value);
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
