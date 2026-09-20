import { runBenchmark } from '../../../scripts/bench'
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
      const _benchName = `track for loop, ${amount} elements`
      test(_benchName, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          let sum = 0
          effect(() => {
            for (let i = 0; i < arr.length; i++) {
              sum += arr[i]
            }
          })
        })
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
      const _benchName2 = `track manual reactiveReadArray, ${amount} elements`
      test(_benchName2, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          let sum = 0
          effect(() => {
            const raw = shallowReadArray(arr)
            for (let i = 0; i < raw.length; i++) {
              sum += raw[i]
            }
          })
        })
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
      const _benchName3 = `track iteration, ${amount} elements`
      test(_benchName3, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          let sum = 0
          effect(() => {
            for (let x of arr) {
              sum += x
            }
          })
        })
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
      const _benchName4 = `track forEach, ${amount} elements`
      test(_benchName4, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          let sum = 0
          effect(() => {
            arr.forEach(x => (sum += x))
          })
        })
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
      const _benchName5 = `track reduce, ${amount} elements`
      test(_benchName5, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          let sum = 0
          effect(() => {
            sum = arr.reduce((v, a) => a + v, 0)
          })
        })
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
      test(_benchName6, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          r[0]++
        })
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
      test(_benchName7, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          for (let i = 0, n = r.length; i < n; i++) {
            r[i]++
          }
        })
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
      test(_benchName8, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          arr.push(1)
        })
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
      test(_benchName9, async ({ bench, task }) => {
        await runBenchmark({ bench, task }, () => {
          arr.push(1)
        })
      })
    }
  }
}
