import { useState } from 'react'

const MENSAJES = {
  requerido: 'Este campo es requerido',
  email: 'Ingresa un correo electrónico válido',
  minLength: (n) => `Mínimo ${n} caracteres`,
  maxLength: (n) => `Máximo ${n} caracteres`,
  dui: 'Formato inválido. Usa: 00000000-0',
  match: 'Las contraseñas no coinciden',
}

const validarCampo = (nombre, valor, reglas, todosLosValores) => {
  if (reglas.requerido && !valor.trim()) return MENSAJES.requerido

  if (!valor.trim()) return '' 

  if (reglas.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(valor)) return MENSAJES.email
  }

  if (reglas.dui) {
    const duiRegex = /^\d{8}-\d$/
    if (!duiRegex.test(valor)) return MENSAJES.dui
  }

  if (reglas.minLength && valor.length < reglas.minLength) {
    return MENSAJES.minLength(reglas.minLength)
  }

  if (reglas.maxLength && valor.length > reglas.maxLength) {
    return MENSAJES.maxLength(reglas.maxLength)
  }

  if (reglas.match && valor !== todosLosValores[reglas.match]) {
    return MENSAJES.match
  }

  return ''
}

export const useForm = (valoresIniciales, reglasDeValidacion = {}) => {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    const nuevosValores = { ...valores, [name]: value }
    setValores(nuevosValores)

    // Live validation once the field has been touched
    if (errores[name] !== undefined) {
      const reglas = reglasDeValidacion[name] || {}
      const error = validarCampo(name, value, reglas, nuevosValores)
      setErrores((prev) => ({ ...prev, [name]: error }))
    }
  }

  const validar = () => {
    const nuevosErrores = {}
    Object.keys(reglasDeValidacion).forEach((campo) => {
      const error = validarCampo(
        campo,
        valores[campo] || '',
        reglasDeValidacion[campo],
        valores
      )
      nuevosErrores[campo] = error
    })
    setErrores(nuevosErrores)
    return Object.values(nuevosErrores).every((e) => e === '')
  }

  const resetear = () => {
    setValores(valoresIniciales)
    setErrores({})
  }

  return { valores, errores, handleChange, validar, resetear, setValores }
}