import { useWorks } from "../hooks/useWorks";
import CRUDTable from "../components/CRUDTable";
import { useEvents } from "../hooks/useEvents";

function Works() {
  const { data: events } = useEvents();

  const eventOptions = [
    { value: "", label: "-" },
    ...events.map((event) => ({
      value: event.id,
      label: event.title,
    })),
  ];
  const workColumns = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    { field: "medium", headerName: "Medium", flex: 1, editable: true },
    { field: "year", headerName: "Year", flex: 1, editable: true },
    { field: "images", headerName: "Images", flex: 1, editable: true },
    {
      field: "events",
      headerName: "Events",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: eventOptions,
      valueField: "value",
      displayField: "label",
      renderCell: (params) => {
        const selectedEvent = eventOptions.find(
          (option) => option.value === params.value[0]
        );
        return selectedEvent?.label || "";
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

  return <CRUDTable columns={workColumns} useDataHook={useWorks} />;
}

export default Works;
