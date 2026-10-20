export type Exercise = {
  id: string
  nodeId: string
  type: 'fix-code'
  title: string
  prompt: string
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
    acceptedAnswers: ['int seedCount = 12;'],
    hint: 'Use an int variable named seedCount and assign 12.',
    failMessage: 'The variable name or the value is wrong.',
  },
  {
    id: 'water-pump-1',
    nodeId: 'water-pump',
    type: 'fix-code',
    title: 'Water Pump: Protect the water supply',
    prompt:
      'Write an if/else statement that decreases waterLevel by 1 when it is above 0. Otherwise, keep it at 0.',
    acceptedAnswers: [
      'if (waterLevel > 0) { waterLevel--; } else { waterLevel = 0; }',
      'if (waterLevel > 0) { waterLevel -= 1; } else { waterLevel = 0; }',
      'if (waterLevel > 0) { waterLevel = waterLevel - 1; } else { waterLevel = 0; }',
    ],
    hint: 'Check waterLevel > 0 in the if condition. Use else to set waterLevel to 0.',
    failMessage:
      'Use > 0 in the condition, decrease waterLevel in the if branch, and assign 0 in the else branch.',
  },
  {
    id: 'windmill-1',
    nodeId: 'windmill',
    type: 'fix-code',
    title: 'Windmill: Repeat the greeting',
    prompt:
      'Use a for loop to print "Bean!" three times. Start at 0 and stop before the counter reaches 3.',
    acceptedAnswers: [
      'for (int i = 0; i < 3; i++) { System.out.println("Bean!"); }',
      'for (int i = 0; i < 3; i += 1) { System.out.println("Bean!"); }',
    ],
    hint: 'Set i to 0, use i < 3 as the condition, and increase i each time.',
    failMessage: 'Check that the loop runs 3 times and prints "Bean!" each time.',
  },
]
