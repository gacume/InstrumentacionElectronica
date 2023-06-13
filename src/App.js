import React, { useEffect, useRef } from "react";
import { Map, Marker, Polyline, TileLayer } from "react-leaflet";
import "./App.css";
import axios from 'axios';
import L from "leaflet";

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

  const deleteAll = () => {
    axios.patch('https://locationsbackend-production.up.railway.app/api/deleteAll')
      .then(() => {
        setPosts([]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (posts.length > 0 && mapRef.current) {
      const latitudes = posts.map(post => post.latitud);
      const longitudes = posts.map(post => post.longitud);
      const bounds = L.latLngBounds(
        L.latLng(Math.min(...latitudes), Math.min(...longitudes)),
        L.latLng(Math.max(...latitudes), Math.max(...longitudes))
      );
      mapRef.current.leafletElement.fitBounds(bounds);
    }
  }, [posts, mapRef]);

  return (
    <div>
      <Map center={[21.8853, -102.2916]} zoom={12} ref={mapRef}>
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
          subdomains="abcd"
          minZoom={0}
          maxZoom={20}
          ext="png"
        />

        {posts.length > 1 && (
          <Polyline
            positions={posts.map(post => [post.latitud, post.longitud])}
            color="red"
            weight={5}
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
              icon={icon}
            />
          </>
        )}
      </Map>
      <button onClick={deleteAll}>Delete All</button>
    </div>
  );
}
