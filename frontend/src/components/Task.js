import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../lib/ItemTypes";
import CustomCard from "./TaskBox";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};

const Task = ({ id, text, index, moveCard, onDelete}) => {
  const ref = useRef(null);

  // Setup the drop target for the card
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveCard(dragIndex, hoverIndex); // Call the moveCard function from props to update the card order
      item.index = hoverIndex; // Update the index of the dragged item
    }
  });

  // Setup the drag source for the card
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id, index }), // Specify the id and index of the dragged item
    collect: monitor => ({
      isDragging: monitor.isDragging() // Check if the card is currently being dragged
    })
  });

  // Attach the drag and drop functionality to the card element
  drag(drop(ref));

  // Function to handle card deletion
  const handleDelete = () => {
    onDelete(id);
  };

  // Set the opacity of the card based on whether it's being dragged
  const opacity = isDragging ? 0 : 1;

  // Render the CustomCard component with the provided props
  return (
    <div ref={ref}>
      <CustomCard
        style={{ ...style, opacity }}
        text={text}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Task;
