import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna 1: Info de la empresa */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/Cuponera-sin fondo.png" 
                alt="La Cuponera" 
                className="h-20 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Los mejores descuentos en restaurantes, spas, entretenimiento y más. 
              ¡Ahorra hasta 70% en tus lugares favoritos!
            </p>
          </div>
          
          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  Ofertas
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  ¿Cómo funciona?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>
          
          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@lacuponera.com
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (503) 2222-3333
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                San Salvador, El Salvador
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} La Cuponera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer