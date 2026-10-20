import { describe, expect, it } from 'vitest'

import { exercises } from '../src/data/exercises'
import { validateExerciseAnswer } from '../src/game/validate'

const exercise = exercises[0]
const waterPumpExercise = exercises[1]
const windmillExercise = exercises[2]
const greenhouseExercise = exercises[3]
const petBarnExercise = exercises[4]

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

  it.each([
    'for (int i = 0; i < 3; i++) { System.out.println("Bean!"); }',
    'for(int i=0;i<3;i+=1){System.out.println("Bean!");}',
  ])('accepts a valid Windmill loop: %s', (answer) => {
    expect(validateExerciseAnswer(windmillExercise, answer).isCorrect).toBe(true)
  })

  it.each([
    'for (int i = 0; i <= 3; i++) { System.out.println("Bean!"); }',
    'for (int i = 0; i < 2; i++) { System.out.println("Bean!"); }',
  ])('rejects a Windmill loop near miss: %s', (answer) => {
    expect(validateExerciseAnswer(windmillExercise, answer).isCorrect).toBe(false)
  })

  it('accepts the Greenhouse method across multiple lines', () => {
    expect(
      validateExerciseAnswer(
        greenhouseExercise,
        'int getFirstSeed(int[] seedCounts) {\n  return seedCounts[0];\n}',
      ).isCorrect,
    ).toBe(true)
  })

  it.each([
    'int getFirstSeed(int[] seedCounts) { return seedCounts[1]; }',
    'int getFirstSeed(int seedCounts) { return seedCounts[0]; }',
  ])('rejects a Greenhouse method near miss: %s', (answer) => {
    expect(validateExerciseAnswer(greenhouseExercise, answer).isCorrect).toBe(false)
  })

  it('accepts the Pet Barn raccoon subclass with an overridden sound method', () => {
    expect(
      validateExerciseAnswer(
        petBarnExercise,
        'class Raccoon extends Pet {\n  @Override\n  public String sound() {\n    return "Chitter!";\n  }\n}',
      ).isCorrect,
    ).toBe(true)
  })

  it.each([
    'class Raccoon extends Animal { @Override public String sound() { return "Chitter!"; } }',
    'class Raccoon extends Pet { @Override public String sound() { return "Woof!"; } }',
  ])('rejects a Pet Barn near miss: %s', (answer) => {
    expect(validateExerciseAnswer(petBarnExercise, answer).isCorrect).toBe(false)
  })
})
