import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "./App.css";
import axios from 'axios';

export const icon = new Icon({
  iconUrl: "/skateboarding.svg",
  iconSize: [25, 25]
});

export default function App() {
  const [activePark, setActivePark] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    axios.get('https://locationsbackend-production.up.railway.app/api/getAll').then(response => {
      setPosts(response.data);
    })
  }, []);
  console.log(posts, 'this is app')
  return (
    <div>
      <Map center={[21.8853, -102.2916]} zoom={12}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {posts.map(post => (
          <Marker
            position={[
              post.latitud,
              post.longitud
            ]}
            onClick={() => {
              setActivePark(post);
            }}
            icon={icon}
          />
        ))}

        {activePark && (
          <Popup
            position={[
              activePark.geometry.coordinates[1],
              activePark.geometry.coordinates[0]
            ]}
            onClose={() => {
              setActivePark(null);
            }}
          >
            <div>
              <h2>{activePark.properties.NAME}</h2>
              <p>{activePark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
