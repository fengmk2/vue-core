import { runBenchmark } from '../../../scripts/bench'
import { nextTick, ref, watch, watchEffect } from '../src'
import { test } from 'vite-plus/test'

test('create watcher', async ({ bench, task }) => {
  await runBenchmark({ bench, task }, () => {
    const v = ref(100)
    watch(v, v => {})
  })
})

{
  const v = ref(100)
  watch(v, v => {})
  let i = 0
  test('update ref to trigger watcher (scheduled but not executed)', async ({
    bench,
    task,
  }) => {
    await runBenchmark({ bench, task }, () => {
      v.value = i++
    })
  })
}

{
  const v = ref(100)
  watch(v, v => {})
  let i = 0
  test('update ref to trigger watcher (executed)', async ({ bench, task }) => {
    await runBenchmark({ bench, task }, async () => {
      v.value = i++
      return nextTick()
    })
  })
}

{
  test('create watchEffect', async ({ bench, task }) => {
    await runBenchmark({ bench, task }, () => {
      watchEffect(() => {})
    })
  })
}

{
  const v = ref(100)
  watchEffect(() => {
    v.value
  })
  let i = 0
  test('update ref to trigger watchEffect (scheduled but not executed)', async ({
    bench,
    task,
  }) => {
    await runBenchmark({ bench, task }, () => {
      v.value = i++
    })
  })
}

{
  const v = ref(100)
  watchEffect(() => {
    v.value
  })
  let i = 0
  test('update ref to trigger watchEffect (executed)', async ({
    bench,
    task,
  }) => {
    await runBenchmark({ bench, task }, async () => {
      v.value = i++
      await nextTick()
    })
  })
}
