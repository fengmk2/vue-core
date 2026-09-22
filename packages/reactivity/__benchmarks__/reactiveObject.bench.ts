import { test } from 'vite-plus/test'
import { reactive } from '../dist/reactivity.esm-browser.prod'

test('create reactive obj', async ({ bench }) => {
  await bench('create reactive obj', () => {
    reactive({ a: 1 })
  }).run()
})

{
  const raw = { a: 1 }
  reactive(raw)
  test('return cached reactive obj', async ({ bench }) => {
    await bench('return cached reactive obj', () => {
      reactive(raw)
    }).run()
  })
}

{
  const r = reactive({ a: 1 })
  test('read reactive obj property', async ({ bench }) => {
    await bench('read reactive obj property', () => {
      r.a
    }).run()
  })
}

{
  const r = reactive({ a: { b: 1 } })
  test('read nested reactive obj property', async ({ bench }) => {
    await bench('read nested reactive obj property', () => {
      r.a.b
    }).run()
  })
}

{
  let i = 0
  const r = reactive({ a: 1 })
  test('write reactive obj property', async ({ bench }) => {
    await bench('write reactive obj property', () => {
      r.a = i++
    }).run()
  })
}
