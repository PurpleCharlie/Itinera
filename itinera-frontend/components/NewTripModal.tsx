import React, { useState, useRef, useEffect } from "react";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function NewTripModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5192/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, dateFrom, dateTo }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка при создании поездки");
      }

      onCreated(); // Обновим список
      onClose(); // Закроем окно
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fade-in transition-colors duration-500">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Создание поездки
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={titleRef}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Название поездки"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <textarea
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Дата начала
              </label>
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                Дата окончания
              </label>
              <input
                type="date"
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
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
              {loading ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
