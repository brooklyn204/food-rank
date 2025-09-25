"use client";

import { GoogleMap, LoadScript, Marker, InfoWindow, StandaloneSearchBox } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";
import Location from "../lib/models/Location";

const containerStyle = {
  width: "100%",
  height: "500px",
  margin: "0 auto", // Center horizontally
  display: "block", // Ensure block-level for margin auto
};

const center = {
  lat: 44.9778, // Default Minneapolis
  lng: -93.2650,
};

export default function MapWithSearch({ onPlaceAdd }) {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const searchBoxRef = useRef(null);

  const onPlacesChanged = () => {
    const results = searchBoxRef.current.getPlaces();
    if (!results || results.length === 0) return;
    console.log("Places results:", results);
    setPlaces(results);
    setSelected(null); // reset selection
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
        {/* Search bar */}
        <div style={{ marginBottom: "10px", textAlign: "center" }}>
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
            bounds={map?.getBounds()} // bias results to current map view
          >
            <input
              type="text"
              placeholder="Search here..."
              style={{
                width: "300px",
                height: "40px",
                padding: "0 12px",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                fontSize: "16px",
              }}
            />
          </StandaloneSearchBox>
        </div>

        {/* Map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {places.map((p) => (
            <Marker
              key={p.place_id}
              position={{
                lat: p.geometry.location.lat(),
                lng: p.geometry.location.lng(),
              }}
              onRightClick={() => setSelected(p)}
              onLoad={(markerInstance) => {
                // Save the marker instance so you can control it later
                p._marker = markerInstance;
              }}
              onClick={() => {
                if (p._marker) {
                  p._marker.setAnimation(google.maps.Animation.BOUNCE);
                  setTimeout(() => p._marker.setAnimation(null), 500);
                }
                const location = new Location(p.name);
                onPlaceAdd(location); // your existing logic
              }}
              label={{
                text: p.name,      // The name of the place
                fontSize: "12px",  // Adjust size
                color: "#000",     // Text color
              }}
            />
          ))}

          {selected && (
            <InfoWindow
              position={{
                lat: selected.geometry.location.lat(),
                lng: selected.geometry.location.lng(),
              }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h3>{selected.name}</h3>
                {selected.vicinity && <p>{selected.vicinity}</p>}
                {selected.rating && <p>⭐ {selected.rating} / 5</p>}
                {selected.user_ratings_total && (
                  <p>{selected.user_ratings_total} reviews</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}