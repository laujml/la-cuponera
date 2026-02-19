// src/services/cuponesService.js
import { supabase } from '../config/supabaseClient'

/**
 * Fetch all coupons for the logged-in client, newest first.
 * We join oferta data to show relevant info.
 */
export const getMisCupones = async () => {
  try {
    const { data, error } = await supabase
      .from('cupones')
      .select(`
        id,
        codigo,
        precio_pagado,
        estado,
        fecha_compra,
        fecha_canje,
        fecha_vencimiento,
        oferta:oferta_id (
          id,
          titulo,
          imagen_url,
          empresa_nombre,
          precio_regular,
          precio_oferta,
          porcentaje_descuento
        )
      `)
      .order('fecha_compra', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error al obtener cupones:', error)
    return { data: null, error }
  }
}

/**
 * Purchase a coupon for a specific offer.
 * This runs inside a transaction-like flow:
 *   1. Verify offer is still available
 *   2. Decrement cupones_disponibles
 *   3. Create compra record
 *   4. Create cupon record with unique code
 */
export const comprarCupon = async ({ ofertaId, clienteId, precioOferta, empresaPrefijo, fechaLimiteUso }) => {
  try {
    // Step 1: Check availability (RLS-safe)
    const { data: oferta, error: ofertaError } = await supabase
      .from('ofertas')
      .select('id, cupones_disponibles, cantidad_limite, estado')
      .eq('id', ofertaId)
      .single()

    if (ofertaError) throw ofertaError

    if (oferta.cantidad_limite && oferta.cupones_disponibles <= 0) {
      throw new Error('Lo sentimos, esta oferta ya no tiene cupones disponibles.')
    }

    // Step 2: Generate unique coupon code
    const codigo = generarCodigo(empresaPrefijo)

    // Step 3: Create compra
    const { data: compra, error: compraError } = await supabase
      .from('compras')
      .insert({
        cliente_id: clienteId,
        oferta_id: ofertaId,
        cantidad: 1,
        total: precioOferta,
        estado: 'completada',
      })
      .select('id')
      .single()

    if (compraError) throw compraError

    // Step 4: Create cupon
    const { data: cupon, error: cuponError } = await supabase
      .from('cupones')
      .insert({
        codigo,
        oferta_id: ofertaId,
        cliente_id: clienteId,
        precio_pagado: precioOferta,
        estado: 'disponible',
        fecha_vencimiento: fechaLimiteUso,
      })
      .select('*')
      .single()

    if (cuponError) throw cuponError

    // Step 5: Decrement stock (if limited)
    if (oferta.cantidad_limite) {
      await supabase.rpc('decrementar_cupones', { oferta_uuid: ofertaId })
    }

    return { data: cupon, error: null }
  } catch (error) {
    console.error('Error al comprar cupón:', error)
    return { data: null, error }
  }
}

/**
 * Get a single coupon by ID (for PDF/detail view)
 */
export const getCuponPorId = async (cuponId) => {
  try {
    const { data, error } = await supabase
      .from('cupones')
      .select(`
        *,
        oferta:oferta_id (
          titulo,
          imagen_url,
          empresa_nombre,
          empresa_direccion,
          otros_detalles,
          fecha_limite_uso
        )
      `)
      .eq('id', cuponId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ── Helpers ──────────────────────────────────────────────

/**
 * Generates a coupon code: "PREFIX-XXXXXXX"
 * PREFIX = first 3 letters of empresa name, uppercased
 * XXXXXXX = 7 random digits
 */
const generarCodigo = (empresaPrefijo = 'CUP') => {
  const prefijo = empresaPrefijo.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
  const numeros = String(Math.floor(Math.random() * 9999999)).padStart(7, '0')
  return `${prefijo}-${numeros}`
}

/**
 * Categorize coupons by status — used in MisCuponesPage
 */
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
        acc.vencidos.push(cupon)
      } else {
        acc.disponibles.push(cupon)
      }
      return acc
    },
    { disponibles: [], canjeados: [], vencidos: [] }
  )
}