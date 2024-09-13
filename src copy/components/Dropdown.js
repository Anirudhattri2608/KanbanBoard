import React from "react";
import "../styling/Dropdown.css";

const Dropdown = ({ label, options, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="dropdown">
      <label>{label}</label>
      <select onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
