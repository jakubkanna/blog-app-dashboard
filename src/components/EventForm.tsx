// public submit, selected images field click
import React, { useEffect, useState } from "react";

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
  Box,
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
import { Post } from "../../types";
import { useFetchTags } from "../utils/useFetch";
import useUnsavedChangesTracker from "../utils/useUnsavedChangesTracker";

export default function EventForm() {
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data, updateData, loading } = useEventsContext();
  const init = data.find((item) => item._id === id);

  const [event, setEvent] = useState<Event | undefined>(init);
  const { setUnsavedChanges, removeUnsavedChanges } =
    useUnsavedChangesTracker();

  useEffect(setUnsavedChanges, []);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateData(event)
      .then(() => {
        setSnackbar({
          children: "Event successfully updated",
          severity: "success",
        });
        removeUnsavedChanges();
      })
      .catch((error) => {
        console.error("Update error:", error);
        setSnackbar({
          children: "Event update error",
          severity: "error",
        });
      });
  };

  const handleCancel = () => {
    removeUnsavedChanges();
    navigate("/admin/events/");
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEvent((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const handlePostsChange = (value: Option | Option[]) => {
    const retrivedValue = Array.isArray(value)
      ? value.map((item) => item.value)
      : value.value;
    setEvent((prevdata) => ({
      ...prevdata,
      post: retrivedValue,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEvent((prevdata) => {
      return { ...prevdata, [name]: checked };
    });
  };

  const handleTagsChange = (value: Option | Option[]) => {
    const retrivedValue = Array.isArray(value)
      ? value.map((item) => item.value)
      : [];

    setEvent((prevdata) => ({
      ...prevdata,
      tags: retrivedValue,
    }));
  };

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setEvent((prevdata) => ({
      ...prevdata,
      start_date: date ? date.toDate() : undefined,
    }));
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setEvent((prevdata) => ({
      ...prevdata,
      end_date: date ? date.toDate() : undefined,
    }));
  };

  const handleImagesChange = (value: ImageInstance[]) => {
    setEvent((prevdata) => ({
      ...prevdata,
      images: value,
    }));
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  // Render

  return (
    event && (
      <Box component="form" className="event-editor" onSubmit={handleSubmit}>
        <Typography variant="h2" gutterBottom>
          Editing: <em>{event.title}</em>
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
                  value={event.title}
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
                  initVal={event.subtitle}
                  onBlur={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="description" shrink>
                  Description
                </InputLabel>
                <TextEditor
                  id="description"
                  initVal={event.description}
                  onBlur={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel shrink>Images</InputLabel>
                <ImagesSelectionPaper
                  initVal={event.images || []}
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
                    value={event.start_date ? dayjs(event.start_date) : null}
                    onChange={handleStartDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    label="End Date"
                    name="end_date"
                    value={event.end_date ? dayjs(event.end_date) : null}
                    onChange={handleEndDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Venue"
                    name="venue"
                    defaultValue={event.venue}
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
                  defaultValue={event.external_url}
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
                      label: event.post?.title,
                      value: event.post?._id,
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
                    event.tags?.map((tag: string) => ({
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
                      checked={event.public}
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
      </Box>
    )
  );
}
