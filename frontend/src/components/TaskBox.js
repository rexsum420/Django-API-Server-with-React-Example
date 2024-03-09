import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const CustomCard = ({ text, onDelete }) => {


  const handleDeleteClick = () => {
    onDelete();
  };

  return (
    <Card style={{ width: '100%' }}>
      <CardActionArea>
        <CardContent style={{ display: "flex", alignItems: "center", width: '100%' }}>
          <Typography gutterBottom variant="h6" component="h2" style={{ width: '95%', textAlign: 'left' }}>
            {text}
          </Typography>
          <Button size="small" onClick={handleDeleteClick}>X</Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CustomCard;
