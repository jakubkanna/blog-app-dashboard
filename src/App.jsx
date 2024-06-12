import "./styles/App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import { MessageProvider } from "./contexts/MessageContext";

function App() {
  return (
    <>
      <Header />
      <MessageProvider>
        <Main />
      </MessageProvider>
      <Footer />
    </>
  );
}

export default App;
