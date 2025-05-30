import React, { useEffect, useState, useRef } from "react";

interface Props {
  tripId: number;
  tripTitle: string;
}

export default function TripBooking({ tripId, tripTitle }: Props) {
  const [isFlight, setIsFlight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [hotelData, setHotelData] = useState({
    hotelName: "",
    checkIn: "",
    checkOut: "",
    price: 0,
  });

  const [flightData, setFlightData] = useState({
    from: "",
    to: "",
    departureDate: "",
    airline: "",
    price: 0,
  });
  const [cityQuery, setCityQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HotelSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hotelSearchSubmitted, setHotelSearchSubmitted] = useState(false);
  const [hotelSelected, setHotelSelected] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [flightSearch, setFlightSearch] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);
  const [flightSearchSubmitted, setFlightSearchSubmitted] = useState(false);
  const [flightSelected, setFlightSelected] = useState(false);

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    extractCitiesFromTripTitle(tripTitle).then(setAvailableCities);
  }, [tripTitle]);

  interface HotelSearchResult {
    hotelId: string;
    hotelName: string;
    priceFrom: number;
    stars: number;
  }

  interface FlightResult {
    from: string;
    to: string;
    departureAt: string;
    airline: string;
    price: number;
  }

  const diffInDays = Math.max(
    Math.ceil(
      (new Date(hotelData.checkOut).getTime() -
        new Date(hotelData.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    ),
    1
  );

  const pluralizeNights = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return "ночь";
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
      return "ночи";
    return "ночей";
  };

  async function searchHotels() {
    if (!cityQuery.trim() || !hotelData.checkIn || !hotelData.checkOut) {
      alert("Введите город и выберите даты для поиска отелей");
      return;
    }

    setSearchLoading(true);
    setSearchResults([]);
    setHotelSelected(false); // сброс выбора
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:5192/api/hotels/search?city=${encodeURIComponent(
          cityQuery
        )}&checkIn=${hotelData.checkIn}&checkOut=${hotelData.checkOut}`
      );

      if (!res.ok) throw new Error("Ошибка при загрузке отелей");

      const data = await res.json();
      setSearchResults(data);

      if (data.length > 0) {
        setHotelSearchSubmitted(true);
      } else {
        alert("Отели не найдены. Попробуйте другой город или дату.");
      }
    } catch (err) {
      console.error("Ошибка при поиске отелей:", err);
      alert("Ошибка при поиске отелей");
    } finally {
      setSearchLoading(false);
    }
  }

  async function searchFlights() {
    if (!flightSearch.from || !flightSearch.to || !flightSearch.date) {
      alert("Пожалуйста, заполните все поля для поиска");
      return;
    }

    try {
      setSearchLoading(true);
      setFlightResults([]);
      setFlightSelected(false);
      setMessage("");

      console.log("Запрос:", flightSearch);
      const res = await fetch(
        `http://localhost:5192/api/flights/search?from=${encodeURIComponent(flightSearch.from)}&to=${encodeURIComponent(flightSearch.to)}&date=${flightSearch.date}`
      );

      if (!res.ok) throw new Error("Ошибка при загрузке билетов");

      const data = await res.json();
      console.log("Ответ от API:", data);
      setFlightResults(data);
      setFlightSearchSubmitted(true);
    } catch (err) {
      console.error("Ошибка при поиске билетов:", err);
      alert("Произошла ошибка при поиске билетов");
    } finally {
      setSearchLoading(false);
    }
  }

  function resetFlightSearch() {
    setFlightSearch({ from: "", to: "", date: "" });
    setFlightResults([]);
    setFlightSelected(false);
    setFlightSearchSubmitted(false);
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const url = isFlight
      ? `http://localhost:5192/api/trips/${tripId}/bookings/flight`
      : `http://localhost:5192/api/trips/${tripId}/bookings/hotel`;

    const payload = isFlight ? flightData : hotelData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Ошибка при бронировании");

      setMessage("Бронирование выполнено! На Ваш email отправлено сообщение.");

      if (isFlight) {
        setFlightData({
          from: "",
          to: "",
          departureDate: "",
          airline: "",
          price: 0,
        });
      } else {
        setHotelData({ hotelName: "", checkIn: "", checkOut: "", price: 0 });
      }
    } catch (err) {
      setMessage(`Произошла ошибка при бронировании: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hotelSelected) {
      const timeout = setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [scrollTrigger]);

  useEffect(() => {
    if (flightSelected) {
      const timeout = setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [scrollTrigger, flightSelected]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("booking-flight")) {
      setIsFlight(true);
    }
  }, []);

  console.log("isFlight:", isFlight);
  return (
    <div
      className="mt-6 p-4 overflow-auto rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm relative text-gray-800 dark:text-white transition-colors"
      ref={scrollContainerRef}
    >
      <h3 className="text-lg font-semibold mb-4">Бронирование</h3>

      {/* Toggle */}
      <label className="flex items-center gap-3 cursor-pointer mb-4">
        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
          Отель
        </span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isFlight}
            onChange={() => setIsFlight(!isFlight)}
          />
          <div className="w-12 h-7 bg-gray-300 dark:bg-gray-700 rounded-full peer-checked:bg-blue-500 transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white dark:bg-gray-100 rounded-full shadow transform transition-all duration-300 ease-in-out peer-checked:translate-x-5" />
        </div>
        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
          Перелёт
        </span>
      </label>

      {/* Flip контейнер */}
      <div className="relative w-full h-auto min-h-[260px] perspective">
        <div
          className={`absolute inset-0 transition-transform duration-[800ms] ease-in-out transform-style preserve-3d ${
            isFlight ? "rotate-y-180" : ""
          }`}
        >
          {/* Отель */}
          <form
            onSubmit={handleSubmit}
            className="absolute inset-0 backface-hidden grid gap-3 overflow-hidden relative z-10"
          >
            {/* Поиск отелей по городу */}
            <div className="grid gap-2">
              <select
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                disabled={hotelSearchSubmitted || searchLoading}
                className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Выберите город</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={hotelData.checkIn}
                onChange={(e) =>
                  setHotelData({ ...hotelData, checkIn: e.target.value })
                }
                className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                disabled={hotelSearchSubmitted}
              />
              <input
                type="date"
                value={hotelData.checkOut}
                onChange={(e) =>
                  setHotelData({ ...hotelData, checkOut: e.target.value })
                }
                className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-white"
                disabled={hotelSearchSubmitted}
              />
              <button
                type="button"
                onClick={searchHotels}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                disabled={searchLoading || hotelSearchSubmitted}
              >
                {searchLoading ? "Поиск..." : "Найти отели"}
              </button>

              {hotelSearchSubmitted && (
                <button
                  type="button"
                  onClick={() => {
                    setHotelSearchSubmitted(false);
                    setSearchResults([]);
                    setHotelSelected(false);
                    setHotelData((prev) => ({
                      ...prev,
                      hotelName: "",
                      checkIn: "",
                      checkOut: "",
                    }));
                    setCityQuery("");
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition mt-2"
                >
                  Отменить поиск
                </button>
              )}
            </div>

            {/* Результаты поиска */}
            {searchResults.length > 0 && (
              <div className="mt-3 max-h-[300px] overflow-y-auto flex flex-col gap-3 pr-2">
                {searchResults.map((hotel) => (
                  <div
                    key={hotel.hotelId}
                    className="flex items-start gap-4 border rounded p-3 bg-gray-50 dark:bg-gray-700"
                  >
                    <img
                      src={`https://photo.hotellook.com/image_v2/limit/h${hotel.hotelId}/120/120.auto`}
                      alt={hotel.hotelName}
                      className="w-24 h-24 object-cover rounded border"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/120x120?text=No+Image")
                      }
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{hotel.hotelName}</div>
                      <div className="text-sm text-gray-500">
                        ⭐ {hotel.stars} | от{" "}
                        {hotel.priceFrom.toLocaleString("ru-RU")} руб. за{" "}
                        {diffInDays} {pluralizeNights(diffInDays)} /{" "}
                        {Math.round(
                          hotel.priceFrom / diffInDays
                        ).toLocaleString("ru-RU")}{" "}
                        ₽ за ночь
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHotelData({
                            ...hotelData,
                            hotelName: hotel.hotelName,
                            price: hotel.priceFrom,
                          });
                          setHotelSelected(true);
                          setScrollTrigger((prev) => prev + 1);
                        }}
                        className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Выбрать отель
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Форма бронирования — после выбора отеля */}
            {hotelSelected && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 shadow-inner space-y-4">
                <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                  Подтверждение бронирования
                </h4>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Название отеля"
                      value={hotelData.hotelName}
                      disabled
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
                    />
                  </div>

                  <input
                    type="date"
                    value={hotelData.checkIn}
                    disabled
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
                  />
                  <input
                    type="date"
                    value={hotelData.checkOut}
                    disabled
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
                  />
                  <div className="w-full px-3 py-2 rounded text-sm text-gray-800 dark:text-white flex items-center">
                    <strong>Стоимость:&nbsp;</strong>{" "}
                    {hotelData.price.toLocaleString("ru-RU")} ₽
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
                    disabled={loading}
                  >
                    {loading ? "Отправка..." : "Забронировать отель"}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Перелёт */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <form onSubmit={handleSubmit} className="grid gap-3">
              {/* Поиск билетов */}
              <div className="grid gap-2">
                <input
                  type="text"
                  placeholder="Откуда (город)"
                  value={flightSearch.from}
                  onChange={(e) =>
                    setFlightSearch({ ...flightSearch, from: e.target.value })
                  }
                  disabled={flightSearchSubmitted}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                />

                <select
                  value={flightSearch.to}
                  onChange={(e) =>
                    setFlightSearch({ ...flightSearch, to: e.target.value })
                  }
                  disabled={flightSearchSubmitted}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Куда</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={flightSearch.date}
                  onChange={(e) =>
                    setFlightSearch({ ...flightSearch, date: e.target.value })
                  }
                  disabled={flightSearchSubmitted}
                  className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                />

                <button
                  type="button"
                  onClick={searchFlights}
                  disabled={searchLoading || flightSearchSubmitted}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {searchLoading ? "Поиск..." : "Найти билеты"}
                </button>

                {flightSearchSubmitted && (
                  <button
                    type="button"
                    onClick={resetFlightSearch}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition mt-2"
                  >
                    Отменить поиск
                  </button>
                )}
              </div>

              {/* Результаты поиска */}
              {flightResults.length > 0 && (
                <div className="mt-3 max-h-[300px] overflow-y-auto flex flex-col gap-3 pr-2">
                  {flightResults.map((flight, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-1 p-3 rounded border bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="font-semibold">
                        {flight.from} → {flight.to}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        📅 {new Date(flight.departureAt).toLocaleDateString()} |
                        ✈️ {flight.airline} | 💰{" "}
                        {flight.price.toLocaleString("ru-RU")} ₽
                      </div>
                      <button
                        type="button"
                        className="mt-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => {
                          setFlightData({
                            from: flight.from,
                            to: flight.to,
                            departureDate: flight.departureAt.split("T")[0],
                            airline: flight.airline,
                            price: flight.price,
                          });
                          setFlightSelected(true);
                          setScrollTrigger((prev) => prev + 1);
                        }}
                      >
                        Выбрать перелёт
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Подтверждение перелёта */}
              {flightSelected && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 shadow-inner space-y-4">
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                    Подтверждение бронирования
                  </h4>

                  <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={`${flightData.from} → ${flightData.to}`}
                        disabled
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
                      />
                    </div>

                    <input
                      type="date"
                      value={flightData.departureDate}
                      disabled
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      value={flightData.airline}
                      disabled
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded focus:ring focus:outline-none transition-colors"
                    />
                    <div className="w-full px-3 py-2 rounded text-sm text-gray-800 dark:text-white flex items-center">
                      <strong>Стоимость:&nbsp;</strong>{" "}
                      {flightData.price.toLocaleString("ru-RU")} ₽
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded transition"
                      disabled={loading}
                    >
                      {loading ? "Отправка..." : "Забронировать перелёт"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {message && (
        <p className="mt-4 text-sm text-blue-600 dark:text-blue-400 transition-colors">
          {message}
        </p>
      )}
    </div>
  );
}

// Проверка каждого слова через API городов
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
