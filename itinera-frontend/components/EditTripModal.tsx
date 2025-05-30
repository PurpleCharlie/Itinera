import React, { useState, useEffect, useRef } from "react";

interface Props {
  trip: {
    id: number;
    title: string;
    description?: string;
    dateFrom: string;
    dateTo: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditTripModal({ trip, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Преобразование даты к виду YYYY-MM-DD
    function formatDateOnly(dateString: string) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    setTitle(trip.title);
    setDescription(trip.description || "");
    setDateFrom(formatDateOnly(trip.dateFrom));
    setDateTo(formatDateOnly(trip.dateTo));
    titleRef.current?.focus();
  }, [trip]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5192/api/trip/${trip.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          title,
          description,
          dateFrom,
          dateTo,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Ошибка при обновлении");

      onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in text-gray-800 dark:text-white">
        <h2 className="text-xl font-semibold mb-4">Редактирование поездки</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={titleRef}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            type="text"
            placeholder="Название поездки"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <textarea
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
            rows={3}
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1 text-gray-600 dark:text-gray-300">
                Дата начала
              </label>
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1 text-gray-600 dark:text-gray-300">
                Дата окончания
              </label>
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
