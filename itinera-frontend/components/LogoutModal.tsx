import React from "react";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-2xl w-full max-w-sm text-center animate-window-pop transition-colors duration-500">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Подтвердите выход
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Вы уверены, что хотите выйти из аккаунта?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition"
          >
            Остаться
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
