import React, { useEffect } from "react";
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Button } from '@material-ui/core';
import { Link } from "react-router-dom";

export default function MenuBar() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [data, setData] = React.useState('');
    
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerOpen(open);
    };
    
    const handleLogout = () => {
        localStorage.removeItem("Token");
        window.location.reload();
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('Token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8000/users/profile/me/', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        console.log("Error!")
                    } else {
                        const profileData = await response.json();
                        setData(profileData[0]);
                        localStorage.setItem('username', data.user.username);
                    }

                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            }
        };

        fetchData();
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
                            <Link to={`/profile/${localStorage.getItem('username')}`}>
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
