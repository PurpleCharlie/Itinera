import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ForceResizeMap from "./ForceResizeMap";

// Исправление бага с иконкой маркера
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface RoutePoint {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  order: number;
}

interface Props {
  tripId: number;
}

export default function TripRoutePoints({ tripId }: Props) {
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    order: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPoints();
  }, []);

  async function fetchPoints() {
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5192/api/trips/${tripId}/route`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Ошибка при получении маршрута");
      const data = await res.json();
      setRoutePoints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      order: parseInt(form.order),
    };

    try {
      const res = await fetch(
        `http://localhost:5192/api/trips/${tripId}/route`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Ошибка при добавлении точки");

      setForm({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        order: "",
      });
      setShowForm(false);
      await fetchPoints();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }

  function ClickHandler() {
    useMapEvent("click", (e) => {
      setForm((prev) => ({
        ...prev,
        latitude: e.latlng.lat.toString(),
        longitude: e.latlng.lng.toString(),
      }));
      setShowForm(true);
    });
    return null;
  }

  const sortedPoints = [...routePoints].sort((a, b) => a.order - b.order);

  return (
    <div className="mt-6 p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm relative text-gray-800 dark:text-white transition-colors">
      <h3 className="text-lg font-semibold mb-4">Маршрут</h3>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
        title="Добавить точку"
      >
        +
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-3 mb-6 mt-4 animate-form-in"
        >
          <input
            type="text"
            placeholder="Название"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Широта"
            value={form.latitude}
            readOnly
            className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded transition-colors"
          />
          <input
            type="text"
            placeholder="Долгота"
            value={form.longitude}
            readOnly
            className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded transition-colors"
          />
          <input
            type="number"
            placeholder="Порядок"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
            required
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            disabled={loading}
          >
            Сохранить
          </button>
        </form>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <MapContainer
        center={[55.75, 37.61]}
        zoom={sortedPoints.length ? 5 : 3}
        scrollWheelZoom={true}
        className="h-64 w-full rounded mb-6 z-0"
        style={{ zIndex: 0 }}
      >
        <ForceResizeMap />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <ClickHandler />

        {sortedPoints.map((point) => (
          <Marker key={point.id} position={[point.latitude, point.longitude]}>
            <Popup>
              <div className="space-y-1">
                <strong>{point.name}</strong>
                <br />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {point.description}
                </span>
                <br />
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        `http://localhost:5192/api/trips/${tripId}/route/${point.id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                          },
                        }
                      );
                      const msg = await res.text();
                      if (!res.ok) throw new Error(msg);
                      await fetchPoints();
                    } catch {
                      alert("Ошибка при удалении точки маршрута");
                    }
                  }}
                  className="text-red-600 hover:text-red-800 mt-2 text-sm"
                >
                  🗑 Удалить
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {sortedPoints.length > 1 && (
          <Polyline
            positions={sortedPoints.map((point) => [
              point.latitude,
              point.longitude,
            ])}
            pathOptions={{ color: "blue", weight: 4, opacity: 0.6 }}
          />
        )}
      </MapContainer>

      <ul className="space-y-2">
        {sortedPoints.map((point, index) => (
          <li
            key={`list-${point.id}`}
            className="p-3 rounded border bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white flex flex-col animate-task-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{point.name}</span>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://localhost:5192/api/trips/${tripId}/route/${point.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                      }
                    );
                    const msg = await res.text();
                    if (!res.ok) throw new Error(msg);
                    await fetchPoints();
                  } catch {
                    alert("Ошибка при удалении точки маршрута");
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
                title="Удалить точку"
              >
                Удалить
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {point.description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-400">
              Координаты: {point.latitude.toFixed(4)},{" "}
              {point.longitude.toFixed(4)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
