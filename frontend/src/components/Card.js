import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  card: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40%',
    },
    borderRadius: theme.spacing(2),
  },
}));

export default function CustomCard({ children, header, style }) {
  const classes = useStyles();

  return (
    <div className={classes.cardContainer}>
      <Card elevation={3} variant="elevation" className={classes.card} style={style}>
        <CardContent>
          {header && header.trim() !== '' && (
            <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold'}}>
              {header}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
