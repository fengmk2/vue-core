import { runBenchmark } from '../../../scripts/bench'
import { describe, test } from 'vite-plus/test'
import type { Ref } from '../src'
import { effect, ref } from '../dist/reactivity.esm-browser.prod'

describe('effect', () => {
  {
    let i = 0
    const n = ref(0)
    effect(() => n.value)
    test('single ref invoke', async ({ bench, task }) => {
      await runBenchmark({ bench, task }, () => {
        n.value = i++
      })
    })
  }

  function benchEffectCreate(size: number) {
    test(`create an effect that tracks ${size} refs`, async ({
      bench,
      task,
    }) => {
      await runBenchmark({ bench, task }, () => {
        const refs: Ref[] = []
        for (let i = 0; i < size; i++) {
          refs.push(ref(i))
        }
        effect(() => {
          for (let i = 0; i < size; i++) {
            refs[i].value
          }
        })
      })
    })
  }

  benchEffectCreate(1)
  benchEffectCreate(10)
  benchEffectCreate(100)
  benchEffectCreate(1000)

  function benchEffectCreateAndStop(size: number) {
    test(`create and stop an effect that tracks ${size} refs`, async ({
      bench,
      task,
    }) => {
      await runBenchmark({ bench, task }, () => {
        const refs: Ref[] = []
        for (let i = 0; i < size; i++) {
          refs.push(ref(i))
        }
        const e = effect(() => {
          for (let i = 0; i < size; i++) {
            refs[i].value
          }
        })
        e.effect.stop()
      })
    })
  }

  benchEffectCreateAndStop(1)
  benchEffectCreateAndStop(10)
  benchEffectCreateAndStop(100)
  benchEffectCreateAndStop(1000)

  function benchWithRefs(size: number) {
    let j = 0
    const refs: Ref[] = []
    for (let i = 0; i < size; i++) {
      refs.push(ref(i))
    }
    effect(() => {
      for (let i = 0; i < size; i++) {
        refs[i].value
      }
    })
    test(`1 effect, mutate ${size} refs`, async ({ bench, task }) => {
      await runBenchmark({ bench, task }, () => {
        for (let i = 0; i < size; i++) {
          refs[i].value = i + j++
        }
      })
    })
  }

  benchWithRefs(10)
  benchWithRefs(100)
  benchWithRefs(1000)

  function benchWithBranches(size: number) {
    const toggle = ref(true)
    const refs: Ref[] = []
    for (let i = 0; i < size; i++) {
      refs.push(ref(i))
    }
    effect(() => {
      if (toggle.value) {
        for (let i = 0; i < size; i++) {
          refs[i].value
        }
      }
    })
    test(`${size} refs branch toggle`, async ({ bench, task }) => {
      await runBenchmark({ bench, task }, () => {
        toggle.value = !toggle.value
      })
    })
  }

  benchWithBranches(10)
  benchWithBranches(100)
  benchWithBranches(1000)

  function benchMultipleEffects(size: number) {
    let i = 0
    const n = ref(0)
    for (let i = 0; i < size; i++) {
      effect(() => n.value)
    }
    test(`1 ref invoking ${size} effects`, async ({ bench, task }) => {
      await runBenchmark({ bench, task }, () => {
        n.value = i++
      })
    })
  }

  benchMultipleEffects(10)
  benchMultipleEffects(100)
  benchMultipleEffects(1000)
})
