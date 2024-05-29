import PropTypes from "prop-types";
import "../styles/PostStatus.scss"; // Import the CSS file for styling

const PostStatus = ({ isPublic }) => {
  return (
    <div className="post-status">
      <p className={isPublic ? "published" : "unpublished"}>
        {isPublic ? "Published" : "Unpublished"}
      </p>
    </div>
  );
};

PostStatus.propTypes = {
  isPublic: PropTypes.bool.isRequired,
};

export default PostStatus;
