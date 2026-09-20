import { runBenchmark } from '../../../scripts/bench'
import { test } from 'vite-plus/test'
import { reactive } from '../dist/reactivity.esm-browser.prod'

test('create reactive obj', async ({ bench, task }) => {
  await runBenchmark({ bench, task }, () => {
    reactive({ a: 1 })
  })
})

{
  const raw = { a: 1 }
  reactive(raw)
  test('return cached reactive obj', async ({ bench, task }) => {
    await runBenchmark({ bench, task }, () => {
      reactive(raw)
    })
  })
}

{
  const r = reactive({ a: 1 })
  test('read reactive obj property', async ({ bench, task }) => {
    await runBenchmark({ bench, task }, () => {
      r.a
    })
  })
}

{
  const r = reactive({ a: { b: 1 } })
  test('read nested reactive obj property', async ({ bench, task }) => {
    await runBenchmark({ bench, task }, () => {
      r.a.b
    })
  })
}

{
  let i = 0
  const r = reactive({ a: 1 })
  test('write reactive obj property', async ({ bench, task }) => {
    await runBenchmark({ bench, task }, () => {
      r.a = i++
    })
  })
}
