import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import InterestSelect from "../components/InterestSelect";
import TravelStyleSelect from "../components/TravelStyleSelect";
import { fetchWithAuth } from "../src/utils/fetchWithAuth";

interface ProfileData {
  username: string;
  currentCity?: string;
  interests?: string;
  travelStyle?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    username: "",
    currentCity: "",
    interests: "",
    travelStyle: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:5192/api/profile/me"
        );
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const check = async () => {
      await fetchWithAuth("http://localhost:5192/api/profile/me");
    };

    check();
  }, [isEditing]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5192/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      console.error("Ошибка загрузки профиля", err);
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5192/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setProfile(formData);
        setIsEditing(false);
      } else {
        console.error("Ошибка при сохранении");
      }
    } catch (err) {
      console.error("Ошибка запроса", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 relative text-gray-800 dark:text-white transition-colors duration-500">
      {/* Переключатель темы */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Тумблер режима */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-gray-700 dark:text-gray-300">
          Просмотр
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isEditing}
              onChange={() => setIsEditing(!isEditing)}
            />
            <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-blue-400 peer-checked:to-blue-600 transition-colors"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-6 transition-transform"></div>
          </div>
          Редактирование
        </label>
      </div>

      {/* Блок с профилем */}
      <div className="animate-window-pop w-full max-w-xl relative perspective z-10">
        <div
          className={`relative w-full h-[440px] transition-transform duration-700 preserve-3d ${
            isEditing ? "rotate-y-180" : ""
          }`}
        >
          {/* FRONT - просмотр */}
          <div className="absolute inset-0 backface-hidden">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-300 dark:border-slate-700 min-h-[520px] max-h-[95vh] overflow-y-auto flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-6">👤 Профиль</h2>

                <div className="mb-4">
                  <p className="font-semibold text-sm text-slate-400 mb-1">
                    Никнейм
                  </p>
                  <p className="text-lg">{profile?.username}</p>
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-sm text-slate-400 mb-1">
                    Текущий город
                  </p>
                  <p className="text-lg">{profile?.currentCity || "—"}</p>
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-sm text-slate-400 mb-1">
                    Интересы
                  </p>
                  {profile?.interests ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.interests.split(",").map((interest, i) => (
                        <span
                          key={i}
                          className="bg-slate-200 dark:bg-slate-700 text-sm px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-gray-800 dark:text-white"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                      Интересы не указаны
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-sm text-slate-400 mb-1">
                    Стили путешествия
                  </p>
                  {profile?.travelStyle ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.travelStyle.split(",").map((style, i) => (
                        <span
                          key={i}
                          className="bg-slate-200 dark:bg-slate-700 text-sm px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-gray-800 dark:text-white"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                      Стиль не указан
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/trip")}
                  className="inline-block px-6 py-3 text-base font-semibold rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
                >
                  Назад к поездкам
                </button>
              </div>
            </div>
          </div>

          {/* BACK - редактирование */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-xl border border-slate-300 dark:border-slate-700 min-h-[520px] max-h-[95vh] overflow-y-auto flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4">✏️ Редактирование</h2>

                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfile();
                  }}
                >
                  <input
                    className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-white"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                  <input
                    className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-white"
                    placeholder="Текущий город"
                    value={formData.currentCity}
                    onChange={(e) =>
                      setFormData({ ...formData, currentCity: e.target.value })
                    }
                  />
                  <InterestSelect
                    values={
                      formData.interests ? formData.interests.split(",") : []
                    }
                    onChange={(newInterests) =>
                      setFormData({
                        ...formData,
                        interests: newInterests.join(","),
                      })
                    }
                  />
                  <TravelStyleSelect
                    values={
                      formData.travelStyle
                        ? formData.travelStyle.split(",")
                        : []
                    }
                    onChange={(selectedStyles) =>
                      setFormData({
                        ...formData,
                        travelStyle: selectedStyles.join(","),
                      })
                    }
                  />
                </form>
              </div>

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  onClick={saveProfile}
                  className="inline-block px-6 py-3 text-base font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                >
                  💾 Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
