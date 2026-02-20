import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Context
import { AuthProvider } from './context/AuthContext'

// Layout
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Páginas públicas
import Home from './pages/Home'
import OfertaDetallePage from './pages/OfertaDetallePage'
import NoAutorizadoPage from './pages/NoAutorizadoPage'

// Páginas de autenticación
import LoginPage from './pages/auth/LoginPage'
import RegistroPage from './pages/auth/RegistroPage'
import RecuperarContrasenaPage from './pages/auth/RecuperarContrasenaPage'

// Páginas de cliente
import MisCuponesPage from './pages/cliente/MisCuponesPage'
import PerfilPage from './pages/cliente/PerfilPage'

// Constantes
import { ROLES } from './config/constants'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#363636', color: '#fff' },
          }}
        />

        <Routes>
          {/* Rutas de autenticación (sin layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasenaPage />} />
          <Route path="/no-autorizado" element={<NoAutorizadoPage />} />

          {/* Rutas con layout */}
          <Route element={<Layout />}>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/ofertas/:id" element={<OfertaDetallePage />} />

            {/* Cliente */}
            <Route 
              path="/mis-cupones" 
              element={
                <ProtectedRoute roles={[ROLES.CLIENTE]}>
                  <MisCuponesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute roles={[ROLES.CLIENTE]}>
                  <PerfilPage />
                </ProtectedRoute>
              } 
            />

            {/* 404 */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300">404</h1>
                    <p className="text-gray-600 mt-2">Página no encontrada</p>
                    <a href="/" className="text-orange-500 hover:underline mt-4 inline-block">
                      Volver al inicio
                    </a>
                  </div>
                </div>
              } 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App