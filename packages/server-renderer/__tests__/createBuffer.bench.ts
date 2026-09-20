import { runBenchmark } from '../../../scripts/bench'
import { describe, test } from 'vite-plus/test'

import { createBuffer as _createBuffer } from '../src/render'

// move to local const to avoid import access overhead
// https://github.com/vitest-dev/vitest/issues/6903
const createBuffer = _createBuffer

describe('createBuffer', () => {
  let stringBuffer = createBuffer()

  test('string only', async ({ bench, task }) => {
    await runBenchmark(
      { bench, task },
      () => {
        for (let i = 0; i < 10; i += 1) {
          stringBuffer.push('hello')
        }
      },
      {
        setup() {
          stringBuffer = createBuffer()
        },
      },
    )
  })

  let stringNestedBuffer = createBuffer()

  test('string with nested', async ({ bench, task }) => {
    await runBenchmark(
      { bench, task },
      () => {
        for (let i = 0; i < 10; i += 1) {
          if (i % 3 === 0) {
            stringNestedBuffer.push('hello')
          } else {
            const buffer = createBuffer()
            buffer.push('hello')
            stringNestedBuffer.push(buffer.getBuffer())
          }
        }
      },
      {
        setup() {
          stringNestedBuffer = createBuffer()
        },
      },
    )
  })

  test('string with nested async', async ({ bench, task }) => {
    await runBenchmark(
      { bench, task },
      () => {
        for (let i = 0; i < 10; i += 1) {
          if (i % 3 === 0) {
            const buffer = createBuffer()
            buffer.push('hello')
            stringNestedBuffer.push(Promise.resolve(buffer.getBuffer()))
          } else {
            const buffer = createBuffer()
            buffer.push('hello')
            stringNestedBuffer.push(buffer.getBuffer())
          }
        }
      },
      {
        setup() {
          stringNestedBuffer = createBuffer()
        },
      },
    )
  })
})
