import React, { useEffect, useState } from "react";
import NewTripModal from "../components/NewTripModal";
import LogoutModal from "../components/LogoutModal";
import TripDetailsModal from "../components/TripDetailsModal";
import EditTripModal from "../components/EditTripModal";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../src/utils/fetchWithAuth";

interface Trip {
  id: number;
  title: string;
  description?: string;
  dateFrom: string;
  dateTo: string;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    navigate("/auth");
  }

  const fetchTrips = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchWithAuth("http://localhost:5192/api/trip");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при загрузке поездок");
      }

      const data = await response.json();
      setTrips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 relative text-gray-800 dark:text-white transition-colors duration-500">
      {/* Переключатель темы */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Внутреннее окно */}
      <div className="animate-window-pop bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl w-full max-w-4xl z-10 transition-colors duration-500">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 text-center sm:text-left">
            ✈️ Мои поездки
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate("/profile")}
              className="w-full sm:w-36 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm text-center"
            >
              👤 Профиль
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-36 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm text-center"
            >
              + Добавить
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full sm:w-36 px-4 py-2 bg-red-100 text-red-600 border border-red-300 hover:bg-red-600 hover:text-white dark:bg-transparent dark:border-red-500 dark:hover:bg-red-700 rounded text-sm text-center"
            >
              Выйти
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-gray-600 dark:text-gray-300">Загрузка...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {trips.length === 0 && !loading && !error && (
          <p className="text-gray-500 dark:text-gray-400">
            Поездки не найдены.
          </p>
        )}

        <ul className="space-y-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="relative border rounded-lg p-4 bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 hover:shadow-md transition group"
              onClick={() => setSelectedTripId(trip.id)}
            >
              {/* Кнопка редактирования */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTrip(trip);
                }}
                title="Изменить"
                className="absolute top-2 right-10 text-blue-600 hover:text-blue-800 text-xl opacity-0 group-hover:opacity-100 transition"
              >
                ✏️
              </button>

              {/* Кнопка удаления */}
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm("Удалить эту поездку?")) return;

                  try {
                    const res = await fetchWithAuth(
                      `http://localhost:5192/api/trip/${trip.id}`,
                      {
                        method: "DELETE",
                      }
                    );

                    const result = await res.json();
                    if (!res.ok) throw new Error(result.message);

                    setTrips((prev) => prev.filter((t) => t.id !== trip.id));
                  } catch (err) {
                    alert(
                      err instanceof Error
                        ? err.message
                        : "Ошибка при удалении поездки"
                    );
                  }
                }}
                title="Удалить"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-3xl opacity-0 group-hover:opacity-100 transition"
              >
                🗑
              </button>

              <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                {trip.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(trip.dateFrom)} — {formatDate(trip.dateTo)}
              </p>
              {trip.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-300 truncate">
                  {trip.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {showCreateModal && (
        <NewTripModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchTrips}
        />
      )}

      {selectedTripId && (
        <TripDetailsModal
          tripId={selectedTripId}
          onClose={() => setSelectedTripId(null)}
        />
      )}

      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {editingTrip && (
        <EditTripModal
          trip={editingTrip}
          onClose={() => setEditingTrip(null)}
          onUpdated={fetchTrips}
        />
      )}
    </div>
  );
}
