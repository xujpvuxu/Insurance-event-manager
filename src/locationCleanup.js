// Remove retired fields without changing any other contact or event data.
export function withoutLocation(value) {
  if (Array.isArray(value)) return value.map(withoutLocation)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== 'city' && key !== 'district')
    .map(([key, item]) => [key, withoutLocation(item)]))
}

export function cleanLocalLocation(storage) {
  for (const key of Object.keys(storage)) {
    if (!/^(people|events|groups):/.test(key)) continue
    const raw = storage.getItem(key)
    const cleaned = JSON.stringify(withoutLocation(JSON.parse(raw)))
    if (cleaned !== raw) storage.setItem(key, cleaned)
  }
}
