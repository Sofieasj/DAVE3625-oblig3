import { describe, expect, it } from 'vitest'

import { exercises } from '../src/data/exercises'
import { validateExerciseAnswer } from '../src/game/validate'

const exercise = exercises.find((item) => item.id === 'seed-shed-1')!
const seedLabelExercise = exercises.find((item) => item.id === 'seed-shed-2')!
const waterPumpChoice = exercises.find((item) => item.id === 'water-pump-1')!
const waterPumpFix = exercises.find((item) => item.id === 'water-pump-2')!
const windmillExercise = exercises.find((item) => item.id === 'windmill-1')!
const greenhouseChoice = exercises.find((item) => item.id === 'greenhouse-1')!
const greenhouseFix = exercises.find((item) => item.id === 'greenhouse-2')!
const solarRoofExercise = exercises.find((item) => item.id === 'solar-roof-1')!
const petBarnChoice = exercises.find((item) => item.id === 'pet-barn-1')!
const petBarnSound = exercises.find((item) => item.id === 'pet-barn-2')!
const beaconQuiz = exercises.find((item) => item.id === 'beacon-1')!
const beaconArrayQuiz = exercises.find((item) => item.id === 'beacon-2')!

describe('exercise validation', () => {
  it('accepts the correct fill-blank choice with surrounding whitespace', () => {
    const result = validateExerciseAnswer(exercise, ' int ')
    expect(result.isCorrect).toBe(true)
  })

  it('rejects incorrect and empty fill-blank choices', () => {
    expect(validateExerciseAnswer(exercise, '').isCorrect).toBe(false)
    expect(validateExerciseAnswer(exercise, 'String').isCorrect).toBe(false)
  })

  it('accepts whitespace variants for the Seed Shed String declaration', () => {
    const result = validateExerciseAnswer(seedLabelExercise, ' String   cropName = "Tomato" ; ')
    expect(result.isCorrect).toBe(true)
    expect(validateExerciseAnswer(seedLabelExercise, 'string cropName = "Tomato";').isCorrect).toBe(false)
  })

  it('rejects a near-miss Seed Shed declaration', () => {
    expect(validateExerciseAnswer(seedLabelExercise, 'String cropName = "Tomatoes";').isCorrect).toBe(false)
  })

  it('normalizes spaces around the increment operator', () => {
    const loopExercise = {
      ...windmillExercise,
      acceptedAnswers: ['i++;'],
    }
    expect(validateExerciseAnswer(loopExercise, 'i ++ ;').isCorrect).toBe(true)
  })

  it.each([
    ' > ',
  ])('accepts Water Pump fill-blank choice: %s', (answer) => {
    expect(validateExerciseAnswer(waterPumpChoice, answer).isCorrect).toBe(true)
  })

  it('rejects a wrong Water Pump comparison', () => {
    expect(validateExerciseAnswer(waterPumpChoice, '<').isCorrect).toBe(false)
  })

  it.each(['if (waterLevel == 0) ', 'if(waterLevel==0)'])(
    'accepts the Water Pump leak-check fix: %s',
    (answer) => {
      expect(validateExerciseAnswer(waterPumpFix, answer).isCorrect).toBe(true)
    },
  )

  it('rejects assigning instead of checking equality in the Water Pump fix', () => {
    expect(validateExerciseAnswer(waterPumpFix, 'if (waterLevel = 0) {').isCorrect).toBe(false)
  })

  it.each([
    'for (int i = 0; i < 4; i++) {',
    'for(int i=0;i<4;i+=1){',
    'for (int i = 0; i < 4; i ++ ) {',
  ])('accepts a valid Windmill loop: %s', (answer) => {
    expect(validateExerciseAnswer(windmillExercise, answer).isCorrect).toBe(true)
  })

  it.each([
    'for (int i = 0; i < 4; i--) {',
    'for (int i = 0; i <= 4; i++) {',
    'for (int i = 1; i < 4; i++) {',
  ])('rejects a Windmill loop near miss: %s', (answer) => {
    expect(validateExerciseAnswer(windmillExercise, answer).isCorrect).toBe(false)
  })

  it('validates the Greenhouse first-tray fill-blank choice', () => {
    expect(validateExerciseAnswer(greenhouseChoice, '0').isCorrect).toBe(true)
    expect(validateExerciseAnswer(greenhouseChoice, '1').isCorrect).toBe(false)
  })

  it.each([
    'int last = trays[2];',
    'int last=trays[ trays.length-1 ];',
  ])('accepts a Greenhouse last-tray fix: %s', (answer) => {
    expect(validateExerciseAnswer(greenhouseFix, answer).isCorrect).toBe(true)
  })

  it('rejects an out-of-bounds Greenhouse tray index', () => {
    expect(validateExerciseAnswer(greenhouseFix, 'int last = trays[3];').isCorrect).toBe(false)
  })

  it('validates the Pet Barn inheritance fill-blank', () => {
    expect(validateExerciseAnswer(petBarnChoice, 'extends').isCorrect).toBe(true)
    expect(validateExerciseAnswer(petBarnChoice, 'inherits').isCorrect).toBe(false)
  })

  it('accepts a custom Pet Barn sound and returns it for the speech bubble', () => {
    expect(validateExerciseAnswer(petBarnSound, 'return "Chitter!";')).toMatchObject({
      isCorrect: true,
      savedValue: 'Chitter!',
    })
    expect(validateExerciseAnswer(petBarnSound, ' return "Rrr!"; ').isCorrect).toBe(true)
  })

  it.each(['return "...";', 'return "";', 'return "This sound is much too long!";'])(
    'rejects an invalid Pet Barn sound: %s',
    (answer) => expect(validateExerciseAnswer(petBarnSound, answer).isCorrect).toBe(false),
  )

  it('accepts connecting the solar panels to the battery', () => {
    expect(
      validateExerciseAnswer(solarRoofExercise, ' battery . connect ( solarPanels ) ; '),
    ).toMatchObject({ isCorrect: true })
  })

  it('rejects a misspelled solar panel reference', () => {
    expect(
      validateExerciseAnswer(solarRoofExercise, 'battery.connect(solarPanel);').isCorrect,
    ).toBe(false)
  })

  it('accepts the correct Beacon quiz option and rejects wrong or empty choices', () => {
    expect(validateExerciseAnswer(beaconQuiz, '0').isCorrect).toBe(true)
    expect(validateExerciseAnswer(beaconQuiz, '1').isCorrect).toBe(false)
    expect(validateExerciseAnswer(beaconQuiz, '').isCorrect).toBe(false)
  })

  it('validates the second Beacon array quiz', () => {
    expect(validateExerciseAnswer(beaconArrayQuiz, '1').isCorrect).toBe(true)
    expect(validateExerciseAnswer(beaconArrayQuiz, '0').isCorrect).toBe(false)
  })
})
