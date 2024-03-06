import React, { useEffect } from "react";
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
export default function MenuBar() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerOpen(open);
      };
    const handleLogout = () => {
        localStorage.removeItem("Token");
        localStorage.removeItem('Refresh');
        window.location.reload();
    }
    const [newToken, setNewToken] = React.useState('');
    const refreshToken = async()  => {
    try {
        const tokenResponse = await fetch('http://localhost:8000/users/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: localStorage.getItem('Refresh') }), // Corrected the body JSON
        });

          if (!tokenResponse.ok) {
            localStorage.setItem('Token', '');
            localStorage.setItem('Refresh', '');
          }
          newToken = await tokenResponse.json();
          localStorage.setItem('Token', newToken.access);

    } catch (error) {

    }
  }

  useEffect(() => {
    refreshToken(); 
  }, []);

  return (
    <div>

    <AppBar elevation={3} variant="elevation" position="static">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Button style={{ color: 'white', fontWeight: 'bold' }} onClick={toggleDrawer(true)}>
            My App
          </Button>
          <Button style={{ color: 'white' }} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <List>
            <ListItem button>
            <Link to="/">
                <ListItemText primary="Home" />
              </Link>
            </ListItem>
            <ListItem button>
            <Link to="profile">
                <ListItemText primary="Profile" />
            </Link>
            </ListItem>
            <ListItem button>
            <Link to="/settings">
                <ListItemText primary="Settings" />
              </Link>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}