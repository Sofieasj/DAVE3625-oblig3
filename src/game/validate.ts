import type { Exercise } from '../data/exercises'

export function normalizeJavaInput(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*(\+\+|--|\+=|-=|\*=|\/=|%=|==|!=|<=|>=|=|<|>|\+|-|\*|\/|%)\s*/g, '$1')
    .replace(/\s*([.;()[\]{}])\s*/g, '$1')
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

  if (exercise.type === 'quiz') {
    const isCorrect = normalized === String(exercise.correctOption)
    return {
      isCorrect,
      normalized,
      reason: isCorrect ? 'matches correct option' : 'incorrect option',
      message: isCorrect
        ? exercise.successMessage ?? 'Correct.'
        : exercise.failMessage ?? 'That is not the correct option.',
    }
  }

  if (exercise.type === 'fill-blank') {
    const isCorrect = exercise.acceptedAnswers.some(
      (acceptedAnswer) => normalizeJavaInput(acceptedAnswer) === normalized,
    )

    return {
      isCorrect,
      normalized,
      reason: isCorrect ? 'matches accepted option' : 'incorrect option',
      message: isCorrect
        ? exercise.successMessage ?? 'Correct.'
        : exercise.failMessage ?? 'Choose a different option.',
    }
  }

  const accepted = exercise.acceptedAnswers.map(normalizeJavaInput)
  const matchingPattern = exercise.acceptedPatterns?.find((pattern) => {
    const regex = new RegExp(pattern)
    return regex.test(normalized)
  })

  if (accepted.includes(normalized) || matchingPattern) {
    const capturedValue = matchingPattern
      ? normalized.match(new RegExp(matchingPattern))?.[1]
      : undefined

    return {
      isCorrect: true,
      normalized,
      reason: matchingPattern ? 'matches accepted pattern' : 'matches accepted answer',
      message: exercise.successMessage ?? 'Correct. The building is repaired.',
      ...(exercise.savesAs === 'petSound' && capturedValue ? { savedValue: capturedValue } : {}),
    }
  }

  return {
    isCorrect: false,
    normalized,
    reason: 'no matching answer',
    message: exercise.failMessage ?? 'That did not match the expected Java line.',
  }
}
