import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cleanLocalLocation, withoutLocation } from '../src/locationCleanup.js'

test('清除聯絡人及已刪除聯絡人快照的地點，保留其他事件資料', () => {
  const original = { id: 'event-1', due: '2026-11-14', status: '完成', note: '測試備註', contacts: [{ id: 'person-1', name: '測試聯絡人', city: '測試市', district: '測試區', phone: '000' }] }
  const expected = { ...original, contacts: [{ id: 'person-1', name: '測試聯絡人', phone: '000' }] }
  assert.deepEqual(withoutLocation(original), expected)
  assert.equal(original.contacts[0].city, '測試市')
  assert.deepEqual(withoutLocation(withoutLocation(original)), expected)
})

test('清除所有本機帳號的地點，保留其他儲存項目', () => {
  const data = {
    'people:first': JSON.stringify([{ name: '甲', city: '測試市', district: '' }]),
    'events:second': JSON.stringify([{ contacts: [{ name: '乙', district: '測試區' }] }]),
    preference: 'unchanged',
  }
  const storage = Object.assign(Object.create({
    getItem(key) { return this[key] },
    setItem(key, value) { this[key] = value },
  }), data)
  cleanLocalLocation(storage)
  assert.deepEqual(JSON.parse(storage['people:first']), [{ name: '甲' }])
  assert.deepEqual(JSON.parse(storage['events:second']), [{ contacts: [{ name: '乙' }] }])
  assert.equal(storage.preference, 'unchanged')
})
