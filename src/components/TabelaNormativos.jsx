import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function TabelaNormativos() {
    const [dados, setDados] = useState([]);

    useEffect(() => {
        api.get("/normativos")
            .then(res => setDados(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Monitor Regulatório</h2>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Fonte</th>
                        <th>Categoria</th>
                        <th>Título</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map(item => (
                        <tr key={item.id}>
                            <td>{item.dataPublicacao?.split("T")[0]}</td>
                            <td>{item.fonte}</td>
                            <td>{item.categoria}</td>
                            <td>{item.titulo}</td>
                            <td>
                                <a href={item.link} target="_blank">
                                    Acessar
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}