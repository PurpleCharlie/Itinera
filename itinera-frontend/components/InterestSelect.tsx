import React from "react";

interface InterestSelectProps {
  values: string[];
  onChange: (selected: string[]) => void;
}

const interests = [
  "Аниме",
  "История",
  "Природа",
  "Гастротуризм",
  "Фотография",
  "Спорт",
  "Музеи",
  "Ночные клубы",
  "Архитектура",
  "Культура",
  "Море",
  "Экстрим",
  "Шоппинг",
  "Музыка",
  "Горы",
  "Пляжи",
];

export default function InterestSelect({
  values,
  onChange,
}: InterestSelectProps) {
  const toggleInterest = (interest: string) => {
    if (values.includes(interest)) {
      onChange(values.filter((i) => i !== interest));
    } else {
      onChange([...values, interest]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm mb-1">Интересы</label>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => toggleInterest(interest)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              values.includes(interest)
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-white border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
}
