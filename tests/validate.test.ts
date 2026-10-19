import { describe, expect, it } from 'vitest'

import { exercises } from '../src/data/exercises'
import { validateExerciseAnswer } from '../src/game/validate'

const exercise = exercises[0]

describe('exercise validation', () => {
  it('accepts extra whitespace and normalizes punctuation', () => {
    const result = validateExerciseAnswer(exercise, ' int   seedCount = 12 ; ')
    expect(result.isCorrect).toBe(true)
  })

  it('accepts extra whitespace while preserving case-sensitive identifiers', () => {
    const result = validateExerciseAnswer(exercise, ' int   seedCount  =  12 ; ')
    expect(result.isCorrect).toBe(true)
    expect(validateExerciseAnswer(exercise, 'int seedcount = 12;').isCorrect).toBe(false)
  })

  it('rejects near misses and empty input', () => {
    expect(validateExerciseAnswer(exercise, '').isCorrect).toBe(false)
    expect(validateExerciseAnswer(exercise, 'int seedCount = 13;').isCorrect).toBe(false)
  })

  it('accepts a valid answer with no extra spaces', () => {
    const result = validateExerciseAnswer(exercise, 'int seedCount=12;')
    expect(result.isCorrect).toBe(true)
  })

  it('normalizes spaces around the increment operator', () => {
    const loopExercise = {
      ...exercise,
      acceptedAnswers: ['i++;'],
    }
    expect(validateExerciseAnswer(loopExercise, 'i ++ ;').isCorrect).toBe(true)
  })
})
