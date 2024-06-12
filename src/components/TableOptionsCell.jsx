import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const TableOptionsCell = ({ value, onSave, fetchOptions }) => {
  const [options, setOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState(
    value ? value.split(", ") : []
  );
  const [customTag, setCustomTag] = useState("");

  const handleSelectTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      onSave(newSelectedTags.join(", "));
    }
  };

  const handleSubmitNewTag = (e) => {
    const tag = e.target.value.trim();

    // Mock API call
    const mockApiCall = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000); // Simulate a 1 second API call
    });

    mockApiCall.then((response) => {
      if (response.success) {
        if (tag && !selectedTags.includes(tag)) {
          const newSelectedTags = [...selectedTags, tag];
          setSelectedTags(newSelectedTags);
          onSave(newSelectedTags.join(", "));
        }
        setCustomTag("");
      } else {
        // Handle API call failure (optional)
        console.error("Failed to create new tag");
      }
    });
  };

  const handleRemoveTag = (tag) => {
    const newSelectedTags = selectedTags.filter(
      (selectedTag) => selectedTag !== tag
    );
    setSelectedTags(newSelectedTags);
    onSave(newSelectedTags.join(", "));
  };

  useEffect(() => {
    if (fetchOptions) {
      fetchOptions().then((options) => setOptions(options));
    }
  }, [customTag, fetchOptions]);

  return (
    <div>
      <select value="" onChange={(e) => handleSelectTag(e.target.value)}>
        <option value="" disabled>
          Select Tags
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div>
        {selectedTags.map((tag, index) => (
          <button
            className="tag"
            key={index}
            onClick={() => handleRemoveTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
      <input
        type="text"
        name="customTag"
        id="customTag"
        placeholder="custom tag"
        value={customTag}
        onChange={(e) => setCustomTag(e.target.value)}
        onBlur={handleSubmitNewTag}
        autoFocus
      />
    </div>
  );
};

TableOptionsCell.propTypes = {
  value: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  fetchOptions: PropTypes.func.isRequired,
};

export default TableOptionsCell;
