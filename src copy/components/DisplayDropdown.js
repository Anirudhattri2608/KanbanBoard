import React, { useState } from "react";
import Dropdown from "./Dropdown";
import "../styling/DisplayDropdown.css";
import displayIcon from "../icons/Display.svg"; // Correctly import the icon

const DisplayDropdown = ({ onGroupByChange, onSortByChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="display-dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        <span>Display</span>
        <img src={displayIcon} alt="Display Icon" />
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <Dropdown
            label="Group By"
            options={[
              { label: "Status", value: "status" },
              { label: "User", value: "userId" },
              { label: "Priority", value: "priority" },
            ]}
            onChange={onGroupByChange}
          />
          <Dropdown
            label="Sort By"
            options={[
              { label: "Priority", value: "priority" },
              { label: "Title", value: "title" },
            ]}
            onChange={onSortByChange}
          />
        </div>
      )}
    </div>
  );
};

export default DisplayDropdown;
