import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";

export default function Dashboard() {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [periodo, setPeriodo] = useState(30);
    const [fonteSelecionada, setFonteSelecionada] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    // Carregar dados do backend
    useEffect(() => {
        async function carregar() {
            setLoading(true);
            try {
                const data = await getDashboard(periodo, dataInicio, dataFim);
                setDados(data);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [periodo, fonteSelecionada, dataInicio, dataFim]);

    if (loading) return <div className="p-10 text-center">Carregando dashboard...</div>;
    if (!dados) return <div className="p-10 text-center text-red-500">Nenhum dado disponível.</div>;

    // Filtrar por fonte
    const dadosPorFonte = fonteSelecionada
        ? dados.porFonte.filter((f) => f.fonte === fonteSelecionada)
        : dados.porFonte;

    // Exportar PDF
    function exportarPDF() {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Relatório Dashboard Monitor Regulatório", 20, 20);
        doc.setFontSize(12);
        doc.text(`Total de Normativos: ${dados.total}`, 20, 30);

        let y = 40;
        dadosPorFonte.forEach((item) => {
            doc.text(`${item.fonte}: ${item.quantidade}`, 20, y);
            y += 10;
        });

        doc.save("dashboard.pdf");
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="border rounded-xl px-4 py-2"
                    placeholder="Data início"
                />
                <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="border rounded-xl px-4 py-2"
                    placeholder="Data fim"
                />

                <select
                    value={fonteSelecionada}
                    onChange={(e) => setFonteSelecionada(e.target.value)}
                    className="border rounded-xl px-4 py-2"
                >
                    <option value="">Todas as fontes</option>
                    {dados.porFonte.map((f, i) => (
                        <option key={i} value={f.fonte}>{f.fonte}</option>
                    ))}
                </select>

                <button
                    onClick={exportarPDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    Exportar PDF
                </button>
            </div>

            {/* Métricas gerais */}
            <div className="mb-6">
                <p className="text-lg font-semibold">Total de Normativos: {dados.total}</p>
            </div>

            {/* Gráfico por Fonte */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Normativos por Fonte</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosPorFonte}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fonte" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantidade" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico ou lista por Data */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-4">Normativos por Data</h2>
                <ul className="space-y-2">
                    {dados.porData.map((d, i) => (
                        <li key={i} className="border-b py-1">
                            {d.data}: {d.quantidade}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}