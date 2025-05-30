import React, { useEffect, useState } from "react";

interface TripTask {
  id: number;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

interface Props {
  tripId: number;
}

export default function TripTasks({ tripId }: Props) {
  const [tasks, setTasks] = useState<TripTask[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5192/api/trips/${tripId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Ошибка при получении задач");
      const data = await res.json();
      setTasks(data);
      console.log("Обновлённые задачи:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5192/api/trips/${tripId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ title, dueDate }),
        }
      );
      if (!res.ok) throw new Error("Ошибка при добавлении задачи");
      setTitle("");
      setDueDate("");
      setShowForm(false);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(taskId: number) {
    try {
      const res = await fetch(
        `http://localhost:5192/api/trips/${tripId}/tasks/${taskId}/toggle`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Ошибка при обновлении статуса задачи");
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    }
  }

  return (
    <div className="mt-6 p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm relative text-gray-800 dark:text-white transition-colors">
      <h3 className="text-lg font-semibold mb-4">Задачи</h3>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
        title="Добавить задачу"
      >
        +
      </button>

      {showForm && (
        <form
          onSubmit={addTask}
          className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center mb-6 mt-4 animate-form-in"
        >
          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
            disabled={loading}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            className="sm:col-span-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            disabled={loading}
          >
            Сохранить
          </button>
        </form>
      )}

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className={`relative px-4 py-2 rounded border transition-colors
              ${
                task.isCompleted
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              }
              animate-task-fade-in`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Кнопка удаления задачи */}
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:5192/api/trips/${tripId}/tasks/${task.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                      },
                    }
                  );
                  if (!res.ok) throw new Error("Ошибка при удалении");
                  setTasks((prev) => prev.filter((t) => t.id !== task.id));
                } catch {
                  alert("Ошибка при удалении задачи");
                }
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
              title="Удалить задачу"
            >
              ❌
            </button>

            <div className="flex justify-between items-start gap-4 pr-8">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Срок: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => toggleTask(task.id)}
                  className="form-checkbox h-5 w-5 text-green-600 rounded transition"
                />
                <span className="text-sm">
                  {task.isCompleted ? "Готово" : "Не выполнено"}
                </span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
