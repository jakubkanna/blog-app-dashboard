import createGenericContext from "../../utils/createGenericContext";
import { Work } from "../../../types";

const workUrls = {
  fetchUrl: "http://localhost:3000/api/works/",
  createUrl: "http://localhost:3000/api/works/create",
  updateUrl: "http://localhost:3000/api/works/update",
  deleteUrl: "http://localhost:3000/api/works/delete",
};

const { useGenericContext: useWorksContext, Provider: WorksProvider } =
  createGenericContext<Work>(
    workUrls.fetchUrl,
    workUrls.createUrl,
    workUrls.updateUrl,
    workUrls.deleteUrl
  );

export { useWorksContext, WorksProvider };
