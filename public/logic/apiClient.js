const API_URL = "https://localhost:3000/graphql";

export const apiClient = {
  async post(body) {
    const token = localStorage.getItem("jwt_token");
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const { data, errors } = await response.json();

      if (errors) {
        console.error("Error en la respuesta de GraphQL:", errors);
        throw new Error(errors[0].message);
      }

      return data;
    } catch (error) {
      console.error("Error de comunicación con el servidor:", error);
      throw error;
    }
  }
};