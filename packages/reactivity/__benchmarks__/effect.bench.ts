import { describe, test } from 'vite-plus/test'
import type { Ref } from '../src'
import { effect, ref } from '../dist/reactivity.esm-browser.prod'

describe('effect', () => {
  {
    let i = 0
    const n = ref(0)
    effect(() => n.value)
    test('single ref invoke', async ({ bench }) => {
      await bench('single ref invoke', () => {
        n.value = i++
      }).run()
    })
  }

  function benchEffectCreate(size: number) {
    test(`create an effect that tracks ${size} refs`, async ({ bench }) => {
      await bench(`create an effect that tracks ${size} refs`, () => {
        const refs: Ref[] = []
        for (let i = 0; i < size; i++) {
          refs.push(ref(i))
        }
        effect(() => {
          for (let i = 0; i < size; i++) {
            refs[i].value
          }
        })
      }).run()
    })
  }

  benchEffectCreate(1)
  benchEffectCreate(10)
  benchEffectCreate(100)
  benchEffectCreate(1000)

  function benchEffectCreateAndStop(size: number) {
    test(`create and stop an effect that tracks ${size} refs`, async ({
      bench,
    }) => {
      await bench(`create and stop an effect that tracks ${size} refs`, () => {
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
      }).run()
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
    test(`1 effect, mutate ${size} refs`, async ({ bench }) => {
      await bench(`1 effect, mutate ${size} refs`, () => {
        for (let i = 0; i < size; i++) {
          refs[i].value = i + j++
        }
      }).run()
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
    test(`${size} refs branch toggle`, async ({ bench }) => {
      await bench(`${size} refs branch toggle`, () => {
        toggle.value = !toggle.value
      }).run()
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
    test(`1 ref invoking ${size} effects`, async ({ bench }) => {
      await bench(`1 ref invoking ${size} effects`, () => {
        n.value = i++
      }).run()
    })
  }

  benchMultipleEffects(10)
  benchMultipleEffects(100)
  benchMultipleEffects(1000)
})
