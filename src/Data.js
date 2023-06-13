import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Button, Typography } from '@mui/material';
import axios from 'axios';

export default function Data() {
  const [posts, setPosts] = React.useState([]);
  let deletedAll = false;
  React.useEffect(() => {
    axios.get('https://locationsbackend-production.up.railway.app/api/getAll').then(response => {
      setPosts(response.data);
    })
  }, [deletedAll]);

  const deleteAll = () => {
    axios.patch('https://locationsbackend-production.up.railway.app/api/deleteAll')
  };
  return (

    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Box sx={{ paddingBottom: 8, paddingTop: 2, alignItems: 'center' }}>
        <Typography variant='h1'>Locations</Typography>
      </Box>
      <Box>
        <Divider />
        <nav aria-label="main mailbox folders">
          {
            posts.map(location =>
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary={location.id} />
                  </ListItemButton>
                </ListItem>
              </List>)}
        </nav>
        <Divider />
        <Box sx={{ paddingTop: 2 }} onClick={() => {
          deleteAll()
        }}>
          <Button variant="contained">DELETE ALL</Button>
        </Box>
      </Box>
    </Box>
  );
}
