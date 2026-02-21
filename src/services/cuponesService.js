
import { supabase } from '../config/supabaseClient'

export const getMisCupones = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

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
          precio_regular,
          porcentaje_descuento,
          otros_detalles,
          empresa:empresa_id (
            nombre,
            direccion
          )
        )
      `)
      .eq('cliente_id', user.id)
      .order('fecha_compra', { ascending: false })

    if (error) throw error

    // Transformar datos para compatibilidad con el componente
    const cuponesTransformados = (data || []).map(cupon => ({
      ...cupon,
      oferta: cupon.oferta ? {
        ...cupon.oferta,
        empresa_nombre: cupon.oferta.empresa?.nombre || 'Empresa',
        empresa_direccion: cupon.oferta.empresa?.direccion || ''
      } : null
    }))

    return { data: cuponesTransformados, error: null }
  } catch (error) {
    console.error('Error al obtener cupones:', error)
    return { data: null, error }
  }
}


export const comprarCupon = async ({ ofertaId, precioOferta }) => {
  try {
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Debes iniciar sesión para comprar un cupón')
    }

    // Llamar al stored procedure que maneja la transacción atómica
    const { data, error } = await supabase.rpc('comprar_cupon', {
      p_oferta_id: ofertaId,
      p_cliente_id: user.id,
      p_precio_pagado: precioOferta
    })

    if (error) {
      // Traducir errores comunes
      if (error.message.includes('agotados') || error.message.includes('disponibles')) {
        throw new Error('Lo sentimos, esta oferta ya no tiene cupones disponibles.')
      }
      if (error.message.includes('vigente') || error.message.includes('activa')) {
        throw new Error('Esta oferta ya no está vigente.')
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error al comprar cupón:', error)
    return { data: null, error }
  }
}


export const comprarCuponDirecto = async ({ ofertaId, precioOferta, empresaNombre, fechaLimiteUso }) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Debes iniciar sesión para comprar un cupón')
    }

    // Step 1: Verificar disponibilidad y bloquear la oferta
    const { data: oferta, error: ofertaError } = await supabase
      .from('ofertas')
      .select('id, cupones_disponibles, cantidad_limite, estado, fecha_fin')
      .eq('id', ofertaId)
      .eq('estado', 'aprobada')
      .single()

    if (ofertaError) {
      throw new Error('Oferta no encontrada')
    }

    // Verificar fecha
    const hoy = new Date()
    const fechaFin = new Date(oferta.fecha_fin)
    if (fechaFin < hoy) {
      throw new Error('Esta oferta ya ha finalizado')
    }

    // Verificar stock
    if (oferta.cantidad_limite && oferta.cupones_disponibles <= 0) {
      throw new Error('Lo sentimos, esta oferta ya no tiene cupones disponibles.')
    }

    // Step 2: Generar código único
    const codigo = generarCodigo(empresaNombre)

    // Step 3: Crear registro de compra
    const { data: compra, error: compraError } = await supabase
      .from('compras')
      .insert({
        cliente_id: user.id,
        oferta_id: ofertaId,
        cantidad: 1,
        total: precioOferta,
        estado: 'completada',
      })
      .select('id')
      .single()

    if (compraError) {
      console.error('Error al crear compra:', compraError)
      throw new Error('Error al procesar la compra')
    }

    // Step 4: Crear cupón
    const { data: cupon, error: cuponError } = await supabase
      .from('cupones')
      .insert({
        codigo,
        oferta_id: ofertaId,
        cliente_id: user.id,
        compra_id: compra.id,
        precio_pagado: precioOferta,
        estado: 'disponible',
        fecha_compra: new Date().toISOString(),
        fecha_vencimiento: fechaLimiteUso,
      })
      .select('*')
      .single()

    if (cuponError) {
      console.error('Error al crear cupón:', cuponError)
      throw new Error('Error al generar el cupón')
    }

    // Step 5: Decrementar stock (si tiene límite)
    if (oferta.cantidad_limite) {
      const { error: updateError } = await supabase
        .from('ofertas')
        .update({ 
          cupones_disponibles: oferta.cupones_disponibles - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', ofertaId)
        .gt('cupones_disponibles', 0) // Condición adicional de seguridad

      if (updateError) {
        console.error('Error al actualizar stock:', updateError)
        // No fallamos aquí, el cupón ya fue creado
      }
    }

    return { data: cupon, error: null }
  } catch (error) {
    console.error('Error en comprarCuponDirecto:', error)
    return { data: null, error }
  }
}


export const getCuponPorId = async (cuponId) => {
  try {
    const { data, error } = await supabase
      .from('cupones')
      .select(`
        *,
        oferta:oferta_id (
          titulo,
          imagen_url,
          precio_regular,
          porcentaje_descuento,
          otros_detalles,
          fecha_limite_uso,
          empresa:empresa_id (
            nombre,
            direccion
          )
        )
      `)
      .eq('id', cuponId)
      .single()

    if (error) throw error

    // Transformar para compatibilidad
    const cuponTransformado = {
      ...data,
      oferta: data.oferta ? {
        ...data.oferta,
        empresa_nombre: data.oferta.empresa?.nombre || 'Empresa',
        empresa_direccion: data.oferta.empresa?.direccion || ''
      } : null
    }

    return { data: cuponTransformado, error: null }
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