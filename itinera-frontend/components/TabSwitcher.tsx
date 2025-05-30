import React, { useState } from "react";
import TripTasks from "./TripTasks";
import TripRoutePoints from "./TripRoutePoints";
import TripBooking from "./TripBooking";
import TripRecommendation from "./TripRecommendation";

interface Props {
  tripId: number;
  tripTitle: string;
}

const tabs = [
  { id: "tasks", label: "Задачи" },
  { id: "route", label: "Маршрут" },
  { id: "booking", label: "Бронирование" },
  { id: "ai", label: "Рекомендации" },
];

export default function TripTabs({ tripId, tripTitle }: Props) {
  const [activeTab, setActiveTab] = useState("tasks");

  function renderTabContent() {
    switch (activeTab) {
      case "tasks":
        return <TripTasks tripId={tripId} />;
      case "route":
        return <TripRoutePoints tripId={tripId} />;
      case "booking":
        return <TripBooking tripId={tripId} tripTitle={tripTitle} />;
      case "ai":
        return <TripRecommendation tripId={tripId} tripTitle={tripTitle} />;
      default:
        return null;
    }
  }

  return (
    <div className="mt-6">
      {/* Кнопки переключения вкладок */}
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Анимированное содержимое вкладки */}
      <div
        key={activeTab}
        className="animate-fade-slide-in transition-all duration-500 ease-in-out"
      >
        {renderTabContent()}
      </div>
    </div>
  );
}
