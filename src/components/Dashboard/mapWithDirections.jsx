// src/components/Dashboard/MapWithDirections.jsx
import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

 const MapWithDirections = ({ selectedLocation }) => {
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD7QXM4V8lR0qy3cWU9H83tWjsjVN1aooE", // already present
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded && selectedLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const destination = {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
          };

          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                setDirections(result);
              } else {
                console.error("Directions request failed due to " + status);
              }
            }
          );
        });
      }
    }
  }, [isLoaded, selectedLocation]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedLocation}
      zoom={12}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};


export default MapWithDirections;
