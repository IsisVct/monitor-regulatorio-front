import { useEffect, useMemo, useState } from "react";
import { getNormativos } from "../services/api";
import * as XLSX from "xlsx";

const ITENS_POR_PAGINA = 12;

function getCategoriaConfig(cat, dark) {
    const configs = {
        "Audiência Pública": { color: "#B45309", bg: dark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.1)", border: dark ? "rgba(245,158,11,0.3)" : "rgba(180,83,9,0.2)" },
        "Normativo": { color: "#047857", bg: dark ? "rgba(16,185,129,0.12)" : "rgba(5,150,105,0.08)", border: dark ? "rgba(16,185,129,0.3)" : "rgba(4,120,87,0.2)" },
        "Notícia": { color: "#1D4ED8", bg: dark ? "rgba(96,165,250,0.12)" : "rgba(59,130,246,0.08)", border: dark ? "rgba(96,165,250,0.3)" : "rgba(29,78,216,0.2)" },
        "Educação Profissional": { color: "#6D28D9", bg: dark ? "rgba(167,139,250,0.12)" : "rgba(124,58,237,0.08)", border: dark ? "rgba(167,139,250,0.3)" : "rgba(109,40,217,0.2)" },
    };
    return configs[cat] || { color: dark ? "#94A3B8" : "#64748B", bg: dark ? "rgba(148,163,184,0.1)" : "rgba(100,116,139,0.07)", border: dark ? "rgba(148,163,184,0.3)" : "rgba(100,116,139,0.2)" };
}

function getFonteColor(fonte, dark) {
    const colors = {
        "BACEN": dark ? "#F59E0B" : "#B45309",
        "CVM": dark ? "#10B981" : "#047857",
        "IASB/ISSB": dark ? "#60A5FA" : "#1D4ED8",
        "CPC": dark ? "#F97316" : "#C2410C",
        "CFC": dark ? "#A78BFA" : "#6D28D9",
    };
    return colors[fonte] || (dark ? "#94A3B8" : "#64748B");
}

function isNovo(dataStr) {
    return (new Date() - new Date(dataStr)) / (1000 * 60 * 60) <= 24;
}

