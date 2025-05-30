export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const token = localStorage.getItem("accessToken");

  const headers = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    // Токен недействителен или истёк
    localStorage.removeItem("accessToken");
    window.location.href = "/auth";
    throw new Error("Неавторизован. Перенаправление на вход.");
  }

  return response;
}
