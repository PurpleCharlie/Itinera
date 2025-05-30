import React, { useEffect, useState } from "react";
import TripTabs from "./TabSwitcher";

interface Props {
  tripId: number;
  onClose: () => void;
}

interface Trip {
  id: number;
  title: string;
  description?: string;
  dateFrom: string;
  dateTo: string;
}

export default function TripDetailsModal({ tripId, onClose }: Props) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  // Закрытие с анимацией
  function handleClose() {
    setVisible(false);
    setTimeout(() => {
      onClose(); // только после завершения анимации
    }, 300); // время должно совпадать с длительностью анимации
  }

  useEffect(() => {
    async function fetchTrip() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://localhost:5192/api/trip/${tripId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Ошибка при получении поездки");
        }

        const data = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={`
          w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-gutter
          bg-white dark:bg-gray-900 rounded-xl p-6 shadow-2xl
          transform transition-all duration-300 ease-out text-gray-800 dark:text-white
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        <h2 className="text-xl font-semibold mb-4">Детали поездки</h2>

        {loading && (
          <p className="text-gray-600 dark:text-gray-300">Загрузка...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {trip && (
          <>
            <TripTabs tripId={trip.id} tripTitle={trip.title} />
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-md transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
