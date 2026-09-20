import { runBenchmark } from '../../../scripts/bench'
import { describe, test } from 'vite-plus/test'
import { ref } from '../dist/reactivity.esm-browser.prod'

describe('ref', () => {
  test('create ref', async ({ bench, task }) => {
    await runBenchmark({ bench, task }, () => {
      ref(100)
    })
  })

  {
    let i = 0
    const v = ref(100)
    test('write ref', async ({ bench, task }) => {
      await runBenchmark({ bench, task }, () => {
        v.value = i++
      })
    })
  }

  {
    const v = ref(100)
    test('read ref', async ({ bench, task }) => {
      await runBenchmark({ bench, task }, () => {
        v.value
      })
    })
  }

  {
    let i = 0
    const v = ref(100)
    test('write/read ref', async ({ bench, task }) => {
      await runBenchmark({ bench, task }, () => {
        v.value = i++
        v.value
      })
    })
  }
})
