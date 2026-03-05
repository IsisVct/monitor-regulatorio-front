const API_URL = "http://localhost:5181/api";

export async function getDashboard(periodo = 30, dataInicio = "", dataFim = "") {
    let url = `${API_URL}/dashboard?periodo=${periodo}`;
    if (dataInicio && dataFim) {
        url += `&dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar dashboard");
    }

    return response.json();
}