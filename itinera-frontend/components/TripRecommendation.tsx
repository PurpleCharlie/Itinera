import React, { useState, useEffect } from "react";
import TravelStyleSelect from "./TravelStyleSelect";
import InterestSelect from "./InterestSelect";

interface Props {
  tripId: number;
  tripTitle: string;
}

interface RecommendationHistoryDto {
  id: number;
  destination: string;
  recommendationText: string;
  createdAt: string;
  days: number;
  style: string;
}

export default function TripRecommendation({ tripId, tripTitle }: Props) {
  const [form, setForm] = useState({
    destination: "",
    days: "",
    style: "",
    interests: "",
    budgetLevel: "",
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [history, setHistory] = useState<RecommendationHistoryDto[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selected, setSelected] = useState<RecommendationHistoryDto | null>(
    null
  );
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [parsedCities, setParsedCities] = useState<string[]>([]);

  useEffect(() => {
    fetchProfileData();
  }, [tripId]);

  useEffect(() => {
    (async function parseTripTitleToCities() {
      const cities = await extractCitiesFromTripTitle(tripTitle);
      setParsedCities(cities);

      if (cities.length > 0) {
        setForm((prev) => ({ ...prev, destination: cities[0] }));
      }
    })();
  }, [tripTitle]);

  async function fetchProfileData() {
    try {
      const res = await fetch("http://localhost:5192/api/profile/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.interests)
        setInterests(data.interests.split(",").map((i: string) => i.trim()));

      if (data.travelStyle)
        setTravelStyles(
          data.travelStyle.split(",").map((s: string) => s.trim())
        );
    } catch (err) {
      console.error("Ошибка загрузки профиля", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (interests.length === 0 || travelStyles.length === 0) {
      setValidationError(
        "Пожалуйста, выберите хотя бы один интерес и один стиль путешествия."
      );
      return;
    }

    setLoading(true);
    setRecommendation("");
    setError("");

    try {
      const cleanDays = parseInt(form.days);

      const res = await fetch(
        `http://localhost:5192/api/recommendation/${tripId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            destination: form.destination.trim(),
            days: cleanDays,
            style: travelStyles.join(","),
            interests: interests.join(","),
            budgetLevel: form.budgetLevel.trim(),
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Сервер вернул ошибку:", res.status, errorText);
        throw new Error(`Ошибка сервера (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      setIsFromHistory(false);
      setSelected(null);
      setRecommendation(data.summary);
      await loadHistory();
      setShowHistory(true);
      setIsFromHistory(false);
      setSelected(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Ошибка AI:", err);
      setError(err.message || "Ошибка при запросе рекомендации.");
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    if (showHistory) {
      setShowHistory(false);
      setSelected(null);
      setIsFromHistory(false);
      return;
    }

    setRecommendation("");
    setSelected(null);
    setIsFromHistory(false);

    try {
      const res = await fetch(
        `http://localhost:5192/api/recommendation/${tripId}/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error();
      const data = await res.json();
      setHistory(data);
      setShowHistory(true);
    } catch {
      setError("Не удалось загрузить историю.");
    }
  }

  function convertMarkdownToHtml(md: string): string {
    return md
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/### (.+)/g, "<h3>$1</h3>")
      .replace(/- (.+)/g, "<li>$1</li>")
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/<\/p><p>/g, "</p>\n<p>");
  }

  async function deleteRecommendation(id: number) {
    try {
      const res = await fetch(
        `http://localhost:5192/api/recommendation/history/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Не удалось удалить рекомендацию");

      setHistory((prev) => prev.filter((item) => item.id !== id));

      if (selected?.id === id) {
        setSelected(null);
        setIsFromHistory(false);
      }
    } catch {
      setError("Ошибка при удалении рекомендации.");
    }
  }

  return (
    <div className="mt-6 p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white transition-colors">
      <h3 className="text-lg font-semibold mb-4">Идеи для поездки</h3>

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={fetchProfileData}
          className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
        >
          Заполнить из профиля
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 mb-4">
        <select
          value={form.destination}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, destination: e.target.value }))
          }
          disabled={loading}
          required
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-700"
        >
          {parsedCities.length === 0 ? (
            <option disabled>Города не найдены</option>
          ) : (
            parsedCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))
          )}
        </select>

        <input
          type="number"
          min="1"
          max="30"
          placeholder="На сколько дней?"
          value={form.days}
          onChange={(e) => {
            const value = e.target.value;

            // Разрешаем пустое значение (например, при стирании)
            if (value === "") {
              setForm((prev) => ({ ...prev, days: "" }));
              return;
            }

            const numeric = parseInt(value, 10);

            // Только числа от 1 до 30
            if (!isNaN(numeric) && numeric >= 1 && numeric <= 30) {
              setForm((prev) => ({ ...prev, days: numeric.toString() }));
            }
          }}
          onKeyDown={(e) => {
            const invalidChars = ["-", "+", "e", ".", ","];
            if (invalidChars.includes(e.key)) {
              e.preventDefault();
            }
          }}
          required
          disabled={loading}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-700"
        />

        <TravelStyleSelect values={travelStyles} onChange={setTravelStyles} />

        <InterestSelect values={interests} onChange={setInterests} />

        <input
          type="text"
          placeholder="Уровень бюджета"
          value={form.budgetLevel}
          onChange={(e) => setForm({ ...form, budgetLevel: e.target.value })}
          required
          disabled={loading}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-700"
        />

        <button
          type="submit"
          disabled={loading}
          className={`text-white px-4 py-2 rounded transition ${
            loading
              ? "bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Генерация..." : "Получить рекомендации"}
        </button>

        {validationError && (
          <p className="text-red-500 text-sm">{validationError}</p>
        )}
      </form>

      <button
        onClick={loadHistory}
        className="text-sm underline text-blue-500 hover:text-blue-700 mb-2"
      >
        {showHistory ? "Скрыть историю" : "Показать историю"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!showHistory && !isFromHistory && recommendation && (
        <div className="prose prose-sm max-w-none mt-6 text-gray-800 dark:text-gray-200">
          <div
            dangerouslySetInnerHTML={{
              __html: convertMarkdownToHtml(recommendation),
            }}
          />
        </div>
      )}

      {isFromHistory && selected && (
        <div className="mt-4 p-3 border rounded bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <strong>{selected.destination}</strong> —{" "}
              {new Date(selected.createdAt).toLocaleString()}
            </div>
            <button
              onClick={() => {
                setSelected(null);
                setIsFromHistory(false);
              }}
              className="text-xs text-red-500 hover:text-gray-700 dark:hover:text-white"
            >
              Закрыть
            </button>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: convertMarkdownToHtml(selected.recommendationText),
            }}
          />
        </div>
      )}

      {showHistory && (
        <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-700 text-sm">
          <h4 className="font-semibold mb-2">История рекомендаций</h4>
          {history.length === 0 && (
            <p className="text-gray-500">История пуста.</p>
          )}
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span
                  onClick={() => {
                    setSelected(item);
                    setIsFromHistory(true);
                  }}
                  className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {new Date(item.createdAt).toLocaleString()} —{" "}
                  {item.destination} ({item.days} дн., стиль: {item.style})
                </span>
                <button
                  onClick={() => deleteRecommendation(item.id)}
                  className="ml-2 text-xs text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <div className="mt-4 p-3 border rounded bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <strong>{selected.destination}</strong> —{" "}
                  {new Date(selected.createdAt).toLocaleString()}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  Закрыть
                </button>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: convertMarkdownToHtml(selected.recommendationText),
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

async function checkIfCity(phrase: string): Promise<boolean> {
  const res = await fetch(
    `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(phrase)}&locale=ru&type=city`
  );
  const data = await res.json();

  console.log(
    `check "${phrase}" →`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((d: any) => d.name_translations?.ru || d.name)
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.some((place: any) => {
    const lowerPhrase = phrase.toLowerCase();
    return (
      place.name.toLowerCase().includes(lowerPhrase) || // "New York"
      (place.name_translations?.ru ?? "").toLowerCase().includes(lowerPhrase) || // "Нью-Йорк"
      (place.name_translations?.en ?? "").toLowerCase().includes(lowerPhrase)
    );
  });
}

async function extractCitiesFromTripTitle(title: string): Promise<string[]> {
  const words = title
    .split(/\s+/)
    .map((w) => w.replace(/[.,;–><]/g, "").trim())
    .filter((w) => w.length > 1);

  const phrases = new Set<string>();

  for (let i = 0; i < words.length; i++) {
    phrases.add(words[i]);
    if (i + 1 < words.length) phrases.add(`${words[i]} ${words[i + 1]}`);
    if (i + 2 < words.length)
      phrases.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  const checks = await Promise.all(
    Array.from(phrases).map(async (phrase) => {
      const isCity = await checkIfCity(phrase);
      return isCity ? phrase : null;
    })
  );

  return checks.filter((x): x is string => x !== null);
}
