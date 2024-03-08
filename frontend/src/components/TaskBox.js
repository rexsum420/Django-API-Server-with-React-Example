import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

const CustomCard = ({ position, text, onUpdate }) => {
  const [completed, setCompleted] = useState(false);

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setCompleted(isChecked);
    onUpdate({ completed: isChecked });
  };

  const handleDelete = (e) => {
    // Handle delete action here
  };

  return (
    <Card style={{ width: '100%' }}>
      <CardActionArea>
        <CardContent style={{ display: "flex", alignItems: "center", width: '100%' }}>
          <Typography gutterBottom variant="h6" component="h2" style={{ width: '20%' }}>
            {position}
          </Typography>
          <Typography gutterBottom variant="h6" component="h2" style={{ width: '75%', textAlign: 'left' }}>
            {text}
          </Typography>
          <Checkbox
            color="primary"
            checked={completed}
            onChange={handleCheckboxChange}
            style={{ width: '5%' }}
          />
          <Button size="small" onClick={handleDelete}>X</Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CustomCard;
