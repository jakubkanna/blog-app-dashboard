import createGenericContext from "../../utils/createGenericContext";
import { Post } from "../../../types";

const postUrls = {
  fetchUrl: "http://localhost:3000/api/posts/",
  createUrl: "http://localhost:3000/api/posts/create",
  updateUrl: "http://localhost:3000/api/posts/update",
  deleteUrl: "http://localhost:3000/api/posts/delete",
};

const { useGenericContext: usePostsContext, Provider: PostsProvider } =
  createGenericContext<Post>(
    postUrls.fetchUrl,
    postUrls.createUrl,
    postUrls.updateUrl,
    postUrls.deleteUrl
  );

export { usePostsContext, PostsProvider };
