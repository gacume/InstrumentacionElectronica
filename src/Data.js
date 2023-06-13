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

  const getAllData = () => {
    axios.get('https://locationsbackend-production.up.railway.app/api/getAll').then(response => {
      setPosts(response.data);
    });
  };

  const deleteAll = () => {
    const confirmed = window.confirm('Are you sure you want to delete all?');
    if (confirmed) {
      axios.patch('https://locationsbackend-production.up.railway.app/api/deleteAll')
        .then(() => {
          getAllData(); // Actualizar la lista después de eliminar todos los datos
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  React.useEffect(() => {
    getAllData(); // Obtener los datos iniciales al cargar el componente

    // Llamar a getAllData() automáticamente cada 5 minutos
    const interval = setInterval(() => {
      getAllData();
    }, 5 * 60);

    return () => {
      clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Box sx={{ paddingBottom: 8, paddingTop: 2, alignItems: 'center' }}>
        <Typography variant='h4' fontWeight='bold'>Locations</Typography>
      </Box>
      <Box sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
        <Divider />
        <nav aria-label="main mailbox folders">
          <List>
            {posts.map(location => (
              <ListItem key={location.id} disablePadding>
                <ListItemButton>
                  <ListItemText primary={"Id: " + location.id} />
                  <ListItemText primary={"lat: " + location.latitud} />
                  <ListItemText primary={"long: " + location.longitud} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>
      </Box>
      <Divider />
      <Box sx={{ paddingTop: 2 }} onClick={deleteAll}>
        <Button variant="contained">DELETE ALL</Button>
      </Box>
    </Box>
  );
}
