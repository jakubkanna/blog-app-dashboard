import PropTypes from "prop-types";
import "../styles/Status.scss"; // Import the CSS file for styling

const Status = ({ isPublic }) => {
  return (
    <span className={"post-status " + (isPublic ? "published" : "unpublished")}>
      {isPublic ? "Published" : "Unpublished"}
    </span>
  );
};

Status.propTypes = {
  isPublic: PropTypes.bool.isRequired,
};

export default Status;
