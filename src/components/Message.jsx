import { Link } from "react-router-dom";
import "../styles/Message.scss";
import { useContext, useEffect } from "react";

const Message = ({ messageData, hideMessage }) => {
  const { data, url } = messageData || {};

  const message = data?.message;
  const response = data?.response;

  useEffect(() => {
    // Hide the response after 2 seconds if it's ok
    if (response && response.ok) {
      const timeout = setTimeout(() => {
        hideMessage();
      }, 3000);

      // Clear the timeout if the component unmounts or if a new response is shown
      return () => clearTimeout(timeout);
    }
  }, [hideMessage, messageData, response]);

  const messageType = response?.ok ? "success" : response ? "error" : "warning"; // Determine message type based on response

  return (
    message && (
      <div className={`message ${messageType}`}>
        {url ? (
          <Link to={url} onClick={hideMessage}>
            {message}
          </Link>
        ) : (
          message
        )}
      </div>
    )
  );
};

export default Message;
