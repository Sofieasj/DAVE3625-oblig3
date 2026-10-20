type ExerciseBase = {
  id: string
  nodeId: string
  title: string
  prompt: string
  hint: string
  failMessage?: string
}

export type FixCodeExercise = ExerciseBase & {
  type: 'fix-code'
  acceptedAnswers: string[]
}

export type QuizExercise = ExerciseBase & {
  type: 'quiz'
  options: string[]
  correctOption: number
}

export type Exercise = FixCodeExercise | QuizExercise

export const exercises: Exercise[] = [
  {
    id: 'seed-shed-1',
    nodeId: 'seed-shed',
    type: 'fix-code',
    title: 'Seed Shed: Declare the seed count',
    prompt:
      'The seed crate is broken. Write a line so it declares an int called seedCount and sets it to 12.',
    acceptedAnswers: ['int seedCount = 12;'],
    hint: 'Use an int variable named seedCount and assign 12.',
    failMessage: 'The variable name or value is wrong. Double-check your spelling.',
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
      'Use > 0 in the condition, decrease waterLevel in the if branch, and assign 0 in the else branch. Double-check your spelling.',
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
    failMessage: 'Check that the loop runs 3 times and prints "Bean!" each time. Double-check your spelling.',
  },
  {
    id: 'greenhouse-1',
    nodeId: 'greenhouse',
    type: 'fix-code',
    title: 'Greenhouse: Plant the first seed',
    prompt:
      'Write a method called getFirstSeed that takes an int array named seedCounts and returns its first value.',
    acceptedAnswers: ['int getFirstSeed(int[] seedCounts) { return seedCounts[0]; }'],
    hint: 'The method returns an int. Use seedCounts[0] to access the first array value.',
    failMessage: 'Check the method name, array parameter, and first array index. Double-check your spelling.',
  },
  {
    id: 'pet-barn-1',
    nodeId: 'pet-barn',
    type: 'fix-code',
    title: 'Pet Barn: Build a Raccoon',
    prompt:
      'Create a Raccoon subclass of Pet and override sound() so it returns "Chitter!".',
    acceptedAnswers: [
      'class Raccoon extends Pet { @Override public String sound() { return "Chitter!"; } }',
    ],
    hint: 'Use "class Raccoon extends Pet" and add @Override above a sound() method that returns "Chitter!".',
    failMessage: 'Check the subclass name, parent class, and overridden sound method. Double-check your spelling.',
  },
  {
    id: 'solar-roof-1',
    nodeId: 'solar-roof',
    type: 'fix-code',
    title: 'Solar Roof: Connect the panels',
    prompt:
      'Connect the solarPanels object to the battery by calling the battery object’s connect method.',
    acceptedAnswers: ['battery.connect(solarPanels);'],
    hint: 'Call connect on battery and pass solarPanels as its argument.',
    failMessage: 'Check the object names and method call. Double-check your spelling.',
  },
  {
    id: 'beacon-quiz',
    nodeId: 'beacon',
    type: 'quiz',
    title: 'Beacon: Final Java check',
    prompt: 'Which Java loop runs its body exactly three times?',
    options: [
      'for (int i = 0; i < 3; i++)',
      'for (int i = 0; i <= 3; i++)',
      'for (int i = 1; i < 3; i++)',
    ],
    correctOption: 0,
    hint: 'Start at 0, continue while i is less than 3, and increase i by 1.',
    failMessage: 'Choose the loop that runs for i = 0, 1, and 2. Double-check your answer.',
  },
]
