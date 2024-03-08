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
const Task = ({ id, text, index, moveCard }) => {
    const ref = useRef(null);
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
        moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    });
  
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: () => ({ id, index }),
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    });

    const handleDelete = () => {
        // Remove the card from the list
        moveCard(index, cards => cards.filter((_, i) => i !== index));
        setCards(prevCards => {
          return prevCards.map((card, i) => ({
            ...card,
            priority: i + 1 // Renumber priorities sequentially
          }));
        });
      };
      
    const position = `Priority [${index + 1}]`;
  
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
      
  
    return (
      <CustomCard
        ref={ref}
        style={{ ...style, opacity }}
        position={position}
        text={text}
        onDelete={handleDelete} // Pass the handleDelete function as onDelete prop
      />
    );
  };

export default Task;
