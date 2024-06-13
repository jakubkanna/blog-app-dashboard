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
import ButtonDelete from "../components/ButtonDelete";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updatePosts: (rowId: string, columnId: string, value: unknown) => void;
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
            cb={(value) =>
              table.options.meta?.updatePosts(row.original.id, id, value)
            }
          />
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div>
            <button>
              <Link to={`update/${row.original.id}`}>
                <Edit />
              </Link>
            </button>
            <ButtonDelete id={row.original.id} cb={deletePost} />
          </div>
        ),
      },
    ],
    []
  );

  const { posts, loading, error, updatePost, deletePost } = usePosts();
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
      updatePosts: (rowId, columnId, value) => {
        skipAutoResetPageIndex();
        updatePost(rowId, columnId, value);
      },
    },
    debugTable: true,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div>
        <Link to={"create"}>
          <button>Add new</button>
        </Link>
      </div>
      <div>
        <Table table={table} />
        <Pagination table={table} />
      </div>
    </>
  );
}
