import { createContext, useState } from "react";
import Message from "../components/Message";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messageData, setMessageData] = useState(null);

  const showMessage = (data, url = null) => {
    console.log(data);
    setMessageData({ data, url });
  };

  const hideMessage = () => {
    setMessageData(null);
  };

  return (
    <MessageContext.Provider value={{ showMessage, hideMessage }}>
      {children}
      <Message messageData={messageData} hideMessage={hideMessage} />
    </MessageContext.Provider>
  );
};
