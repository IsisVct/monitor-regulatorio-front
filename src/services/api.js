const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5181/api";

export async function getNormativos() {
    const response = await fetch(`${API_URL}/normativos`);

    if (!response.ok) {
        throw new Error("Erro ao buscar normativos");
    }

    return response.json();
}