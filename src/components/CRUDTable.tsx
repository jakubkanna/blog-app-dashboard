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
import { randomId } from "@mui/x-data-grid-generator";
import { Alert, AlertProps, Snackbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname === "/admin/posts") {
      navigate(`create`);
    } else {
      const id = randomId();
      setRows((oldRows) => [{ id, isNew: true }, ...oldRows]);
      setRowModesModel((oldModel) => ({
        [id]: { mode: GridRowModes.Edit, fieldToFocus: "title" },
        ...oldModel,
      }));
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

interface CRUDTableProps {
  columns: GridColDef[];
  context: () => {
    data: any[];
    loading: Boolean;
    updateData: (data: any) => Promise<any>;
    createData: (data: any) => Promise<any>;
    deleteData: (id: GridRowId) => Promise<void>;
  };
}

export default function CRUDTable({ columns, context }: CRUDTableProps) {
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
    data && setRows(data);
  }, [data]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    if (location.pathname === "/admin/posts") {
      navigate(`update/${id}`);
    } else {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }
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
      deleteData(id);
      setSnackbar({
        children: "Item successfully deleted",
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
        const createdItem = await createData(newRow);

        setSnackbar({
          children: "Item successfully created",
          severity: "success",
        });

        setRows((rows) =>
          rows.map((row) => (row.id === newRow.id ? createdItem : row))
        );

        return createdItem;
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      try {
        // const updatedItem =
        await updateData(newRow);

        setSnackbar({
          children: "Item successfully updated",
          severity: "success",
        });
        const updatedRow = { ...newRow, isNew: false };

        // setRows((rows) =>
        //   rows.map((row) => (row.id === updatedItem.id ? updatedRow : row))
        // );
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

  const combinedColumns: GridColDef[] = [
    ...columns,
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
  ].filter(Boolean) as GridColDef[];

  return (
    <>
      <DataGrid
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
