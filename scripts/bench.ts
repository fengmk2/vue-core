import type { BenchFn, BenchRunOptions, TestContext } from 'vite-plus/test'

// Keep the sampling windows used by the Vitest v4 benchmarks.
export const benchmarkOptions: BenchRunOptions = {
  time: 500,
  iterations: 10,
  warmupTime: 100,
  warmupIterations: 5,
}

export async function runBenchmark(
  { bench, task }: Pick<TestContext, 'bench' | 'task'>,
  fn: BenchFn,
  options?: BenchRunOptions,
): Promise<void> {
  const baseline = `temp/bench/${task.id}.json`
  const runOptions = {
    ...benchmarkOptions,
    ...options,
  }

  if (process.env.BENCH_COMPARE) {
    await bench.compare(
      bench(task.name, fn),
      bench.from('baseline', baseline),
      runOptions,
    )
  } else {
    await bench(
      task.name,
      { writeResult: process.env.BENCH_WRITE ? baseline : undefined },
      fn,
    ).run(runOptions)
  }
}
