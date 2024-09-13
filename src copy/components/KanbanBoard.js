import React, { useState, useEffect } from "react";
import { fetchTickets } from "../services/api";
import Ticket from "./Ticket";
import DisplayDropdown from "./DisplayDropdown";
import "../styling/KanbanBoard.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Import status icons
import backlogIcon from "../icons/Backlog.svg";
import inProgressIcon from "../icons/in-progress.svg";
import todoIcon from "../icons/To-do.svg";
import doneIcon from "../icons/Done.svg";
import cancelIcon from "../icons/Cancelled.svg";

// Import priority icons
import urgentPriorityIcon from "../icons/SVG - Urgent Priority colour.svg";
import highPriorityIcon from "../icons/Img - High Priority.svg";
import mediumPriorityIcon from "../icons/Img - Medium Priority.svg";
import lowPriorityIcon from "../icons/Img - Low Priority.svg";
import noPriorityIcon from "../icons/No-priority.svg";

const priorityLabels = {
  4: "Urgent",
  3: "High",
  2: "Medium",
  1: "Low",
  0: "No Priority",
};

const priorityIcons = {
  4: urgentPriorityIcon,
  3: highPriorityIcon,
  2: mediumPriorityIcon,
  1: lowPriorityIcon,
  0: noPriorityIcon,
};

const statusIcons = {
  backlog: backlogIcon,
  inProgress: inProgressIcon,
  todo: todoIcon,
  done: doneIcon,
  cancel: cancelIcon,
};

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");

  useEffect(() => {
    const getTickets = async () => {
      const data = await fetchTickets();
      setTickets(data.tickets);
    };
    getTickets();
  }, []);

  const handleGroupByChange = (value) => {
    setGroupBy(value);
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
  };

  const groupTickets = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      let key = ticket[groupBy] || "Unassigned";

      if (groupBy === "priority") {
        key = priorityLabels[ticket.priority] || "Unknown Priority";
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(ticket);
      return acc;
    }, {});
  };

  const sortTickets = (tickets) => {
    return [...tickets].sort((a, b) => {
      if (sortBy === "priority") {
        return b.priority - a.priority;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const groupedTickets = groupTickets(tickets);
  const sortedTickets = Object.keys(groupedTickets).map((key) => ({
    group: key,
    tickets: sortTickets(groupedTickets[key]),
  }));

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { destination } = result;
    const movedTicketId = result.draggableId;

    setTickets((prevTickets) => {
      const updatedTickets = prevTickets.map((ticket) =>
        ticket.id === movedTicketId
          ? { ...ticket, status: destination.droppableId }
          : ticket
      );
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      return updatedTickets;
    });
  };

  return (
    <div>
      <DisplayDropdown
        onGroupByChange={handleGroupByChange}
        onSortByChange={handleSortByChange}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="kanban-board" direction="horizontal">
          {(provided) => (
            <div
              className="board-columns"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sortedTickets.map((group, index) => (
                <Droppable
                  key={group.group}
                  droppableId={group.group}
                  direction="vertical"
                >
                  {(provided) => (
                    <div
                      className="board-column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h2>
                        <img
                          src={
                            groupBy === "priority"
                              ? priorityIcons[
                                  Object.keys(priorityLabels).find(
                                    (key) => priorityLabels[key] === group.group
                                  )
                                ]
                              : statusIcons[group.group] || statusIcons.todo
                          }
                          alt="Group Icon"
                          className="group-icon"
                        />
                        {group.group} ({group.tickets.length})
                      </h2>
                      {group.tickets.map((ticket, index) => (
                        <Draggable
                          key={ticket.id}
                          draggableId={ticket.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Ticket key={ticket.id} ticket={ticket} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
