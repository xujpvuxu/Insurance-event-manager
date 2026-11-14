// Run with the Firebase CLI auth.js path as the sole argument. Credentials stay in memory.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const auth = require(process.argv[2])
const account = auth.getProjectDefaultAccount(process.cwd())
if (!account) throw new Error('Firebase CLI 尚未登入')
const token = await auth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform'])
const base = 'https://firestore.googleapis.com/v1/projects/insurance-event-manager/databases/(default)/documents'
async function request(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' } })
  if (!response.ok) throw new Error(`Firestore HTTP ${response.status}`)
  return response.json()
}
function clean(value) {
  if (Array.isArray(value)) return value.map(clean)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'city' && key !== 'district').map(([key, item]) => [key, clean(item)]))
}
let updated = 0
for (const collection of ['contacts', 'events', 'eventGroups']) {
  let pageToken = ''
  do {
    const page = await request(`${base}/${collection}?pageSize=200${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`)
    for (const document of page.documents || []) {
      const fields = document.fields || {}
      const cleaned = clean(fields)
      if (JSON.stringify(fields) === JSON.stringify(cleaned)) continue
      const changed = Object.keys(fields).filter(key => JSON.stringify(fields[key]) !== JSON.stringify(cleaned[key]))
      // A precondition prevents overwriting a concurrent user edit.
      await request(`${base}:commit`, { method: 'POST', body: JSON.stringify({ writes: [{ update: { name: document.name, fields: cleaned }, updateMask: { fieldPaths: changed }, currentDocument: { updateTime: document.updateTime } }] }) })
      updated++
    }
    pageToken = page.nextPageToken || ''
  } while (pageToken)
}
console.log(`已清除地點欄位：${updated} 筆文件`)
