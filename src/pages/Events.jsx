import { useState } from "react";
import CRUDTable from "../components/CRUDTable";
import { usePosts } from "../hooks/usePosts";
import { Button } from "@mui/material";
import EditorModal from "../components/editor/EditorModal.jsx";
import { useEventsContext } from "../contexts/EventsContext"; // Import context hook

export default function Events() {
  const { data: posts } = usePosts();
  const { updateData } = useEventsContext();
  const [errorMessage, setErrorMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [params, setParams] = useState(null);
  const [initVal, setInitVal] = useState("");

  const postOptions = [
    { title: "-", id: "" },
    ...posts.map((post) => ({
      title: post.title,
      id: post.id,
    })),
  ];

  const openModal = (params) => {
    setParams(params);
    setInitVal(params.value);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleEditorSubmit = async (newContent) => {
    const newRow = { ...params.row };
    newRow[params.field] = newContent;
    await updateData(newRow);
  };

  const modalCell = (params) => {
    return (
      <Button
        variant="contained"
        size="small"
        onClick={() => openModal(params)}>
        Edit
      </Button>
    );
  };

  const eventColumns = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    {
      field: "subtitle",
      headerName: "Subtitle",
      flex: 1,
      editable: true,
      renderEditCell: (params) => modalCell(params),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      editable: true,
      renderEditCell: (params) => modalCell(params),
    },
    {
      field: "start_date",
      headerName: "Start Date",
      type: "date",
      flex: 1,
      editable: true,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        const isoDate = new Date(value);
        const formattedDate = isoDate.toLocaleDateString();
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
        const isoDate = new Date(value);
        const formattedDate = isoDate.toLocaleDateString();
        return formattedDate;
      },
      preProcessEditCellProps: (params) => {
        const startDateValue = params.row.start_date;
        const startDate = new Date(startDateValue);
        const endDate = new Date(params.props.value);

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
      <CRUDTable columns={eventColumns} context={useEventsContext} />

      <EditorModal
        key={params?.id}
        title={params?.field}
        open={modalOpen}
        handleClose={handleModalClose}
        initialValue={initVal}
        onSubmit={handleEditorSubmit}
      />
    </div>
  );
}
