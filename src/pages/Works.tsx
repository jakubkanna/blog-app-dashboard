import React, { useState } from "react";
import MuiTable from "../components/MuiTable";
import { useWorksContext } from "../contexts/pagesContexts/WorksContext";
import { Button } from "@mui/material";
import { GridColDef, useGridApiContext } from "@mui/x-data-grid";
import { Event, ImageInstance, Option } from "../../types";
import MuiTableCellModal from "../components/MuiTableCellModal";
import InputAutocompleteField from "../components/InputAutoCompleteField";
import ImagesSelectionPaper from "../components/images/ImagesSelectionField";
import { useFetchTags } from "../utils/useFetch";

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

      apiRef.current.setEditCellValue({
        id: id,
        field: field,
        value: retrivedValue,
      });
    };

    const handleImagesChange = (images: ImageInstance[]) => {
      apiRef.current.setEditCellValue({
        id: id,
        field: field,
        value: images,
      });
    };

    const handleEditClick = () => {
      switch (field) {
        case "events":
          setModalBody(
            <InputAutocompleteField
              fetchOptions={fetchEvents}
              initVal={params.row.events.map((event: Event) => ({
                label: event.title,
                value: event,
              }))}
              id={"events"}
              label={"Events"}
              multiple={true}
              onChange={(value) => handleCellChange(value)}
            />
          );
          break;
        case "tags":
          setModalBody(
            <InputAutocompleteField
              fetchOptions={useFetchTags}
              initVal={params.row.tags.map((tag: string) => ({
                label: tag,
                value: tag,
              }))}
              id={"tags"}
              label={"Tags"}
              onChange={(value) => handleCellChange(value)}
              multiple
              freeSolo
            />
          );
          break;
        case "images":
          setModalBody(
            <ImagesSelectionPaper
              initVal={params.row.images}
              onChange={(value) => handleImagesChange(value)}
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
    {
      field: "year",
      headerName: "Year",
      editable: true,
      type: "number",
      valueFormatter: (value) => value && value,
    },
    {
      field: "images",
      headerName: "Images",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => <ModalCell params={params} />,
      valueFormatter: (value: []) => {
        const imageCount = value && value.length;
        if (imageCount) return `${imageCount} images selected`;
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => <ModalCell params={params} />,
      valueFormatter: (value: []) => {
        return value && value.map((tag: string) => tag).join(", ");
      },
    },
    {
      field: "events",
      headerName: "Events",
      flex: 1,
      editable: true,
      renderEditCell: (params: any) => <ModalCell params={params} />,
      valueFormatter: (value: any) => {
        return value && value.map((event: Event) => event.title).join(", ");
      },
    },
    {
      field: "public",
      headerName: "Public",
      editable: true,
      type: "boolean",
    },
  ];

  return (
    <>
      <MuiTable columns={workColumns} context={useWorksContext} />
      <MuiTableCellModal
        open={!!editing}
        title={editing?.row.title + " - " + editing?.field}
        onClose={handleClose}>
        {modalBody}
      </MuiTableCellModal>
    </>
  );
}
