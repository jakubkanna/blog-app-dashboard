import { Link } from "react-router-dom";
import "../styles/Message.scss";
import { useState } from "react";

const Message = ({ message, type, url }) => {
  const [shown, setShown] = useState(true);

  return (
    shown && (
      <div className={`message ${type}`} onClick={() => setShown(false)}>
        {url ? <Link to={url}>{message}</Link> : { message }}
      </div>
    )
  );
};

export default Message;
