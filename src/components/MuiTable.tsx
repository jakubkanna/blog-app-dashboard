import * as React from "react";
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
import { Alert, AlertProps, Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { PageContextType } from "../../types";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

interface MuiTableProps {
  columns: GridColDef[];
  context: () => PageContextType<T>;
}

export default function MuiTable({ columns, context }: MuiTableProps) {
  const { data, updateData, createData, deleteData, loading } = context();
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useMemo(() => {
    setRows(data);
  }, [data]);

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = async () => {
      const newRow = { title: "Untitled" };
      try {
        const createdItem = await createData(newRow);
        const id = createdItem._id;
        setSnackbar({
          children: "Item successfully created",
          severity: "success",
        });

        setRows((oldRows) => [{ id, isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
          [id]: { mode: GridRowModes.Edit, fieldToFocus: "title" },
          ...oldModel,
        }));
        return createdItem;
      } catch (error) {
        console.error(error);
        setSnackbar({
          children: "An error occurred while creating a new item",
          severity: "error",
        });
      }
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add new
        </Button>
      </GridToolbarContainer>
    );
  }

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    switch (location.pathname) {
      case "/admin/posts":
        navigate(`update/${id}`);
        break;
      case "/admin/events":
        navigate(`update/${id}`);
        break;
      default:
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.Edit },
        });
        break;
    }
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    const result = window.confirm(
      `Are you sure you want to delete item: ID:${id} permanently?`
    );
    if (result) {
      try {
        const success = await deleteData(id as string); // cast id to string
        if (success) {
          setRows((rows) => rows.filter((row) => row.id !== id));
          setSnackbar({
            children: "Item successfully deleted",
            severity: "success",
          });
        } else {
          setSnackbar({
            children: "Failed to delete item",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Failed to delete item:", error);
        setSnackbar({
          children: "An error occurred while deleting the item",
          severity: "error",
        });
      }
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleProcessRowUpdate = async (newRow: GridRowModel) => {
    try {
      const updatedItem = await updateData(newRow);

      setSnackbar({
        children: "Item successfully updated",
        severity: "success",
      });

      setRows((rows) =>
        rows.map((row) => (row.id === newRow.id ? updatedItem : row))
      );
      return updatedItem;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleProcessRowUpdateError = React.useCallback(() => {
    setSnackbar({ children: "Error during update", severity: "error" });
  }, []);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const combinedColumns: GridColDef[] = [
    ...columns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: ({ id }: { id: GridRowId }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              key="save"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              key="cancel"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            key="edit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            key="delete"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <DataGrid
        getRowId={(row) => row._id}
        rows={rows}
        columns={combinedColumns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: EditToolbar as GridSlots["toolbar"] }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
        loading={loading}
        autoHeight
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
    </>
  );
}
