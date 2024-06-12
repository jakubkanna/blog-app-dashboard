import React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
} from "@tanstack/react-table";
import { useEvents, Event } from "../hooks/useEvents";
import Table from "../components/reactTable/Table";
import Pagination from "../components/reactTable/Pagination";
import CellDate from "../components/reactTable/CellDate";
import { useSkipper } from "../hooks/useSkipper.ts";
import CellDefault from "../components/reactTable/CellDefault.tsx";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateEvents: (rowIndex: string, columnId: string, value: unknown) => void;
  }
}

const defaultColumn: Partial<ColumnDef<Event>> = {
  cell: ({ getValue, row, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = React.useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateEvents(row.original.id, id, value);
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

export default function Events() {
  const columns = React.useMemo<ColumnDef<Event>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        footer: (props) => props.column.id,
      },
      {
        header: "Start Date",
        accessorKey: "start_date",
        footer: (props) => props.column.id,
        cell: ({ getValue, row, column: { id }, table }) => (
          <CellDate
            value={getValue() as string}
            onBlur={(value) =>
              table.options.meta?.updateEvents(row.original.id, id, value)
            }
          />
        ),
      },
      {
        header: "End Date",
        accessorKey: "end_date",
        footer: (props) => props.column.id,
        cell: ({ getValue, row, column: { id }, table }) => (
          <CellDate
            value={getValue() as string}
            onBlur={(value) =>
              table.options.meta?.updateEvents(row.original.id, id, value)
            }
          />
        ),
      },
      {
        header: "Place",
        accessorKey: "place",
        footer: (props) => props.column.id,
      },
      {
        header: "Curators",
        accessorKey: "curators",
        footer: (props) => props.column.id,
      },
      {
        header: "Tags",
        accessorKey: "tags",
        footer: (props) => props.column.id,
      },
      {
        header: "Post",
        accessorKey: "post",
        footer: (props) => props.column.id,
      },
      {
        header: "External link",
        accessorKey: "external_url",
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

  const { events, loading, error, updateEvent } = useEvents();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: events,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    meta: {
      updateEvents: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        updateEvent(rowIndex, columnId, value);
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
