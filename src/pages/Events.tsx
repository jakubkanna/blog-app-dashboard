import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import CRUDTable from "../components/CRUDTable";
import { usePosts } from "../hooks/usePosts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";

function Events() {
  const { data: posts } = usePosts();
  const [errorMessage, setErrorMessage] = useState("");
  const [openEditor, setOpenEditor] = useState(false);
  const [editingField, setEditingField] = useState("");
  const [editedValue, setEditedValue] = useState("");

  const postOptions = [
    { title: "-", id: "" },
    ...posts.map((post) => ({
      title: post.title,
      id: post.id,
    })),
  ];

  const handleOpenEditor = (field, value) => {
    setEditingField(field);
    setEditedValue(value);
    setOpenEditor(true);
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
  };

  const handleEditorChange = (content, editor) => {
    setEditedValue(content);
  };

  const handleSaveChanges = () => {
    handleCloseEditor();
  };

  const eventColumns = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    { field: "subtitle", headerName: "Subtitle", flex: 1, editable: true },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        const isoDate = new Date(value); // Convert ISO string to Date object
        const formattedDate = isoDate.toLocaleDateString(); // Format as JS date format
        return formattedDate;
      },
    },
    {
      field: "end_date",
      headerName: "End Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        const isoDate = new Date(value); // Convert ISO string to Date object
        const formattedDate = isoDate.toLocaleDateString(); // Format as JS date format
        return formattedDate;
      },
      preProcessEditCellProps: (params) => {
        const startDateValue = params.row.start_date;
        const startDate = new Date(startDateValue);
        const endDate = new Date(params.props.value as string);

        const hasError = isNaN(startDate.getTime()) || endDate < startDate;

        if (hasError) {
          setErrorMessage("End date must be after start date.");
        } else {
          setErrorMessage("");
        }

        return {
          ...params.props,
          error: hasError,
        };
      },
    },
    { field: "venue", headerName: "Venue", flex: 1, editable: true },
    {
      field: "images",
      headerName: "Images",
      flex: 1,
      editable: true,
      cellEditorParams: {
        separator: ",",
      },
      valueFormatter: (value) => {
        if (Array.isArray(value)) {
          return value.join(", ");
        }
        return value;
      },
      valueParser: (value) => {
        if (typeof value === "string") {
          return value.split(",").map((tag) => tag.trim().toLowerCase());
        }
        return value;
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      editable: true,
      cellEditorParams: {
        separator: ",",
      },
      valueFormatter: (value) => {
        if (Array.isArray(value)) {
          return value.join(", ");
        }
        return value;
      },
      valueParser: (value) => {
        if (typeof value === "string") {
          return value.split(",").map((tag) => tag.trim().toLowerCase());
        }
        return value;
      },
    },
    {
      field: "external_url",
      headerName: "Ext. Link",
      flex: 1,
      editable: true,
    },
    {
      field: "post",
      headerName: "Post",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: postOptions,
      getOptionValue: (value) => value.id,
      getOptionLabel: (value) => value.title,
      valueGetter: (value) => {
        if (!value) {
          // If no value is selected, return the first option
          return postOptions.length > 0 ? postOptions[0].id : "";
        }
        return value;
      },
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
    <div>
      {errorMessage && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
      )}
      <CRUDTable columns={eventColumns} useDataHook={useEvents} />

      <Dialog
        open={openEditor}
        onClose={handleCloseEditor}
        fullWidth
        maxWidth="md">
        <DialogTitle>Edit {editingField}</DialogTitle>
        <DialogContent>
          <Editor
            apiKey="YOUR_API_KEY"
            initialValue={editedValue}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={handleEditorChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditor}>Cancel</Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Events;
