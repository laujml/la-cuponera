import { supabase } from '../config/supabaseClient'

/** Obtener todos los rubros activos (Restaurantes, Salones, etc.) */
export const obtenerRubros = async () => {
  try {
    const { data, error } = await supabase
      .from('rubros')                    
      .select('*')                       
      .eq('activo', true)                
      .order('nombre')                   

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Error al obtener rubros:', error)
    return { success: false, error: error.message }
  }
}