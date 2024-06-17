import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowEditStopReasons,
  GridEventListener,
  GridSlots,
  GridRowsProp,
  GridToolbarContainer,
  GridRowModel,
} from "@mui/x-data-grid";
import { useEvents, Event } from "../hooks/useEvents";
import { randomId } from "@mui/x-data-grid-generator";
import { Alert, AlertProps, Snackbar } from "@mui/material";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [{ id, name: "", age: "", isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add new
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const { events, updateEvent, createEvent, deleteEvent } = useEvents();
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  React.useMemo(() => {
    setRows(events);
  }, [events]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const result = window.confirm(
      `Are you sure you want to delete item: ID:${id} permanently?`
    );
    if (result) {
      setRows(rows.filter((row) => row.id !== id));
      deleteEvent(id);
      setSnackbar({
        children: "Event successfully deleted",
        severity: "success",
      });
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    if (newRow.isNew) {
      try {
        const createdEvent = await createEvent(newRow as Event);

        setSnackbar({
          children: "Event list successfully created",
          severity: "success",
        });

        setRows((rows) =>
          rows.map((row) => (row.id === newRow.id ? createdEvent : row))
        );

        return createdEvent;
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      try {
        const updatedEvent = await updateEvent(newRow as Event);

        setSnackbar({
          children: "Event successfully updated",
          severity: "success",
        });
        const updatedRow = { ...newRow, isNew: false };

        console.log(updatedEvent);
        setRows((rows) =>
          rows.map((row) => (row.id === updatedEvent.id ? updatedRow : row))
        );
        return updatedRow;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Title",
      width: 180,
      flex: 1,
      editable: true,
    },
    {
      field: "description",
      flex: 1,

      headerName: "Description",
      editable: true,
    },
    {
      field: "start_date",
      flex: 1,
      headerName: "Start Date",
      type: "date",
      editable: true,
    },
    {
      field: "end_date",
      flex: 1,
      headerName: "End Date",
      type: "date",
      editable: true,
    },
    { field: "venue", headerName: "Venue", flex: 1, editable: true },
    { field: "address", headerName: "Address", flex: 1, editable: true },
    { field: "curators", headerName: "Curators", flex: 1, editable: true },
    { field: "tags", headerName: "Tags", flex: 1, editable: true },
    {
      field: "external_url",
      headerName: "External URL",
      flex: 1,

      editable: true,
      renderCell: (params) => (
        <a
          href={params.value as string}
          target="_blank"
          rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: "post",
      headerName: "Post URL",
      flex: 1,

      editable: true,
      renderCell: (params) => (
        <a
          href={params.value as string}
          target="_blank"
          rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: "public", headerName: "Public", flex: 1, editable: true },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: "600px", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: EditToolbar as GridSlots["toolbar"] }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
      />
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  );
}
