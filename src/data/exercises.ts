type ExerciseBase = {
  id: string
  nodeId: string
  title: string
  story: string
  lesson?: string
  prompt: string
  hint: string
  failMessage?: string
  successMessage: string
}

type CodeAnswer = {
  acceptedAnswers: string[]
  acceptedPatterns?: string[]
  savesAs?: 'petSound'
}

export type FixCodeExercise = ExerciseBase &
  CodeAnswer & {
    type: 'fix-code'
    starterCode: string
    editableLine: number
  }

export type WriteLineExercise = ExerciseBase &
  CodeAnswer & {
    type: 'write-line'
    starterCode: string
  }

export type FillBlankExercise = ExerciseBase & {
  type: 'fill-blank'
  starterCode: string
  options: string[]
  acceptedAnswers: string[]
}

export type QuizExercise = ExerciseBase & {
  type: 'quiz'
  options: string[]
  correctOption: number
}

export type Exercise =
  | FixCodeExercise
  | WriteLineExercise
  | FillBlankExercise
  | QuizExercise

export const exercises: Exercise[] = [
  {
    id: 'seed-shed-1',
    nodeId: 'seed-shed',
    type: 'fill-blank',
    title: 'Seed Shed: Count the seed packets',
    story:
      'Bean blinks awake in the Seed Shed. "The storm wiped my memory! I know we still have 12 seed packets. Help me store that number."',
    lesson:
      'A variable is a labeled box. The type tells Java what fits in the box. int holds whole numbers.',
    prompt: 'Pick the type that stores the whole number 12.',
    starterCode: '___ seedPackets = 12;',
    options: ['int', 'String', 'boolean'],
    acceptedAnswers: ['int'],
    hint: 'Whole numbers like 12 use int. String is for text.',
    failMessage: 'That type cannot hold a number like 12. Try another one.',
    successMessage: 'Bean beeps: "12 packets saved!" The Seed Shed roof snaps back into place.',
  },
  {
    id: 'seed-shed-2',
    nodeId: 'seed-shed',
    type: 'fix-code',
    title: 'Seed Shed: Label the crate',
    story: 'Next Bean labels the crates, but the shed terminal flashes red and refuses the label.',
    lesson: 'Text goes in a String and is written in double quotes. Notice the capital S.',
    prompt: 'The label must hold the text "Tomato". Fix the type on line 1.',
    starterCode: 'int cropName = "Tomato";',
    editableLine: 1,
    acceptedAnswers: ['String cropName = "Tomato";'],
    acceptedPatterns: [String.raw`^String\s+cropName\s*=\s*"Tomato"\s*;$`],
    hint: 'int is for numbers. Which type holds text?',
    failMessage:
      'Java is picky: String needs a capital S, and the line must end with a semicolon.',
    successMessage:
      'The terminal turns green and the crates sort themselves. The Seed Shed is open for business!',
  },
  {
    id: 'water-pump-1',
    nodeId: 'water-pump',
    type: 'fill-blank',
    title: 'Water Pump: Only pump when there is water',
    story:
      'The seeds are ready, but they need water. Bean says the pump should only run while the tank still has some.',
    lesson:
      'An if statement runs its code only when the condition is true. > means "greater than".',
    prompt: 'Run the pump only if waterLevel is greater than 0.',
    starterCode: `if (waterLevel ___ 0) {
    pump.start();
}`,
    options: ['>', '<', '=='],
    acceptedAnswers: ['>'],
    hint: 'You want MORE than zero. Which symbol points that way?',
    failMessage: 'Not that one. If waterLevel is 0, the pump should stay off.',
    successMessage: 'The pump gurgles to life and water flows toward the Seed Shed.',
  },
  {
    id: 'water-pump-2',
    nodeId: 'water-pump',
    type: 'fix-code',
    title: 'Water Pump: Leak alarm',
    story:
      'A leak! If the tank ever hits exactly 0, the alarm must ring. But the alarm program crashes with an error.',
    lesson: 'One = stores a value. Two == asks "are these equal?" Conditions need ==.',
    prompt: 'Fix line 1 so it checks whether waterLevel equals 0.',
    starterCode: `if (waterLevel = 0) {
    alarm.ring();
}`,
    editableLine: 1,
    acceptedAnswers: ['if (waterLevel == 0) {'],
    acceptedPatterns: [String.raw`^if\s*\(\s*waterLevel\s*==\s*0\s*\)\s*\{?$`],
    hint: 'Checking whether two things are equal takes two equals signs in a row.',
    failMessage: 'Look at the symbol between waterLevel and 0. Only that needs to change.',
    successMessage: 'The alarm test blares, and the pump is now safe from running dry.',
  },
  {
    id: 'windmill-1',
    nodeId: 'windmill',
    type: 'fix-code',
    title: 'Windmill: Spin the blades',
    story:
      'The pump needs power, and the windmill is the only generator left. Its program should turn the blades 4 times, but it counts the wrong way and never stops.',
    lesson: 'A for loop repeats code. i++ adds 1 each lap. i-- subtracts 1.',
    prompt: 'Fix line 1 so the loop counts up and the blades turn 4 times.',
    starterCode: `for (int i = 0; i < 4; i--) {
    blades.rotate();
}`,
    editableLine: 1,
    acceptedAnswers: [
      'for (int i = 0; i < 4; i++) {',
      'for (int i = 0; i < 4; i += 1) {',
    ],
    acceptedPatterns: [
      String.raw`^for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*4\s*;\s*(i\+\+|\+\+i|i\s*\+=\s*1)\s*\)\s*\{?$`,
    ],
    hint: 'Counting down will never reach 4. Which operator counts up?',
    failMessage: 'Check the part after the second semicolon. The blades must count up to 4.',
    successMessage: 'Whoosh! The blades spin up and the whole farm hums with power.',
  },
  {
    id: 'greenhouse-1',
    nodeId: 'greenhouse',
    type: 'fill-blank',
    title: 'Greenhouse: The first tray',
    story:
      'With the windmill turning, Bean unlocks the greenhouse. Three seed trays hold the first seedlings, and Bean wants to water the first one.',
    lesson:
      'An array holds a list of values. Java counts positions from 0, so the first item is at index 0.',
    prompt: 'Fill in the index of the FIRST tray.',
    starterCode: `int[] trays = {4, 8, 15};
int first = trays[___];`,
    options: ['0', '1', '4'],
    acceptedAnswers: ['0'],
    hint: 'Computers start counting at 0, not 1.',
    failMessage: 'Remember: the index is a position, not the value stored there.',
    successMessage: 'Tray 0 starts watering. Tiny green sprouts poke through the soil.',
  },
  {
    id: 'greenhouse-2',
    nodeId: 'greenhouse',
    type: 'fix-code',
    title: 'Greenhouse: The last tray',
    story:
      'Now Bean checks the last tray, and the whole greenhouse crashes with an "index out of bounds" error.',
    lesson:
      'An array with 3 items has indexes 0, 1 and 2. Asking for index 3 crashes Java.',
    prompt: 'Fix line 2 so it reads the LAST of the three trays.',
    starterCode: `int[] trays = {4, 8, 15};
int last = trays[3];`,
    editableLine: 2,
    acceptedAnswers: ['int last = trays[2];'],
    acceptedPatterns: [
      String.raw`^int\s+last\s*=\s*trays\[\s*(2|trays\.length\s*-\s*1)\s*\]\s*;$`,
    ],
    hint: 'Three items means the indexes are 0, 1 and...?',
    failMessage: 'Count the indexes from 0. Which one is the last of three?',
    successMessage: 'No more crash! The greenhouse glass clears and sunlight pours in.',
  },
  {
    id: 'solar-roof-1',
    nodeId: 'solar-roof',
    type: 'write-line',
    title: 'Solar Roof: Connect the panels',
    story:
      'The greenhouse needs power at night. Grandma Juniper built a battery and solar panels, but she never connected them.',
    lesson:
      'Objects can do things. object.method(thing) asks the object to run a method, using the thing you pass in.',
    prompt: 'Write one line that asks battery to connect to solarPanels.',
    starterCode: `Battery battery = new Battery();
SolarPanels solarPanels = new SolarPanels();
// your line goes here`,
    acceptedAnswers: ['battery.connect(solarPanels);'],
    acceptedPatterns: [String.raw`^battery\.connect\(\s*solarPanels\s*\)\s*;$`],
    hint: 'Start with the object (battery), then a dot, then the method (connect), with the thing to connect as an argument in parentheses.',
    failMessage:
      'Check the order: object, dot, method name, then the argument in parentheses, then a semicolon.',
    successMessage: 'Click! The roof soaks up the sunshine and the battery glows green.',
  },
  {
    id: 'pet-barn-1',
    nodeId: 'pet-barn',
    type: 'fill-blank',
    title: 'Pet Barn: Adopt a raccoon',
    story:
      'A raccoon keeps sneaking into the barn for snacks. Bean says: "Let us make it the farm’s official pet!"',
    lesson:
      'Pet already has a name and a sound, that Raccoon can inherit. The keyword that means "is a kind of" lets Raccoon reuse all of it.',
    prompt: 'Make Raccoon a kind of Pet.',
    starterCode: `class Pet {
String name;
String sound() { return "..."; }
}

class Raccoon ___ Pet {
}`,
    options: ['extends', 'implements', 'inherits'],
    acceptedAnswers: ['extends'],
    hint: 'Look at the tip: which keyword means "extends the parent class"?',
    failMessage: 'Close, but Java uses a different keyword for inheriting from a class.',
    successMessage: 'The raccoon waddles in, sniffs around and moves into the barn.',
  },
  {
    id: 'pet-barn-2',
    nodeId: 'pet-barn',
    type: 'fix-code',
    title: 'Pet Barn: Give it a voice',
    story:
      'Pets have a sound() method, but the raccoon only says "...". Time to give it a voice of its own.',
    lesson:
      '@Override replaces the parent’s method with your own version. return hands back the sound.',
    prompt: 'Change line 4 so the raccoon makes a sound. You choose the sound!',
    starterCode: `class Raccoon extends Pet {
@Override
String sound() {
return "...";
}
}`,
    editableLine: 4,
    acceptedAnswers: [],
    acceptedPatterns: [String.raw`^return\s*"((?!\.\.\.")[^"]{1,20})"\s*;$`],
    savesAs: 'petSound',
    hint: 'Keep the quotes and the semicolon. Only change the text between the quotes.',
    failMessage:
      'Keep the format return "your sound"; and use 1 to 20 characters that are not just dots.',
    successMessage: 'The raccoon lets out its very own call. You have a farm pet!',
  },
  {
    id: 'beacon-1',
    nodeId: 'beacon',
    type: 'quiz',
    title: 'Beacon: Safety check 1',
    story: 'The Beacon is wired up! Before it lights, Bean runs two last safety checks.',
    prompt: 'Which loop runs its body exactly three times?',
    options: [
      'for (int i = 0; i < 3; i++)',
      'for (int i = 0; i <= 3; i++)',
      'for (int i = 1; i < 3; i++)',
    ],
    correctOption: 0,
    hint: 'Start at 0, continue while i is less than 3, and increase i by 1.',
    failMessage: 'Step through it: which loop uses i = 0, 1 and 2, and then stops?',
    successMessage: 'Check 1 passed. The windmill is safe.',
  },
  {
    id: 'beacon-2',
    nodeId: 'beacon',
    type: 'quiz',
    title: 'Beacon: Safety check 2',
    story: 'One more check: the greenhouse trays.',
    prompt: 'trays is {4, 8, 15}. What does trays[1] give you?',
    options: ['4', '8', '15'],
    correctOption: 1,
    hint: 'Index 0 is the first item. What is at index 1?',
    failMessage: 'Remember: counting starts at 0, so index 1 is the second item.',
    successMessage:
      'All checks passed! The Beacon blazes to life and answering lights appear across the valley.',
  },
]
