import { test } from 'vite-plus/test'
import {
  effect,
  reactive,
  shallowReadArray,
} from '../dist/reactivity.esm-browser.prod'

for (let amount = 1e1; amount < 1e4; amount *= 10) {
  {
    const rawArray: number[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const arr = reactive(rawArray)

    {
      let runner: ReturnType<typeof effect>
      const _benchName = `track for loop, ${amount} elements`
      test(_benchName, async ({ bench }) => {
        await bench(
          _benchName,
          { afterEach: () => runner.effect.stop() },
          () => {
            let sum = 0
            runner = effect(() => {
              for (let i = 0; i < arr.length; i++) {
                sum += arr[i]
              }
            })
          },
        ).run()
      })
    }
  }

  {
    const rawArray: number[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const arr = reactive(rawArray)

    {
      let runner: ReturnType<typeof effect>
      const _benchName2 = `track manual reactiveReadArray, ${amount} elements`
      test(_benchName2, async ({ bench }) => {
        await bench(
          _benchName2,
          { afterEach: () => runner.effect.stop() },
          () => {
            let sum = 0
            runner = effect(() => {
              const raw = shallowReadArray(arr)
              for (let i = 0; i < raw.length; i++) {
                sum += raw[i]
              }
            })
          },
        ).run()
      })
    }
  }

  {
    const rawArray: number[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const arr = reactive(rawArray)

    {
      let runner: ReturnType<typeof effect>
      const _benchName3 = `track iteration, ${amount} elements`
      test(_benchName3, async ({ bench }) => {
        await bench(
          _benchName3,
          { afterEach: () => runner.effect.stop() },
          () => {
            let sum = 0
            runner = effect(() => {
              for (let x of arr) {
                sum += x
              }
            })
          },
        ).run()
      })
    }
  }

  {
    const rawArray: number[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const arr = reactive(rawArray)

    {
      let runner: ReturnType<typeof effect>
      const _benchName4 = `track forEach, ${amount} elements`
      test(_benchName4, async ({ bench }) => {
        await bench(
          _benchName4,
          { afterEach: () => runner.effect.stop() },
          () => {
            let sum = 0
            runner = effect(() => {
              arr.forEach(x => (sum += x))
            })
          },
        ).run()
      })
    }
  }

  {
    const rawArray: number[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const arr = reactive(rawArray)

    {
      let runner: ReturnType<typeof effect>
      const _benchName5 = `track reduce, ${amount} elements`
      test(_benchName5, async ({ bench }) => {
        await bench(
          _benchName5,
          { afterEach: () => runner.effect.stop() },
          () => {
            let sum = 0
            runner = effect(() => {
              sum = arr.reduce((v, a) => a + v, 0)
            })
          },
        ).run()
      })
    }
  }

  {
    const rawArray: any[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const r = reactive(rawArray)
    effect(() => r.reduce((v, a) => a + v, 0))

    {
      const _benchName6 = `trigger index mutation (1st only), tracked with reduce, ${amount} elements`
      test(_benchName6, async ({ bench }) => {
        await bench(_benchName6, () => {
          r[0]++
        }).run()
      })
    }
  }

  {
    const rawArray: any[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const r = reactive(rawArray)
    effect(() => r.reduce((v, a) => a + v, 0))

    {
      const _benchName7 = `trigger index mutation (all), tracked with reduce, ${amount} elements`
      test(_benchName7, async ({ bench }) => {
        await bench(_benchName7, () => {
          for (let i = 0, n = r.length; i < n; i++) {
            r[i]++
          }
        }).run()
      })
    }
  }

  {
    const rawArray: number[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const arr = reactive(rawArray)
    let sum = 0
    effect(() => {
      for (let x of arr) {
        sum += x
      }
    })

    {
      const _benchName8 = `push() trigger, tracked via iteration, ${amount} elements`
      test(_benchName8, async ({ bench }) => {
        await bench(_benchName8, { afterEach: () => arr.pop() }, () => {
          arr.push(1)
        }).run()
      })
    }
  }

  {
    const rawArray: number[] = []
    for (let i = 0, n = amount; i < n; i++) {
      rawArray.push(i)
    }
    const arr = reactive(rawArray)
    let sum = 0
    effect(() => {
      arr.forEach(x => (sum += x))
    })

    {
      const _benchName9 = `push() trigger, tracked via forEach, ${amount} elements`
      test(_benchName9, async ({ bench }) => {
        await bench(_benchName9, { afterEach: () => arr.pop() }, () => {
          arr.push(1)
        }).run()
      })
    }
  }
}
