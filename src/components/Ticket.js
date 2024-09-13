import React from "react";
import "../styling/Ticket.css";
import priorityHigh from "../icons/Img - High Priority.svg";
import priorityLow from "../icons/Img - Low Priority.svg";
import priorityMedium from "../icons/Img - Medium Priority.svg";
import priorityNone from "../icons/No-priority.svg";
import urgentPriority from "../icons/SVG - Urgent Priority colour.svg";

const priorityIcons = {
  4: urgentPriority,
  3: priorityHigh,
  2: priorityMedium,
  1: priorityLow,
  0: priorityNone, // Icon for no priority
};

const priorityLabels = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "No Priority",
};

const Ticket = ({ ticket }) => {
  const { id, title, priority, tag } = ticket;
  const label = priorityLabels[priority] || "Unknown Priority"; // Fallback for unexpected values

  return (
    <div className="ticket">
      <div className="ticket-header">
        <h3>{id}</h3>
        <h2>{title}</h2>
      </div>
      <div className="ticket-body">
        <img src={priorityIcons[priority]} alt={label} />
        {/* Removed status text */}
      </div>
      {tag && <div className="ticket-tag">{tag}</div>}
    </div>
  );
};

export default Ticket;
