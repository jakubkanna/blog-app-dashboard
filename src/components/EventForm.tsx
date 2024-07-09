// public submit, selected images field click
import * as React from "react";
import {
  TextField,
  FormControlLabel,
  Grid,
  Typography,
  InputLabel,
  AlertProps,
  Snackbar,
  Alert,
  Switch,
} from "@mui/material";
import { Event, ImageInstance, Option } from "../../types";
import TextEditor from "./TextEditor";
import ImagesSelectionPaper from "./images/ImagesSelectionField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEventsContext } from "../contexts/pagesContexts/EventsContext";
import _ from "lodash";
import { Form, useNavigate, useParams } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAutocompleteField from "./InputAutoCompleteField";
import { Post } from "../contexts/pagesContexts/PostsContext";
import useFetchTags from "../hooks/useFetchTags";

export default function EventForm() {
  const [formData, setFormData] = React.useState<Event | null>(null);
  const { updateData } = useEventsContext();
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  let { id: eventId } = useParams();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // Fetchers

  React.useEffect(() => {
    // Fetch formData
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/events/${eventId}`
        );
        const data = await response.json();
        if (response.ok) {
          setFormData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        return [];
      }
    })();
  }, []);

  //async

  const fetchPosts = async (): Promise<Option[]> => {
    try {
      const response = await fetch("http://localhost:3000/api/posts/");
      const data = await response.json();
      return data.map((post: Post) => ({
        label: post.title,
        value: post._id,
      }));
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return [];
    }
  };

  // Handlers

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    updateData(formData)
      .then(() => {
        setSnackbar({
          children: "Event successfully updated",
          severity: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Update error:", error);
        setSnackbar({
          children: "Event update error",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const handleCancel = () => {
    navigate("/admin/events");
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlePostsChange = (value: Option | Option[]) => {
    const retrivedValue = Array.isArray(value)
      ? value.map((item) => item.value)
      : value.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      post: retrivedValue,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: checked };
    });
  };

  const handleTagsChange = (value: Option | Option[]) => {
    const retrivedValue = Array.isArray(value)
      ? value.map((item) => item.value)
      : [];

    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: retrivedValue,
    }));
  };

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      start_date: date ? date.toDate() : undefined,
    }));
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      end_date: date ? date.toDate() : undefined,
    }));
  };

  const handleImagesChange = (value: ImageInstance[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: value,
    }));
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  // Render

  return (
    formData && (
      <Form onSubmit={handleSubmit}>
        <Typography variant="h2" gutterBottom>
          Editing: <em>{formData.title}</em>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h6" gutterBottom>
              General Information
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="subtitle" shrink>
                  Subtitle
                </InputLabel>
                <TextEditor
                  id="subtitle"
                  initVal={formData.subtitle}
                  onBlur={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="description" shrink>
                  Description
                </InputLabel>
                <TextEditor
                  id="description"
                  initVal={formData.description}
                  onBlur={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <ImagesSelectionPaper
                  initVal={formData.images || []}
                  onChange={handleImagesChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <DatePicker
                    label="Start Date"
                    name="start_date"
                    value={
                      formData.start_date ? dayjs(formData.start_date) : null
                    }
                    onChange={handleStartDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    label="End Date"
                    name="end_date"
                    value={formData.end_date ? dayjs(formData.end_date) : null}
                    onChange={handleEndDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Venue"
                    name="venue"
                    defaultValue={formData.venue}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TextField
                  label="External URL"
                  name="external_url"
                  defaultValue={formData.external_url}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <InputAutocompleteField
                  fetchOptions={fetchPosts}
                  initVal={
                    {
                      label: formData.post?.title,
                      value: formData.post?._id,
                    } || { label: "", value: "" }
                  }
                  id={"posts"}
                  label={"Posts"}
                  onChange={handlePostsChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputAutocompleteField
                  fetchOptions={useFetchTags}
                  initVal={
                    formData.tags?.map((tag: string) => ({
                      label: tag,
                      value: tag,
                    })) || []
                  }
                  id={"tags"}
                  label={"Tags"}
                  onChange={(value) => handleTagsChange(value)}
                  multiple
                  freeSolo
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.public}
                      onChange={handleCheckboxChange}
                      name="public"
                    />
                  }
                  label="Public"
                />
                <Grid
                  item
                  xs={12}
                  sx={{
                    position: "fixed",
                    right: 0,
                    bottom: 0,
                    margin: "1rem",
                  }}>
                  <LoadingButton
                    loading={loading}
                    type="submit"
                    variant="contained"
                    size="large">
                    Save
                  </LoadingButton>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={handleCancel}>
                    Cancel
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {!!snackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}>
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </Form>
    )
  );
}
