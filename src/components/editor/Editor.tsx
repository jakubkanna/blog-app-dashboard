import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertProps,
  FormControlLabel,
  InputLabel,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Grid";
import InputAutocompleteField from "../InputAutoCompleteField";
import { useFetchTags } from "../../utils/useFetch";
import EditorBlocks from "./EditorBlocks";
import { usePostsContext } from "../../contexts/pagesContexts/PostsContext";
import { Box } from "@mui/material";
import { Block, Post } from "../../../types";
import EditorMenu from "./EditorMenu";
import useUnsavedChangesTracker from "../../utils/useUnsavedChangesTracker";

export default function Editor() {
  // Init
  const { id } = useParams<{ id?: string }>();
  const { data, updateData, loading } = usePostsContext();
  const init = data.find((item) => item._id === id);

  const navigate = useNavigate();
  const { setUnsavedChanges, removeUnsavedChanges } =
    useUnsavedChangesTracker();

  useEffect(setUnsavedChanges, []);

  //states

  const [snackbar, setSnackbar] = React.useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const [post, setPost] = useState<Post | undefined>(init);

  //handlers

  const handleCloseSnackbar = () => setSnackbar(null);

  const setBlocks = (value: Block[]) => {
    setPost((prevPost: Post) => ({
      ...prevPost,
      content: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateData(post)
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
    navigate("/admin/posts/");
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setPost((prevPost: Post) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  return (
    post && (
      <Box component="form" className="post-editor" onSubmit={handleSubmit}>
        <Typography variant="h2" gutterBottom>
          Editing: <em>{post.title}</em>
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
                value={post.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            <Grid item className="post-editor-body">
              <EditorBlocks blocks={post.content} setBlocks={setBlocks} />
              <EditorMenu blocks={post.content} setBlocks={setBlocks} />
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
                value={post.slug}
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
                  post.tags?.map((tag: string) => ({
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
                control={<Switch checked={post.public} name="public" />}
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
