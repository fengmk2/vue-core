import { readFileSync } from 'node:fs'

function readBenchmarks(file) {
  const report = JSON.parse(readFileSync(file, 'utf8'))
  const results = new Map()
  for (const suite of report.testResults) {
    const path = suite.name.match(/(?:packages|packages-private)\/.*$/)?.[0]
    for (const assertion of suite.assertionResults) {
      for (const group of assertion.benchmarks || []) {
        for (const task of group.tasks) {
          results.set(`${path}: ${group.name}: ${task.name}`, task.latency.mean)
        }
      }
    }
  }
  return results
}

const baseline = readBenchmarks('temp/bench.json')
const current = readBenchmarks('temp/bench-current.json')

for (const [name, mean] of current) {
  const previous = baseline.get(name)
  const change =
    previous === undefined
      ? 'new'
      : `${((mean / previous - 1) * 100).toFixed(1)}%`
  console.log(`${change.padStart(8)}  ${name}`)
}

for (const name of baseline.keys()) {
  if (!current.has(name)) {
    console.log(`${'missing'.padStart(8)}  ${name}`)
  }
}
