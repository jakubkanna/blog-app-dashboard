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
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Event, ImageInstance } from "../../types";
import CustomEditor from "./CustomEditor";
import ImageSelectionPaper from "./ImageSelectionPaper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface Option {
  value: string;
  label: string;
}

export default function EventForm() {
  const location = useLocation();
  const [posts, setPosts] = React.useState<Option[]>([]);
  const [tags, setTags] = React.useState<Option[]>([]);
  const [selectedImgList, setSelectedImgList] = React.useState<ImageInstance[]>(
    []
  );
  const [imgList, setImgList] = React.useState<ImageInstance[]>([]);
  const [formData, setFormData] = React.useState<Event | null>(null);

  //fetch data

  React.useEffect(() => {
    //get all images
    fetch("http://localhost:3000/api/images")
      .then((response) => response.json())
      .then((data: ImageInstance[]) => {
        if (data.length > 0) setImgList(data);
      })
      .catch((error) => console.error("Failed to fetch images", error));
    //get all posts
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
    //get all tags
    fetch("http://localhost:3000/api/tags/")
      .then((response) => response.json())
      .then((tagsData) =>
        setTags(tagsData.map((tag: string) => ({ label: tag, value: tag })))
      )
      .catch((error) => console.error("Failed to fetch tags:", error));
  }, []);

  React.useEffect(() => {
    //get formData from location state
    const rowData = location.state?.rowData;
    if (rowData) {
      setFormData({ ...rowData });
      setSelectedImgList(rowData.images);
      //get this event images
      fetch(`http://localhost:3000/api/events/${rowData.id}/images`)
        .then((response) => response.json())
        .then((data: ImageInstance[]) => setSelectedImgList(data))
        .catch((error) => console.error("Failed to fetch event images", error));
    }
  }, [location.state]);

  // Handlers

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name as string]: value,
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

  React.useEffect(
    () => handleSubmit(),
    [handleTagsChange, handleCheckboxChange]
  );

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

  const handleSubmit = () => {
    console.log(formData);
  };

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
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleSubmit}
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
                  selectedImgList={selectedImgList}
                  setSelectedImgList={setSelectedImgList}
                  imgList={imgList}
                  setImgList={setImgList}
                  onBlur={handleSubmit}
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
                    value={formData.venue}
                    onChange={handleChange}
                    onBlur={handleSubmit}
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
                  onBlur={handleSubmit}
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
                  value={formData.external_url}
                  onChange={handleChange}
                  onBlur={handleSubmit}
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
                    value={formData.post}
                    label="Post"
                    onBlur={handleSubmit}
                    onChange={handleChange}>
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
      </form>
    )
  );
}
