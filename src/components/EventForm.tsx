import * as React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  AlertProps,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Event, ImageInstance } from "../../types";
import CustomEditor from "./CustomEditor";
import ImageSelectionPaper from "./ImageSelectionPaper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEventsContext } from "../contexts/pagesContexts/EventsContext";
import _ from "lodash";

interface Option {
  value: string;
  label: string;
}

export default function EventForm() {
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();
  const [posts, setPosts] = React.useState<Option[]>([]);
  const [tags, setTags] = React.useState<Option[]>([]);
  const [formData, setFormData] = React.useState<Event | null>(null);
  const [initImgs, setInitImgs] = React.useState<ImageInstance[]>([]);
  const { updateData } = useEventsContext();
  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  // Fetching images and posts moved to respective components

  React.useEffect(() => {
    // Fetch posts
    fetch("http://localhost:3000/api/posts/")
      .then((response) => response.json())
      .then((postsData) => {
        const formattedPosts = postsData.map(
          (post: { title: string; _id: string }) => ({
            label: post.title,
            value: post._id,
          })
        );
        setPosts([{ label: "-", value: "" }, ...formattedPosts]);
      })
      .catch((error) => console.error("Failed to fetch posts:", error));
    // Fetch tags
    fetch("http://localhost:3000/api/tags/")
      .then((response) => response.json())
      .then((tagsData) =>
        setTags(tagsData.map((tag: string) => ({ label: tag, value: tag })))
      )
      .catch((error) => console.error("Failed to fetch tags:", error));
  }, []);

  React.useEffect(() => {
    // Fetch formData from location state
    const rowData = location.state.rowData;
    if (rowData) {
      setFormData({ ...rowData });
      setLoading(false);
      // Fetch event images
      fetch(`http://localhost:3000/api/events/${rowData.id}/images`)
        .then((response) => response.json())
        .then((data: ImageInstance[]) => data.length && setInitImgs(data))
        .catch((error) => console.error("Failed to fetch event images", error));
    }
  }, [location.state]);

  // Handlers

  const handleSubmit = () => {
    updateData(formData)
      .then(() => {
        setSnackbar({
          children: "Event successfully updated",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error("Update error:", error);
        setSnackbar({
          children: "Event update error",
          severity: "error",
        });
      });
  };

  React.useEffect(() => {
    const rowData = location.state?.rowData;
    if (!loading && formData && !_.isEqual(formData, rowData)) handleSubmit();
  }, [formData]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handleTagsChange = (_event: React.SyntheticEvent, value: Option[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: value.map((tag) => tag.value),
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
      images: value.map((img) => img._id),
    }));
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  // Render

  return (
    formData && (
      <form>
        <Typography variant="h2" gutterBottom>
          Editing <em>{formData.title}</em>
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
                  defaultValue={formData.title}
                  onBlur={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="subtitle" shrink>
                  Subtitle
                </InputLabel>
                <CustomEditor
                  id="subtitle"
                  initialValue={formData.subtitle}
                  onBlur={handleSubmit}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="description" shrink>
                  Description
                </InputLabel>
                <CustomEditor
                  id="description"
                  initialValue={formData.description}
                  onBlur={handleSubmit}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <ImageSelectionPaper
                  initVal={initImgs}
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
                    onBlur={handleInputChange}
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
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={tags}
                  getOptionLabel={(option) => option.label}
                  value={tags.filter(
                    (tag) => formData.tags && formData.tags.includes(tag.value)
                  )}
                  onChange={handleTagsChange}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Select tags..."
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="External URL"
                  name="external_url"
                  defaultValue={formData.external_url}
                  onBlur={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="simple-select-label">Post</InputLabel>
                  <Select
                    labelId="simple-select-label"
                    id="simple-select"
                    name="post"
                    label="Post"
                    value={formData.post ?? ""}
                    onChange={handleInputChange}>
                    {posts.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.public}
                      onChange={handleCheckboxChange}
                      name="public"
                    />
                  }
                  label="Public"
                />
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
      </form>
    )
  );
}
