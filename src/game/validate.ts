import type { Exercise } from '../data/exercises'

export function normalizeJavaInput(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*(\+\+|--|\+=|-=|\*=|\/=|%=|==|!=|<=|>=|=|<|>|\+|-|\*|\/|%)\s*/g, '$1')
    .replace(/\s*([;()[\]{}])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function validateExerciseAnswer(exercise: Exercise, answer: string) {
  const normalized = normalizeJavaInput(answer)

  if (!normalized) {
    return {
      isCorrect: false,
      normalized,
      reason: 'empty input',
      message: 'Please enter a Java line before testing.',
    }
  }

  const accepted = exercise.acceptedAnswers.map(normalizeJavaInput)

  if (accepted.includes(normalized)) {
    return {
      isCorrect: true,
      normalized,
      reason: 'matches accepted answer',
      message: 'Correct. The building is repaired.',
    }
  }

  return {
    isCorrect: false,
    normalized,
    reason: 'no matching answer',
    message: exercise.failMessage ?? 'That did not match the expected Java line.',
  }
}
