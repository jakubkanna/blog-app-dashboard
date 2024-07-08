import React, { useState } from "react";
import MuiTable from "../components/MuiTable";
import { useWorksContext } from "../contexts/pagesContexts/WorksContext";
import { Button } from "@mui/material";
import { GridColDef, useGridApiContext } from "@mui/x-data-grid";
import { Event, Option } from "../../types";
import MuiTableCellModal from "../components/MuiTableCellModal";
import AutoCompleteField from "../components/AutoCompleteField";

export default function Works() {
  const [editing, setEditing] = useState<{
    id: string;
    field: string;
    row: any;
  } | null>(null);

  const [modalBody, setModalBody] = useState<React.ReactNode>(null);

  const fetchEvents = async (): Promise<Option[]> => {
    try {
      const response = await fetch("http://localhost:3000/api/events/");
      const data = await response.json();
      return data.map((event: Event) => ({
        label: event.title,
        value: event,
      }));
    } catch (error) {
      console.error("Failed to fetch options:", error);
      return [];
    }
  };

  const ModalCell = ({ params }: { params: any }) => {
    const id = params.id;
    const field = params.field;
    const apiRef = useGridApiContext();

    const handleCellChange = (value: Option | Option[] | undefined) => {
      const retrivedValue = Array.isArray(value)
        ? value.map((item) => item.value)
        : [value?.value];

      console.log("retrivedValue", retrivedValue);

      apiRef.current.setEditCellValue({
        id: id,
        field: field,
        value: retrivedValue,
      });
    };

    const handleEditClick = () => {
      switch (field) {
        case "events":
          setModalBody(
            <AutoCompleteField
              fetchOptions={fetchEvents}
              initVal={params.row.events.map((event: Event) => ({
                label: event.title,
                value: event,
              }))}
              id={"events"}
              label={"Events"}
              multiple={true}
              onBlur={(value) => handleCellChange(value)}
            />
          );
          break;
        default:
          setModalBody(null);
          break;
      }
      setEditing(params);
    };

    return (
      <Button variant="contained" size="small" onClick={handleEditClick}>
        Edit
      </Button>
    );
  };

  const handleClose = () => setEditing(null);

  const workColumns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    { field: "medium", headerName: "Medium", flex: 1, editable: true },
    { field: "year", headerName: "Year", flex: 1, editable: true },
    {
      field: "images",
      headerName: "Images",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => <ModalCell params={params} />,
    },
    { field: "tags", headerName: "Tags", flex: 1, editable: true },
    {
      field: "events",
      headerName: "Events",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => <ModalCell params={params} />,
      renderCell: (params) => (
        <span>
          {params.row.events.map((event: Event, index: number) => (
            <React.Fragment key={event.id}>
              {event.title}
              {index < params.row.events.length - 1 && ", "}
            </React.Fragment>
          ))}
        </span>
      ),
    },
    {
      field: "public",
      headerName: "Public",
      flex: 1,
      editable: true,
      type: "boolean",
    },
  ];

  return (
    <>
      <MuiTable columns={workColumns} context={useWorksContext} />
      <MuiTableCellModal
        open={!!editing}
        title={editing?.field}
        onClose={handleClose}>
        {modalBody}
      </MuiTableCellModal>
    </>
  );
}
