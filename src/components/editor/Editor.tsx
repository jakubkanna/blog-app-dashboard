import "../../styles/Create.scss";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useContext, useState } from "react";
import {
  FormControlLabel,
  InputLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Grid";
import InputAutocompleteField from "../InputAutoCompleteField";
import useFetchTags from "../../hooks/useFetchTags";
import EditorContent from "./EditorContent";
import { EditorContext } from "../../contexts/EditorContext";

export default function Editor() {
  //states

  const {
    data: formData,
    setData: setFormData,
    loading,
  } = useContext(EditorContext);

  //handlers

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    localStorage.removeItem(storageKey);
    const navigate = useNavigate();
    navigate("/admin/posts");
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    formData && (
      <form className="post-editor" onSubmit={handleSubmit}>
        <Typography variant="h2" gutterBottom>
          Editing: <em>{formData.title}</em>
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography variant="h6" gutterBottom>
              Title
            </Typography>
            <Grid item className="post-editor-header">
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            <Grid item className="post-editor-body">
              <EditorContent initVal={formData.content} />
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Grid>
              <TextField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                fullWidth
              />
              <InputLabel>
                Final path: <Link to="#">Link</Link>
              </InputLabel>
            </Grid>
            <Grid>
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
                onChange={(value) => console.log(value)}
                multiple
                freeSolo
              />
              <FormControlLabel
                control={<Switch checked={formData.public} name="public" />}
                label="Public"
              />
            </Grid>
            <Grid
              item
              className="post-editor-footer"
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
                loading={loading}
                type="button"
                variant="contained"
                size="large"
                onClick={handleCancel}>
                Cancel
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </form>
    )
  );
}
