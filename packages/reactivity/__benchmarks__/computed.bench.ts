import { describe, test } from 'vite-plus/test'
import type { ComputedRef, Ref } from '../src'
import { computed, effect, ref } from '../dist/reactivity.esm-browser.prod'

declare module '../dist/reactivity.esm-browser.prod' {
  function computed(...args: any[]): any
}

describe('computed', () => {
  test('create computed', async ({ bench }) => {
    await bench('create computed', () => {
      computed(() => 100)
    }).run()
  })

  {
    const v = ref(100)
    computed(() => v.value * 2)
    let i = 0
    test("write ref, don't read computed (without effect)", async ({
      bench,
    }) => {
      await bench("write ref, don't read computed (without effect)", () => {
        v.value = i++
      }).run()
    })
  }

  {
    const v = ref(100)
    const c = computed(() => {
      return v.value * 2
    })
    effect(() => c.value)
    let i = 0
    test("write ref, don't read computed (with effect)", async ({ bench }) => {
      await bench("write ref, don't read computed (with effect)", () => {
        v.value = i++
      }).run()
    })
  }

  {
    const v = ref(100)
    const c = computed(() => {
      return v.value * 2
    })
    let i = 0
    test('write ref, read computed (without effect)', async ({ bench }) => {
      await bench('write ref, read computed (without effect)', () => {
        v.value = i++
        c.value
      }).run()
    })
  }

  {
    const v = ref(100)
    const c = computed(() => {
      return v.value * 2
    })
    effect(() => c.value)
    let i = 0
    test('write ref, read computed (with effect)', async ({ bench }) => {
      await bench('write ref, read computed (with effect)', () => {
        v.value = i++
        c.value
      }).run()
    })
  }

  {
    const v = ref(100)
    const computeds: ComputedRef<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      computeds.push(c)
    }
    let i = 0
    test("write ref, don't read 1000 computeds (without effect)", async ({
      bench,
    }) => {
      await bench("write ref, don't read 1000 computeds (without effect)", () => {
        v.value = i++
      }).run()
    })
  }

  {
    const v = ref(100)
    const computeds: ComputedRef<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      effect(() => c.value)
      computeds.push(c)
    }
    let i = 0
    test("write ref, don't read 1000 computeds (with multiple effects)", async ({
      bench,
    }) => {
      await bench("write ref, don't read 1000 computeds (with multiple effects)", () => {
        v.value = i++
      }).run()
    })
  }

  {
    const v = ref(100)
    const computeds: ComputedRef<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      computeds.push(c)
    }
    effect(() => {
      for (let i = 0; i < 1000; i++) {
        computeds[i].value
      }
    })
    let i = 0
    test("write ref, don't read 1000 computeds (with single effect)", async ({
      bench,
    }) => {
      await bench("write ref, don't read 1000 computeds (with single effect)", () => {
        v.value = i++
      }).run()
    })
  }

  {
    const v = ref(100)
    const computeds: ComputedRef<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      computeds.push(c)
    }
    let i = 0
    test('write ref, read 1000 computeds (no effect)', async ({ bench }) => {
      await bench('write ref, read 1000 computeds (no effect)', () => {
        v.value = i++
        computeds.forEach(c => c.value)
      }).run()
    })
  }

  {
    const v = ref(100)
    const computeds: ComputedRef<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      effect(() => c.value)
      computeds.push(c)
    }
    let i = 0
    test('write ref, read 1000 computeds (with multiple effects)', async ({
      bench,
    }) => {
      await bench('write ref, read 1000 computeds (with multiple effects)', () => {
        v.value = i++
        computeds.forEach(c => c.value)
      }).run()
    })
  }

  {
    const v = ref(100)
    const computeds: ComputedRef<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      const c = computed(() => {
        return v.value * 2
      })
      effect(() => c.value)
      computeds.push(c)
    }
    effect(() => {
      for (let i = 0; i < 1000; i++) {
        computeds[i].value
      }
    })
    let i = 0
    test('write ref, read 1000 computeds (with single effect)', async ({
      bench,
    }) => {
      await bench('write ref, read 1000 computeds (with single effect)', () => {
        v.value = i++
        computeds.forEach(c => c.value)
      }).run()
    })
  }

  {
    const refs: Ref<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      refs.push(ref(i))
    }
    const c = computed(() => {
      let total = 0
      refs.forEach(ref => (total += ref.value))
      return total
    })
    let i = 0
    const n = refs.length
    test('1000 refs, read 1 computed (without effect)', async ({ bench }) => {
      await bench('1000 refs, read 1 computed (without effect)', () => {
        refs[i++ % n].value++
        c.value
      }).run()
    })
  }

  {
    const refs: Ref<number>[] = []
    for (let i = 0, n = 1000; i < n; i++) {
      refs.push(ref(i))
    }
    const c = computed(() => {
      let total = 0
      refs.forEach(ref => (total += ref.value))
      return total
    })
    effect(() => c.value)
    let i = 0
    const n = refs.length
    test('1000 refs, read 1 computed (with effect)', async ({ bench }) => {
      await bench('1000 refs, read 1 computed (with effect)', () => {
        refs[i++ % n].value++
        c.value
      }).run()
    })
  }
})
