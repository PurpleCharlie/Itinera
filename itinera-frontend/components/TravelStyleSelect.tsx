import React from "react";

interface TravelStyleSelectProps {
  values: string[];
  onChange: (selected: string[]) => void;
}

const styles = [
  "Активный",
  "Расслабляющий",
  "Экскурсионный",
  "Семейный",
  "Романтический",
  "Одиночный",
];

export default function TravelStyleSelect({
  values,
  onChange,
}: TravelStyleSelectProps) {
  const toggleStyle = (style: string) => {
    if (values.includes(style)) {
      onChange(values.filter((s) => s !== style));
    } else {
      onChange([...values, style]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm mb-1">Стили путешествия</label>
      <div className="flex flex-wrap gap-2">
        {styles.map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => toggleStyle(style)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              values.includes(style)
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-white border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
