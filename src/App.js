import React, { useEffect, useRef } from "react";
import { Map, Marker, Polyline, TileLayer } from "react-leaflet";
import "./App.css";
import axios from 'axios';
import L from "leaflet";

import carIcon from "./Vector.svg";

export const icon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export default function App() {
  const [posts, setPosts] = React.useState([]);
  const mapRef = useRef(null);

  const getAllData = () => {
    axios.get('https://locationsbackend-production.up.railway.app/api/getAll').then(response => {
      setPosts(response.data);
    });
  };

  useEffect(() => {
    getAllData();

    const interval = setInterval(() => {
      getAllData();
    }, 5 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (posts.length > 0 && mapRef.current) {
      const lastPost = posts[posts.length - 1];
      mapRef.current.leafletElement.setView([lastPost.latitud, lastPost.longitud], 16);
    }
  }, [posts, mapRef]);

  const carMarkerIcon = new L.Icon({
    iconUrl: carIcon,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    iconSize: [35,35],
    iconAnchor: [17,20],
    popupAnchor: [0,0],
    tooltipAnchor: [0,0],
    shadowSize: [41, 41]
  });

  return (
    <div>
      <Map center={[21.8853, -102.2916]} zoom={12} ref={mapRef} minZoom={0} maxZoom={18} zoomSnap={0.5}>
      <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  subdomains="abc"
/>


        {posts.length > 1 && (
          <Polyline
            positions={posts.map(post => [post.latitud, post.longitud])}
            color="#0085FF"
            weight={6}
          />
        )}

        {posts.length > 0 && (
          <>
            <Marker
              position={[posts[0].latitud, posts[0].longitud]}
              icon={icon}
            />

            <Marker
              position={[posts[posts.length - 1].latitud, posts[posts.length - 1].longitud]}
              icon={carMarkerIcon}
            />
          </>
        )}
      </Map>
    </div>
  );
}
