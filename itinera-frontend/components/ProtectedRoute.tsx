import { type JSX } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const token = localStorage.getItem("accessToken");

  // Если токена нет — редирект на /auth
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Иначе рендерим защищённый компонент
  return children;
}
