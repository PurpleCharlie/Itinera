import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function ForceResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // немного позже, чтобы DOM успел отрендериться
  }, [map]);

  return null;
}
