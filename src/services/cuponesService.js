import { supabase } from '../config/supabaseClient'

export const getMisCupones = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    // Leer cupones de localStorage
    const cupones = JSON.parse(localStorage.getItem('mis_cupones') || '[]')
    
    return { data: cupones, error: null }
  } catch (error) {
    console.error('Error al obtener cupones:', error)
    return { data: null, error }
  }
}

export const comprarCuponDirecto = async ({ ofertaId, precioOferta, empresaNombre, fechaLimiteUso, ofertaData }) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Debes iniciar sesión para comprar un cupón')
    }

    const codigo = generarCodigo(empresaNombre)

    // Simular cupón con datos de la oferta
    const cuponSimulado = {
      id: Date.now(),
      codigo,
      oferta_id: ofertaId,
      cliente_id: user.id,
      precio_pagado: precioOferta,
      estado: 'disponible',
      fecha_compra: new Date().toISOString(),
      fecha_vencimiento: fechaLimiteUso,
      oferta: ofertaData || {
        titulo: 'Oferta',
        precio_regular: precioOferta * 2,
        porcentaje_descuento: 50,
        empresa_nombre: empresaNombre,
      }
    }

    // Guardar en localStorage
    const cuponesGuardados = JSON.parse(localStorage.getItem('mis_cupones') || '[]')
    cuponesGuardados.push(cuponSimulado)
    localStorage.setItem('mis_cupones', JSON.stringify(cuponesGuardados))

    return { data: cuponSimulado, error: null }
  } catch (error) {
    console.error('Error en comprarCuponDirecto:', error)
    return { data: null, error }
  }
}

export const getCuponPorId = async (cuponId) => {
  try {
    const cupones = JSON.parse(localStorage.getItem('mis_cupones') || '[]')
    const cupon = cupones.find(c => c.id === cuponId)
    
    if (!cupon) {
      throw new Error('Cupón no encontrado')
    }

    return { data: cupon, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

const generarCodigo = (empresaNombre = 'CUP') => {
  const prefijo = empresaNombre
    .slice(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, 'X')
    .padEnd(3, 'X')
  const numeros = String(Math.floor(Math.random() * 9999999)).padStart(7, '0')
  return `${prefijo}-${numeros}`
}

export const categorizarCupones = (cupones = []) => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  return cupones.reduce(
    (acc, cupon) => {
      const vencimiento = new Date(cupon.fecha_vencimiento)
      vencimiento.setHours(23, 59, 59, 999)

      if (cupon.estado === 'canjeado') {
        acc.canjeados.push(cupon)
      } else if (vencimiento < hoy || cupon.estado === 'vencido') {
        acc.vencidos.push({ ...cupon, estado: 'vencido' })
      } else {
        acc.disponibles.push(cupon)
      }
      return acc
    },
    { disponibles: [], canjeados: [], vencidos: [] }
  )
}