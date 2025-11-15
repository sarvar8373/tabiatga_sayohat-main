import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function LocationPicker({ setCoordinates }) {
  const [position, setPosition] = useState([41.3111, 69.2797]); // Tashkent
  const mapRef = useRef(null);

  // 📌 YAQINLASHISH funksiyasi
  const zoomTo = (coords) => {
    if (mapRef.current) {
      mapRef.current.setView(coords, 15, { animate: true });
    }
  };

  // 📌 Foydalanuvchining turgan joyini olish
  const detectMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Sizda geolokatsiya yoq!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];

        setPosition(coords);
        setCoordinates(`${coords[0]},${coords[1]}`);

        zoomTo(coords); // YAQINLASHISH
      },
      () => {
        alert("Geolokatsiya ruxsati berilmadi!");
      }
    );
  };

  // 📌 Marker qayerga bosilsa — zoom bo‘ladi
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const coords = [e.latlng.lat, e.latlng.lng];

        setPosition(coords);
        setCoordinates(`${coords[0]},${coords[1]}`);

        zoomTo(coords); // YAQINLASHISH
      },
    });

    return <Marker position={position}></Marker>;
  }

  return (
    <div>
      <div
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={position}
          zoom={10}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      </div>

      <button
        type="button"
        onClick={detectMyLocation}
        style={{
          padding: "8px 15px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        📍Joyni aniqlash
      </button>
    </div>
  );
}
