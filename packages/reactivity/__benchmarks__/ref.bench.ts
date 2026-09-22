import { describe, test } from 'vite-plus/test'
import { ref } from '../dist/reactivity.esm-browser.prod'

describe('ref', () => {
  test('create ref', async ({ bench }) => {
    await bench('create ref', () => {
      ref(100)
    }).run()
  })

  {
    let i = 0
    const v = ref(100)
    test('write ref', async ({ bench }) => {
      await bench('write ref', () => {
        v.value = i++
      }).run()
    })
  }

  {
    const v = ref(100)
    test('read ref', async ({ bench }) => {
      await bench('read ref', () => {
        v.value
      }).run()
    })
  }

  {
    let i = 0
    const v = ref(100)
    test('write/read ref', async ({ bench }) => {
      await bench('write/read ref', () => {
        v.value = i++
        v.value
      }).run()
    })
  }
})
