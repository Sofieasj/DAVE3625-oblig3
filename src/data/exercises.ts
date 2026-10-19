export type Exercise = {
  id: string
  nodeId: string
  type: 'fix-code'
  title: string
  prompt: string
  starterCode: string
  acceptedAnswers: string[]
  hint: string
  failMessage?: string
}

export const exercises: Exercise[] = [
  {
    id: 'seed-shed-1',
    nodeId: 'seed-shed',
    type: 'fix-code',
    title: 'Seed Shed: Declare the seed count',
    prompt:
      'The seed crate is broken. Fix the line so it declares an int called seedCount and sets it to 12.',
    starterCode: 'int seedCount = 12;',
    acceptedAnswers: ['int seedCount = 12;'],
    hint: 'Use an int variable named seedCount and assign 12.',
    failMessage: 'The variable name or the value is wrong.',
  },
]
