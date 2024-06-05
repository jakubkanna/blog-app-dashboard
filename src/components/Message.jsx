import { Link } from "react-router-dom";
import "../styles/Message.scss";

const Message = ({ message, type, url }) => {
  return (
    message && (
      <div className={`message ${type}`}>
        {url ? <Link to={url}>{message}</Link> : { message }}
      </div>
    )
  );
};

export default Message;
