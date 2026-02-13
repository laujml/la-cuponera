import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import Layout from './components/common/Layout'

// Páginas
import Home from './pages/Home'
import OfertaDetallePage from './pages/OfertaDetallePage'

function App() {
  return (
    <BrowserRouter>
      {/* Notificaciones Toast */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Rutas con Layout (Navbar + Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ofertas/:id" element={<OfertaDetallePage />} />
          
          {/* Página 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
                <p className="text-xl text-gray-700 mb-6">Página no encontrada</p>
                <a href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
                  Volver al inicio
                </a>
              </div>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App