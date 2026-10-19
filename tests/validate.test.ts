import { describe, expect, it } from 'vitest'

import { exercises } from '../src/data/exercises'
import { validateExerciseAnswer } from '../src/game/validate'

const exercise = exercises[0]
const waterPumpExercise = exercises[1]

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

  it.each([
    'if ( waterLevel > 0 ) { waterLevel -- ; } else { waterLevel = 0 ; }',
    'if (waterLevel>0){waterLevel -= 1;}else{waterLevel=0;}',
    'if (waterLevel > 0) {\n  waterLevel = waterLevel - 1;\n} else {\n  waterLevel = 0;\n}',
  ])('accepts a valid Water Pump answer: %s', (answer) => {
    expect(validateExerciseAnswer(waterPumpExercise, answer).isCorrect).toBe(true)
  })

  it.each([
    'if (waterLevel >= 0) { waterLevel--; } else { waterLevel = 0; }',
    'if (waterLevel > 0) { waterLevel--; } else { waterLevel == 0; }',
    'if (waterLevel > 0) { waterLevel++; } else { waterLevel = 0; }',
  ])('rejects a Water Pump near miss: %s', (answer) => {
    expect(
      validateExerciseAnswer(waterPumpExercise, answer).isCorrect,
    ).toBe(false)
  })
})
