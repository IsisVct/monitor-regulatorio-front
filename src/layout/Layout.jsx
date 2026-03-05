function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
                <h2 className="text-2xl font-bold mb-8">
                    Monitor
                </h2>

                <nav className="flex flex-col gap-4 text-sm">
                    <a href="#" className="hover:bg-gray-800 p-2 rounded-lg">
                        🏠 Home
                    </a>
                    <a href="#" className="hover:bg-gray-800 p-2 rounded-lg">
                        📊 Dashboard
                    </a>
                    <a href="#" className="hover:bg-gray-800 p-2 rounded-lg">
                        📤 Exportar
                    </a>
                </nav>

                <div className="mt-auto text-xs text-gray-400">
                    v1.0 • Sistema Regulatório
                </div>
            </aside>

            {/* CONTEÚDO */}
            <main className="flex-1">
                {children}
            </main>

        </div>
    );
}

export default Layout;