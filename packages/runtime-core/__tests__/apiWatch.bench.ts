import { nextTick, ref, watch, watchEffect } from '../src'
import { test } from 'vite-plus/test'

test('create watcher', async ({ bench }) => {
  await bench('create watcher', () => {
    const v = ref(100)
    watch(v, v => {})
  }).run()
})

{
  const v = ref(100)
  watch(v, v => {})
  let i = 0
  test('update ref to trigger watcher (scheduled but not executed)', async ({
    bench,
  }) => {
    await bench('update ref to trigger watcher (scheduled but not executed)', () => {
      v.value = i++
    }).run()
  })
}

{
  const v = ref(100)
  watch(v, v => {})
  let i = 0
  test('update ref to trigger watcher (executed)', async ({ bench }) => {
    await bench('update ref to trigger watcher (executed)', async () => {
      v.value = i++
      return nextTick()
    }).run()
  })
}

{
  test('create watchEffect', async ({ bench }) => {
    await bench('create watchEffect', () => {
      watchEffect(() => {})
    }).run()
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
  }) => {
    await bench('update ref to trigger watchEffect (scheduled but not executed)', () => {
      v.value = i++
    }).run()
  })
}

{
  const v = ref(100)
  watchEffect(() => {
    v.value
  })
  let i = 0
  test('update ref to trigger watchEffect (executed)', async ({ bench }) => {
    await bench('update ref to trigger watchEffect (executed)', async () => {
      v.value = i++
      await nextTick()
    }).run()
  })
}
