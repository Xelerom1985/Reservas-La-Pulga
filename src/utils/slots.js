export function getSlotsForDay(config) {
  const inicio = config?.horaInicio ?? 8
  const fin = config?.horaFin ?? 22
  const slots = []
  for (let h = inicio; h < fin; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
  }
  return slots
}

export function isDayClosed(dateStr, config) {
  if (!config?.diasCerrados) return false
  return Array.isArray(config.diasCerrados)
    ? config.diasCerrados.includes(dateStr)
    : Object.values(config.diasCerrados).includes(dateStr)
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${days[date.getDay()]} ${d} ${months[Number(m) - 1]}`
}
