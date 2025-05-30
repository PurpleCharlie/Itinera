import React, { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle"; // путь при необходимости скорректируй
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`
        h-screen w-full flex items-center justify-center
        transition-colors duration-700
        ${
          isRegister
            ? "bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800"
            : "bg-gradient-to-br from-gray-100 to-slate-300 dark:from-gray-800 dark:to-gray-700"
        }
        text-gray-800 dark:text-white
      `}
    >
      {/* Переключатель темы */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Переключатель Вход / Регистрация */}
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
            Вход
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isRegister}
              onChange={() => setIsRegister(!isRegister)}
            />
            <div className="w-12 h-7 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-green-400 peer-checked:to-emerald-500 transition-colors duration-300 shadow-inner" />
            <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out peer-checked:translate-x-5" />
          </div>
          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">
            Регистрация
          </span>
        </label>

        {/* Flip-карточка */}
        <div
          className={`relative w-96 h-[380px] perspective transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className={`absolute inset-0 transition-transform duration-700 transform-style preserve-3d ${
              isRegister ? "rotate-y-180" : ""
            }`}
          >
            {/* Вход */}
            <div className="absolute inset-0 backface-hidden p-6 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 flex flex-col justify-center shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-shadow duration-500">
              <AnimatedTitle show={!isRegister} text="Вход" />
              <LoginForm />
            </div>

            {/* Регистрация */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 rounded-xl border border-blue-100 dark:border-emerald-600 bg-sky-50 dark:bg-gray-800 flex flex-col justify-center shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-shadow duration-500">
              <AnimatedTitle show={isRegister} text="Регистрация" />
              <RegisterForm onRegistered={() => setIsRegister(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Заголовок с анимацией появления
function AnimatedTitle({ show, text }: { show: boolean; text: string }) {
  return (
    <h2
      className={`
        text-2xl font-semibold text-center mb-4 transition-opacity duration-500
        ${show ? "opacity-100" : "opacity-0"}
      `}
    >
      {text}
    </h2>
  );
}