function Modal({ normativo, onClose, dark }) {
    if (!normativo) return null;
    const cat = getCategoriaConfig(normativo.categoria, dark);
    const fonteColor = getFonteColor(normativo.fonte, dark);

    const bg = dark ? "#111827" : "#FFFFFF";
    const text = dark ? "#F1F5F9" : "#0F172A";
    const subtext = dark ? "#94A3B8" : "#475569";
    const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    const closeBg = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
    const closeColor = dark ? "#64748B" : "#94A3B8";
    const divider = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const dateColor = dark ? "#475569" : "#94A3B8";
    const linkColor = dark ? "#60A5FA" : "#2563EB";
    const shadow = dark ? "0 32px 80px rgba(0,0,0,0.6)" : "0 32px 80px rgba(0,0,0,0.15)";
    const overlayBg = dark ? "rgba(0,0,0,0.75)" : "rgba(15,23,42,0.5)";

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: overlayBg,
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "16px",
                animation: "fadeIn 0.15s ease",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: "20px",
                    maxWidth: "580px", width: "100%",
                    padding: "36px",
                    position: "relative",
                    boxShadow: shadow,
                    animation: "slideUp 0.2s ease",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: "20px", right: "20px",
                        background: closeBg, border: "none",
                        color: closeColor, width: "34px", height: "34px",
                        borderRadius: "10px", cursor: "pointer", fontSize: "16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"; e.currentTarget.style.color = text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = closeBg; e.currentTarget.style.color = closeColor; }}
                >✕</button>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px", paddingRight: "40px" }}>
                    <span style={{
                        fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
                        textTransform: "uppercase", padding: "4px 10px", borderRadius: "6px",
                        color: fonteColor, background: `${fonteColor}18`, border: `1px solid ${fonteColor}35`,
                        fontFamily: "Arial, monospace",
                    }}>{normativo.fonte}</span>
                    {normativo.categoria && (
                        <span style={{
                            fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
                            textTransform: "uppercase", padding: "4px 10px", borderRadius: "6px",
                            color: cat.color, background: cat.bg, border: `1px solid ${cat.border}`,
                            fontFamily: "Arial, monospace",
                        }}>{normativo.categoria}</span>
                    )}
                    {isNovo(normativo.data) && (
                        <span style={{
                            fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
                            textTransform: "uppercase", padding: "4px 10px", borderRadius: "6px",
                            color: "#fff", background: "#EF4444", border: "1px solid #EF4444",
                            fontFamily: "Arial, monospace",
                            animation: "pulse 2s infinite",
                        }}>● NOVO</span>
                    )}
                </div>

                <div style={{ height: "1px", background: divider, marginBottom: "20px" }} />

                <h2 style={{
                    fontSize: "20px", fontWeight: "700", color: text,
                    lineHeight: "1.4", marginBottom: "14px",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                }}>{normativo.titulo}</h2>

                <p style={{
                    fontSize: "14px", color: subtext, lineHeight: "1.75",
                    marginBottom: "28px",
                }}>{normativo.descricao}</p>

                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    paddingTop: "20px", borderTop: `1px solid ${divider}`,
                    flexWrap: "wrap", gap: "12px",
                }}>
                    <span style={{ fontSize: "12px", color: dateColor, fontFamily: "Arial, monospace" }}>
                        {new Date(normativo.data).toLocaleDateString("pt-BR")}
                    </span>
                    {normativo.link && (
                        <a href={normativo.link} target="_blank" rel="noreferrer" style={{
                            fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em",
                            textTransform: "uppercase", color: linkColor,
                            textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
                            fontFamily: "Arial, monospace",
                            transition: "color 0.15s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = dark ? "#93C5FD" : "#1D4ED8"}
                            onMouseLeave={e => e.currentTarget.style.color = linkColor}
                        >
                            Acessar Documento
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatBadge({ label, value, color, dark }) {
    const bg = dark ? "rgba(255,255,255,0.04)" : "#FFFFFF";
    const border = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const labelColor = dark ? "#64748B" : "#94A3B8";
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "14px 20px",
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: "12px", minWidth: "80px",
            flexShrink: 0,
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "default",
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = dark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
            <span style={{ fontSize: "22px", fontWeight: "700", color: color, fontFamily: "Arial, monospace", letterSpacing: "-0.02em" }}>{value}</span>
            <span style={{ fontSize: "10px", color: labelColor, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "3px", fontFamily: "Arial, monospace" }}>{label}</span>
        </div>
    );
}

export default function Home() {
    const [normativos, setNormativos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [fonte, setFonte] = useState("");
    const [categoria, setCategoria] = useState("");
    const [ordenacao, setOrdenacao] = useState("recente");
    const [pagina, setPagina] = useState(1);
    const [modalItem, setModalItem] = useState(null);
    const [buscaFocused, setBuscaFocused] = useState(false);
    const [dark, setDark] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getNormativos();
                setNormativos(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const stats = useMemo(() => {
        const fontes = {};
        const cats = {};
        normativos.forEach(n => {
            fontes[n.fonte] = (fontes[n.fonte] || 0) + 1;
            if (n.categoria) cats[n.categoria] = (cats[n.categoria] || 0) + 1;
        });
        return { total: normativos.length, fontes, cats };
    }, [normativos]);

    const filtered = useMemo(() => {
        let result = normativos.filter((n) => {
            const matchBusca = !busca || n.titulo?.toLowerCase().includes(busca.toLowerCase()) || n.descricao?.toLowerCase().includes(busca.toLowerCase());
            const matchFonte = !fonte || n.fonte === fonte;
            const matchCategoria = !categoria || n.categoria === categoria;
            return matchBusca && matchFonte && matchCategoria;
        });
        if (ordenacao === "recente") result = [...result].sort((a, b) => new Date(b.data) - new Date(a.data));
        if (ordenacao === "antigo") result = [...result].sort((a, b) => new Date(a.data) - new Date(b.data));
        if (ordenacao === "fonte") result = [...result].sort((a, b) => a.fonte.localeCompare(b.fonte));
        return result;
    }, [busca, fonte, categoria, ordenacao, normativos]);

    useEffect(() => { setPagina(1); }, [busca, fonte, categoria, ordenacao]);

    const totalPaginas = Math.ceil(filtered.length / ITENS_POR_PAGINA);
    const paginados = filtered.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA);
    const novosHoje = useMemo(() => normativos.filter(n => isNovo(n.data)).length, [normativos]);

    const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
        .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
        }, []);

    const exportarExcel = () => {
        const dados = filtered.map((n) => ({
            Título: n.titulo, Fonte: n.fonte, Categoria: n.categoria,
            Descrição: n.descricao, Data: new Date(n.data).toLocaleDateString("pt-BR"), Link: n.link,
        }));
        const ws = XLSX.utils.json_to_sheet(dados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Normativos");
        XLSX.writeFile(wb, `monitor-regulatorio-${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const t = {
        bg: dark ? "#0B1120" : "#F1F5F9",
        surface: dark ? "#111827" : "#FFFFFF",
        surfaceAlt: dark ? "#0F1A2E" : "#F8FAFC",
        border: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        borderFocus: dark ? "rgba(96,165,250,0.5)" : "rgba(37,99,235,0.4)",
        text: dark ? "#F1F5F9" : "#0F172A",
        textSub: dark ? "#94A3B8" : "#475569",
        textMuted: dark ? "#475569" : "#94A3B8",
        headerBg: dark ? "rgba(11,17,32,0.95)" : "rgba(255,255,255,0.95)",
        inputBg: dark ? "rgba(8,14,28,0.85)" : "rgba(255,255,255,0.92)",
        scrollTrack: dark ? "#0B1120" : "#E2E8F0",
        scrollThumb: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)",
        selectBg: dark ? "rgba(15,26,46,0.9)" : "rgba(255,255,255,0.92)",
        accent: dark ? "#60A5FA" : "#2563EB",
        accentHover: dark ? "#93C5FD" : "#1D4ED8",
        cardHoverBorder: dark ? "rgba(96,165,250,0.2)" : "rgba(37,99,235,0.15)",
        shadow: dark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.06)",
        shadowHover: dark ? "0 12px 40px rgba(0,0,0,0.5)" : "0 12px 40px rgba(0,0,0,0.12)",
        paginationActiveBg: dark ? "linear-gradient(135deg, #3B82F6, #06B6D4)" : "linear-gradient(135deg, #2563EB, #0EA5E9)",
    };

    const getSelectStyle = (value) => {
        const hasValue = !!value;
        const activeColor = dark ? "#60A5FA" : "#2563EB";
        return {
            backgroundColor: hasValue
                ? (dark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.07)")
                : (dark ? "rgba(15,26,46,0.9)" : "#FFFFFF"),
            border: hasValue
                ? `1px solid ${dark ? "rgba(96,165,250,0.45)" : "rgba(37,99,235,0.35)"}`
                : `1px solid ${t.border}`,
            borderRadius: "10px",
            padding: "10px 14px",
            color: hasValue ? activeColor : t.textSub,
            fontSize: "13px",
            fontWeight: hasValue ? "600" : "400",
            cursor: "pointer",
            outline: "none",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            appearance: "none",
            WebkitAppearance: "none",
            minWidth: isMobile ? "0" : "160px",
            width: isMobile ? "100%" : "auto",
            transition: "all 0.2s",
            boxShadow: hasValue
                ? (dark ? "0 0 0 3px rgba(96,165,250,0.1)" : "0 0 0 3px rgba(37,99,235,0.08)")
                : (dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)"),
        };
    };

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh", background: t.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: "16px",
            }}>
                <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    border: `3px solid ${dark ? "rgba(96,165,250,0.15)" : "rgba(37,99,235,0.12)"}`,
                    borderTopColor: t.accent,
                    animation: "spin 0.8s linear infinite",
                }} />
                <span style={{ color: t.textMuted, fontSize: "12px", fontFamily: "Arial, monospace", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Carregando Monitor...
                </span>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    const px = isMobile ? "16px" : "40px";

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Geist+Mono:wght@400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: ${t.bg}; transition: background 0.3s; }
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes spin    { to { transform: rotate(360deg) } }
                @keyframes pulse   { 0%,100% { opacity: 1 } 50% { opacity: 0.55 } }
                @keyframes cardIn  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
                .card-grid > div { animation: cardIn 0.3s ease both; }
                ${Array.from({ length: 12 }, (_, i) => `.card-grid > div:nth-child(${i + 1}) { animation-delay: ${i * 0.04}s }`).join('\n')}
                ::-webkit-scrollbar { width: 6px; height: 4px; }
                ::-webkit-scrollbar-track { background: ${t.scrollTrack}; }
                ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 3px; }
                select option { background: ${dark ? "#0f1a2e" : "#fff"}; color: ${t.textSub}; font-family: Arial, monospace; }
                select:focus { border-color: ${t.borderFocus} !important; box-shadow: 0 0 0 3px ${dark ? "rgba(96,165,250,0.1)" : "rgba(37,99,235,0.08)"} !important; }
                input::placeholder { color: ${t.textMuted}; }
            `}</style>

            <Modal normativo={modalItem} onClose={() => setModalItem(null)} dark={dark} />

            <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Bricolage Grotesque', sans-serif", transition: "background 0.3s, color 0.3s", color: t.text }}>

                {/* HEADER */}
                <header style={{
                    background: t.headerBg,
                    backdropFilter: "blur(14px)",
                    borderBottom: `1px solid ${t.border}`,
                    padding: `0 ${px}`,
                    height: "66px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "sticky", top: 0, zIndex: 100,
                    boxShadow: dark ? "none" : "0 1px 12px rgba(0,0,0,0.06)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                            width: "34px", height: "34px", borderRadius: "10px",
                            background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                        }}>
                            <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                                <path d="M2 12L6 6L9 9L12 4L14 6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontSize: isMobile ? "13px" : "15px", fontWeight: "700", color: t.text, letterSpacing: "-0.02em" }}>
                                Monitor Regulatório
                            </div>
                            {!isMobile && (
                                <div style={{ fontSize: "10px", color: t.textMuted, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Arial, monospace" }}>
                                    BACEN · CVM · IASB · CPC · CFC
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop actions */}
                    {!isMobile ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {novosHoje > 0 && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "6px",
                                    padding: "6px 12px", borderRadius: "8px",
                                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                }}>
                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444", animation: "pulse 2s infinite" }} />
                                    <span style={{ fontSize: "12px", color: "#EF4444", fontWeight: "600", fontFamily: "Arial, monospace" }}>
                                        {novosHoje} novo{novosHoje > 1 ? "s" : ""} hoje
                                    </span>
                                </div>
                            )}
                            <div style={{ padding: "6px 14px", borderRadius: "8px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${t.border}` }}>
                                <span style={{ fontSize: "13px", color: t.textSub, fontFamily: "Arial, monospace" }}>
                                    <span style={{ color: t.text, fontWeight: "600" }}>{filtered.length}</span> resultados
                                </span>
                            </div>
                            <button onClick={exportarExcel} style={{ background: "linear-gradient(135deg, #059669, #10B981)", border: "none", borderRadius: "9px", padding: "8px 16px", cursor: "pointer", color: "#fff", fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Arial, monospace", transition: "opacity 0.15s, transform 0.15s", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}
                                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M1 9v1a1 1 0 001 1h8a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Exportar
                            </button>
                            <button onClick={() => setDark(!dark)} title={dark ? "Modo claro" : "Modo escuro"} style={{ width: "38px", height: "38px", borderRadius: "10px", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: t.textSub, flexShrink: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"; }}>
                                {dark ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                ) : (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                )}
                            </button>
                        </div>
                    ) : (
                        /* Mobile actions */
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {novosHoje > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "6px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#EF4444", animation: "pulse 2s infinite" }} />
                                    <span style={{ fontSize: "11px", color: "#EF4444", fontWeight: "600", fontFamily: "Arial, monospace" }}>{novosHoje}</span>
                                </div>
                            )}
                            <button onClick={() => setDark(!dark)} style={{ width: "34px", height: "34px", borderRadius: "9px", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {dark
                                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.textSub} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.textSub} strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                                }
                            </button>
                            <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: "34px", height: "34px", borderRadius: "9px", background: menuOpen ? (dark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.1)") : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), border: `1px solid ${menuOpen ? t.accent : t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={menuOpen ? t.accent : t.textSub} strokeWidth="1.8" strokeLinecap="round">
                                    {menuOpen ? <><path d="M2 2l12 12M14 2L2 14" /></> : <><path d="M2 4h12M2 8h12M2 12h12" /></>}
                                </svg>
                            </button>
                        </div>
                    )}
                </header>

                {/* MOBILE MENU DROPDOWN */}
                {isMobile && menuOpen && (
                    <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: "14px 16px", animation: "slideDown 0.2s ease", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: t.textSub, fontFamily: "Arial, monospace" }}>
                            <span style={{ color: t.text, fontWeight: "700" }}>{filtered.length}</span> resultados
                        </span>
                        <button onClick={exportarExcel} style={{ background: "linear-gradient(135deg, #059669, #10B981)", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#fff", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Arial, monospace", letterSpacing: "0.06em", textTransform: "uppercase", boxShadow: "0 3px 10px rgba(16,185,129,0.3)" }}>
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 5l3 3 3-3M1 9v1a1 1 0 001 1h8a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Exportar
                        </button>
                    </div>
                )}

                <div style={{ padding: isMobile ? "20px 16px" : "32px 40px" }}>

                    {/* STATS ROW — scroll horizontal no mobile */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "28px", overflowX: "auto", paddingBottom: "4px", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
                        <StatBadge label="Total" value={stats.total} color={t.text} dark={dark} />
                        <StatBadge label="BACEN" value={stats.fontes["BACEN"] || 0} color={dark ? "#F59E0B" : "#B45309"} dark={dark} />
                        <StatBadge label="CVM" value={stats.fontes["CVM"] || 0} color={dark ? "#10B981" : "#047857"} dark={dark} />
                        <StatBadge label="IASB/ISSB" value={stats.fontes["IASB/ISSB"] || 0} color={dark ? "#60A5FA" : "#1D4ED8"} dark={dark} />
                        <StatBadge label="CPC" value={stats.fontes["CPC"] || 0} color={dark ? "#F97316" : "#C2410C"} dark={dark} />
                        <StatBadge label="CFC" value={stats.fontes["CFC"] || 0} color={dark ? "#A78BFA" : "#6D28D9"} dark={dark} />
                        {!isMobile && <div style={{ flex: 1 }} />}
                        <StatBadge label="Audiências" value={stats.cats["Audiência Pública"] || 0} color={dark ? "#F59E0B" : "#B45309"} dark={dark} />
                        <StatBadge label="Normativos" value={stats.cats["Normativo"] || 0} color={dark ? "#10B981" : "#047857"} dark={dark} />
                        <StatBadge label="Notícias" value={stats.cats["Notícia"] || 0} color={dark ? "#60A5FA" : "#1D4ED8"} dark={dark} />
                    </div>

                    {/* FILTERS */}
                    <div style={{
                        backgroundColor: dark ? "rgba(15,22,35,0.95)" : "rgba(248,250,252,0.98)",
                        backgroundImage: dark
                            ? "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, transparent 50%, rgba(14,165,233,0.06) 100%)"
                            : "linear-gradient(135deg, rgba(37,99,235,0.05) 0%, transparent 50%, rgba(14,165,233,0.04) 100%)",
                        border: `1px solid ${dark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.12)"}`,
                        borderRadius: "18px", padding: "18px 20px",
                        display: "flex", gap: "12px", flexWrap: "wrap",
                        marginBottom: "24px",
                        boxShadow: dark
                            ? "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)"
                            : "0 4px 20px rgba(37,99,235,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                        alignItems: "center",
                        backdropFilter: "blur(8px)",
                    }}>
                        {/* Search */}
                        <div style={{ flex: 1, minWidth: isMobile ? "100%" : "240px", position: "relative" }}>
                            <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                                width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="6" cy="6" r="4.5" stroke={t.textMuted} strokeWidth="1.5" />
                                <path d="M10 10L12.5 12.5" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar por título ou descrição..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                onFocus={() => setBuscaFocused(true)}
                                onBlur={() => setBuscaFocused(false)}
                                style={{
                                    width: "100%",
                                    background: t.inputBg,
                                    border: `1px solid ${buscaFocused ? t.borderFocus : t.border}`,
                                    borderRadius: "10px",
                                    padding: "10px 16px 10px 38px",
                                    color: t.text, fontSize: "13px", outline: "none",
                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                    transition: "border-color 0.15s, box-shadow 0.15s",
                                    backdropFilter: "blur(4px)",
                                    boxShadow: buscaFocused
                                        ? `0 0 0 3px ${dark ? "rgba(96,165,250,0.1)" : "rgba(37,99,235,0.08)"}`
                                        : (dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)"),
                                }}
                            />
                            {busca && (
                                <button onClick={() => setBusca("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: "14px", padding: "2px 4px", borderRadius: "4px" }}>✕</button>
                            )}
                        </div>

                        <select value={fonte} onChange={(e) => setFonte(e.target.value)} style={getSelectStyle(fonte)}>
                            <option value="">Todas as Fontes</option>
                            <option value="BACEN">BACEN</option>
                            <option value="CVM">CVM</option>
                            <option value="IASB/ISSB">IASB/ISSB</option>
                            <option value="CPC">CPC</option>
                            <option value="CFC">CFC</option>
                        </select>

                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={getSelectStyle(categoria)}>
                            <option value="">Todas Categorias</option>
                            <option value="Audiência Pública">Audiência Pública</option>
                            <option value="Normativo">Normativo</option>
                            <option value="Notícia">Notícia</option>
                        </select>

                        <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} style={getSelectStyle("")}>
                            <option value="recente">Mais recente</option>
                            <option value="antigo">Mais antigo</option>
                            <option value="fonte">Por fonte</option>
                        </select>

                        {(busca || fonte || categoria) && (
                            <button
                                onClick={() => { setBusca(""); setFonte(""); setCategoria(""); }}
                                style={{
                                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)",
                                    borderRadius: "10px", padding: "10px 16px", cursor: "pointer",
                                    color: "#EF4444", fontSize: "12px", fontWeight: "600",
                                    fontFamily: "Arial, monospace", letterSpacing: "0.06em",
                                    transition: "all 0.15s", whiteSpace: "nowrap",
                                    display: "flex", alignItems: "center", gap: "6px",
                                    width: isMobile ? "100%" : "auto", justifyContent: "center",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.14)"}
                                onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                            >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Limpar filtros
                            </button>
                        )}
                    </div>

                    {/* GRID */}
                    {paginados.length > 0 ? (
                        <div className="card-grid" style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))",
                            gap: "16px",
                        }}>
                            {paginados.map((n) => {
                                const cat = getCategoriaConfig(n.categoria, dark);
                                const fonteColor = getFonteColor(n.fonte, dark);
                                return (
                                    <div
                                        key={n.id}
                                        onClick={() => setModalItem(n)}
                                        style={{
                                            background: t.surface,
                                            border: `1px solid ${t.border}`,
                                            borderRadius: "16px",
                                            padding: "24px",
                                            cursor: "pointer",
                                            display: "flex", flexDirection: "column",
                                            transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                                            position: "relative", overflow: "hidden",
                                            boxShadow: dark ? "none" : "0 1px 6px rgba(0,0,0,0.04)",
                                        }}
                                        onMouseEnter={e => {
                                            if (!isMobile) {
                                                e.currentTarget.style.borderColor = t.cardHoverBorder;
                                                e.currentTarget.style.transform = "translateY(-3px)";
                                                e.currentTarget.style.boxShadow = t.shadowHover;
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!isMobile) {
                                                e.currentTarget.style.borderColor = t.border;
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = dark ? "none" : "0 1px 6px rgba(0,0,0,0.04)";
                                            }
                                        }}
                                    >
                                        {/* Accent top bar */}
                                        <div style={{
                                            position: "absolute", top: 0, left: "24px", right: "24px",
                                            height: "2px",
                                            background: `linear-gradient(90deg, transparent, ${fonteColor}60, transparent)`,
                                            borderRadius: "0 0 2px 2px",
                                        }} />

                                        {/* Badges */}
                                        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "16px" }}>
                                            <span style={{
                                                fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
                                                textTransform: "uppercase", padding: "3px 9px", borderRadius: "5px",
                                                color: fonteColor, background: `${fonteColor}14`, border: `1px solid ${fonteColor}30`,
                                                fontFamily: "Arial, monospace",
                                            }}>{n.fonte}</span>
                                            {n.categoria && (
                                                <span style={{
                                                    fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
                                                    textTransform: "uppercase", padding: "3px 9px", borderRadius: "5px",
                                                    color: cat.color, background: cat.bg, border: `1px solid ${cat.border}`,
                                                    fontFamily: "Arial, monospace",
                                                }}>{n.categoria}</span>
                                            )}
                                            {isNovo(n.data) && (
                                                <span style={{
                                                    fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em",
                                                    textTransform: "uppercase", padding: "3px 9px", borderRadius: "5px",
                                                    color: "#fff", background: "#EF4444", border: "1px solid #EF4444",
                                                    fontFamily: "Arial, monospace",
                                                    animation: "pulse 2s infinite",
                                                }}>● Novo</span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h2 style={{
                                            fontSize: "15px", fontWeight: "700", color: t.text,
                                            lineHeight: "1.5", marginBottom: "10px",
                                            display: "-webkit-box", WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical", overflow: "hidden",
                                        }}>{n.titulo}</h2>

                                        {/* Description */}
                                        <p style={{
                                            fontSize: "13px", color: t.textSub, lineHeight: "1.65",
                                            display: "-webkit-box", WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical", overflow: "hidden",
                                            marginBottom: "20px", flex: 1,
                                        }}>{n.descricao}</p>

                                        {/* Footer */}
                                        <div style={{
                                            display: "flex", justifyContent: "space-between", alignItems: "center",
                                            paddingTop: "14px", borderTop: `1px solid ${t.border}`,
                                        }}>
                                            <span style={{ fontSize: "11px", color: t.textMuted, fontFamily: "Arial, monospace" }}>
                                                {new Date(n.data).toLocaleDateString("pt-BR")}
                                            </span>
                                            {n.link && (
                                                <a href={n.link} target="_blank" rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        fontSize: "11px", fontWeight: "700",
                                                        color: t.accent, textDecoration: "none",
                                                        display: "flex", alignItems: "center", gap: "4px",
                                                        fontFamily: "Arial, monospace",
                                                        letterSpacing: "0.06em", textTransform: "uppercase",
                                                        transition: "color 0.15s",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.color = t.accentHover}
                                                    onMouseLeave={e => e.currentTarget.style.color = t.accent}
                                                >
                                                    Acessar
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "80px 20px", color: t.textMuted }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>◎</div>
                            <div style={{ fontSize: "14px", color: t.textSub, fontWeight: "500", marginBottom: "6px" }}>Nenhum normativo encontrado</div>
                            <div style={{ fontSize: "12px", color: t.textMuted, fontFamily: "Arial, monospace" }}>Tente ajustar os filtros selecionados</div>
                        </div>
                    )}

                    {/* PAGINATION */}
                    {totalPaginas > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "40px", flexWrap: "wrap" }}>
                            <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}
                                style={{ padding: "8px 16px", borderRadius: "9px", background: t.surface, border: `1px solid ${t.border}`, color: pagina === 1 ? t.textMuted : t.textSub, fontSize: "12px", cursor: pagina === 1 ? "default" : "pointer", fontFamily: "Arial, monospace", transition: "all 0.15s", opacity: pagina === 1 ? 0.4 : 1, boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.05)" }}>← Anterior</button>

                            {paginas.map((p, idx) =>
                                p === "..." ? (
                                    <span key={`e-${idx}`} style={{ color: t.textMuted, padding: "0 4px", fontFamily: "Arial, monospace" }}>…</span>
                                ) : (
                                    <button key={p} onClick={() => setPagina(p)}
                                        style={{ width: "36px", height: "36px", borderRadius: "9px", background: pagina === p ? t.paginationActiveBg : t.surface, border: pagina === p ? "none" : `1px solid ${t.border}`, color: pagina === p ? "#fff" : t.textSub, fontSize: "12px", cursor: "pointer", fontFamily: "Arial, monospace", fontWeight: "600", transition: "all 0.15s", boxShadow: pagina === p ? "0 4px 14px rgba(37,99,235,0.3)" : (dark ? "none" : "0 1px 3px rgba(0,0,0,0.05)") }}>
                                        {p}
                                    </button>
                                )
                            )}

                            <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                                style={{ padding: "8px 16px", borderRadius: "9px", background: t.surface, border: `1px solid ${t.border}`, color: pagina === totalPaginas ? t.textMuted : t.textSub, fontSize: "12px", cursor: pagina === totalPaginas ? "default" : "pointer", fontFamily: "Arial, monospace", transition: "all 0.15s", opacity: pagina === totalPaginas ? 0.4 : 1, boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.05)" }}>Próxima →</button>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: t.textMuted, fontFamily: "Arial, monospace", letterSpacing: "0.1em" }}>
                            MONITOR REGULATÓRIO · Atualizado diariamente
                        </span>
                        <span style={{ fontSize: "11px", color: t.textMuted, fontFamily: "Arial, monospace" }}>
                            {stats.total} registros indexados
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}