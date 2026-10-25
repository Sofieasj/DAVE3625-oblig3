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
    title: 'Seed Shed: Store the seeds',
    story:
      'Bean blinks awake in the Seed Shed. "The storm wiped my memory! I know we still have 12 seed packets. Help me store that number."',
    lesson:
      'A variable is a labeled box. The type tells Java what fits in the box. int holds whole numbers.',
    prompt: 'Pick the type that stores the whole number 12.',
    starterCode: '___ seedPackets = 12;',
    options: ['int', 'String', 'boolean'],
    acceptedAnswers: ['int'],
    hint: 'Whole numbers like 12 are Integers. String is for text.',
    failMessage: 'That type cannot hold a number like 12. Try another one.',
    successMessage: 'Bean beeps: "12 packets saved!"',
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
    successMessage: 'The pump gurgles to life and water flows. Now we can water the seeds!',
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
    lesson: 'A for loop repeats code. i++ increases the lap number by 1. i-- subtracts 1.',
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
    title: 'Greenhouse: Water the tomatoes',
    story:
      'With the windmill turning, Bean unlocks the greenhouse. Three seed trays hold the first seedlings, and Bean wants to water the tomatoes.',
    lesson:
      'An array holds a list of values. Java counts positions from 0, so the first item is at index 0.',
    prompt: 'Fill in the index of the FIRST tray.',
    starterCode: `String[] trays = {"Tomatoes", "Pumpkins", "Sweet peas"};
String toWater = trays[___];`,
    options: ['0', '1', '2'],
    acceptedAnswers: ['0'],
    hint: 'Computers start counting at 0, not 1. Tomato seedlings are the first value in the array.',
    failMessage: 'Remember: the index is a position, not the value stored there.',
    successMessage: 'Tray 0 starts watering. Tiny green sprouts poke through the soil!',
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
    starterCode: `String[] trays = {"Tomatoes", "Pumpkins", "Sweet peas"};
String lastTray = trays[3];`,
    editableLine: 2,
    acceptedAnswers: ['String lastTray = trays[2];'],
    acceptedPatterns: [
      String.raw`^int\s+last\s*=\s*trays\[\s*(2|trays\.length\s*-\s*1)\s*\]\s*;$`,
    ],
    hint: 'Three items means the indexes are 0, 1 and...?',
    failMessage: 'Count the indexes from 0. Which one is the last of three?',
    successMessage: 'No more crash! The plants are watered and growing happily!',
  },
  {
    id: 'solar-roof-1',
    nodeId: 'solar-roof',
    type: 'write-line',
    title: 'Solar Roof: Connect the panels',
    story:
      'The greenhouse needs power at night. Grandma June installed panels and placed a battery beside them to store the energy. But they are not connected yet!',
    lesson:
      'In Java, you can ask an object to do something by calling one of its methods. Write object.method(argument); The argument tells the method what to work with.',
    prompt: 'Write one line that tells battery to connect to solarPanels.',
    starterCode: `Battery battery = new Battery();
SolarPanels solarPanels = new SolarPanels();
// your line goes here`,
    acceptedAnswers: ['battery.connect(solarPanels);'],
    acceptedPatterns: [String.raw`^battery\.connect\(\s*solarPanels\s*\)\s*;$`],
    hint: 'Start with battery, add a dot and the method name connect, then put solarPanels inside the parentheses.',
    failMessage:
      'Think of it as giving an instruction to an object: battery.connect(solarPanels); The battery is the object receiving the instruction, and solarPanels is the argument.',
    successMessage: 'Click! The solar panels are connected to the battery. Sunlight can now power the greenhouse, even after dark!',
  },
  {
    id: 'pet-barn-1',
    nodeId: 'pet-barn',
    type: 'fill-blank',
    title: 'Pet Barn: Welcome the raccoon',
    story:
      'Bean has decided to give the snack-stealing raccoon a home on the farm. The farm already has a Pet class with a name and a sound. Instead of writing those features all over again, Bean wants Raccoon to reuse what every Pet already has.',
    lesson:
      'Inheritance lets one class reuse features from another class. In Java, the keyword extends means that one class inherits from another. A Raccoon can extend Pet because a raccoon is a kind of pet.',
    prompt: 'Complete the class declaration so Raccoon inherits from Pet.',
    starterCode: `class Pet {
String name;
String sound() { return "..."; }
}

class Raccoon ___ Pet {
}`,
    options: ['extends', 'implements', 'inherits'],
    acceptedAnswers: ['extends'],
    hint: 'Java uses a special keyword to say that one class inherits from another.',
    failMessage: 'Use extends to show that Raccoon inherits features from Pet.',
    successMessage: 'Welcome home, raccoon! Raccoon can now reuse the features defined in Pet.',
  },
  {
    id: 'pet-barn-2',
    nodeId: 'pet-barn',
    type: 'fix-code',
    title: 'Pet Barn: Give it a voice',
    story:
      'The raccoon has moved into the barn! But when Bean asks what sound it makes, it only says "...". All pets have a sound() method, but each animal can make its own sound.',
    lesson:
      'A subclass can replace an inherited method with its own version. In Java, @Override marks a method that is intended to replace a method from the parent class. The return statement sends back the sound as a String.',
    prompt: 'Change line 4 to give the raccoon its own sound.',
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
    hint: 'Chitter! Keep return, the quotation marks, and the semicolon. Change only the text between the quotation marks.',
    failMessage:
      'Write return followed by a sound in quotation marks, then a semicolon. For example, return "chitter";',
    successMessage: 'Chitter! The raccoon has found its voice. Bean discovers that inherited behavior can be customized!',
  },
  {
    id: 'beacon-1',
    nodeId: 'beacon',
    type: 'quiz',
    title: 'Beacon: Count the flashes',
    story: 'The Beacon is almost ready! Bean wants it to flash three times to signal that the valley is safe. Before switching it on, Bean checks the loop that controls the flashes.',
    prompt: 'Which loop makes the Beacon flash exactly three times?',
    options: [
      'for (int i = 0; i < 3; i++)',
      'for (int i = 0; i <= 3; i++)',
      'for (int i = 1; i < 3; i++)',
    ],
    correctOption: 0,
    hint: 'The counter starts at 0. Which condition lets it run for 0, 1, and 2, but stops before 3?',
    failMessage: 'Count the values: the first loop runs for i = 0, 1, and 2. That is three flashes. The second runs four times, and the third runs twice.',
    successMessage: 'Three flashes! Bean confirms the timing is correct. The Beacon is ready for its final safety check.',
  },
  {
    id: 'beacon-2',
    nodeId: 'beacon',
    type: 'quiz',
    title: 'Beacon: Read the signal',
    story: 'The Beacon stores three signal codes in an array. Bean needs to read the second code to check that the correct signal will be sent across the valley.',
    lesson: 'An array stores values in order. Java starts indexing at 0, so index 1 refers to the second value.',
    prompt: 'The signal codes are {4, 8, 15}. What value does codes[1] return?',
    options: ['4', '8', '15'],
    correctOption: 1,
    hint: 'Index 0 is the first code. Move one position forward to find index 1.',
    failMessage: 'Java starts counting array positions at 0: codes[0] is 4, codes[1] is 8, and codes[2] is 15.',
    successMessage:
      'Signal confirmed! Both safety checks have passed. The Beacon blazes to life, and answering lights appear across the valley.',
  },
]
