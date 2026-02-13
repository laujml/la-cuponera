import { Outlet } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar fijo en la parte superior */}
      <Navbar />
      
      {/* Contenido principal de cada página */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      
      {/* Footer en la parte inferior */}
      <Footer />
    </div>
  )
}

export default Layout