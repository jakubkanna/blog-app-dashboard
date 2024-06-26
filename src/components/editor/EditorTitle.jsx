import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../../contexts/EditorContext";

export default function EditorTitle() {
  const [isEditingInput, setIsEditingInput] = useState(false);
  const { title, setTitle } = useContext(EditorContext);
  const [titleState, setTitleState] = useState();

  useEffect(() => {
    setTitleState(title);
  }, [title]);

  const handleTitleChange = (event) => {
    setTitleState(event.target.value);
  };

  const handleTitleClick = () => {
    setIsEditingInput(true);
  };

  const handleTitleBlur = () => {
    setIsEditingInput(false);
    setTitle(titleState);
  };

  return (
    <>
      {isEditingInput ? (
        <input
          type="text"
          name="title"
          id="postTitle"
          value={titleState}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          autoFocus
        />
      ) : (
        <h1 onClick={handleTitleClick}>{titleState}</h1>
      )}
    </>
  );
}
