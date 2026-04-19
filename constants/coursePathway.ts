/**
 * Mock “Duolingo-style” pathway: units, lessons, checkpoints.
 * Quiz copy is Spanish-flavored but works as a generic demo for any target language.
 */

export type QuizQuestion = {
  prompt: string;
  options: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
};

export type PathLessonKind = 'lesson' | 'checkpoint';

export type PathLesson = {
  id: string;
  unitId: string;
  title: string;
  kind: PathLessonKind;
  xp: number;
  /** Optional; when missing, `questionsForLesson` synthesizes a few MCQs. */
  questions?: QuizQuestion[];
};

export type PathUnit = {
  id: string;
  title: string;
  subtitle: string;
  /** Track / banner accent (hex). */
  accent: string;
  lessons: PathLesson[];
};

export const COURSE_UNITS: PathUnit[] = [
  {
    id: 'u1',
    title: 'Unit 1',
    subtitle: 'First steps',
    accent: '#58CC02',
    lessons: [
      {
        id: 'u1-l1',
        unitId: 'u1',
        title: 'Greetings',
        kind: 'lesson',
        xp: 10,
        questions: [
          {
            prompt: 'How do you say “Hello” in Spanish?',
            options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
            answerIndex: 0,
          },
          {
            prompt: '“Good morning” is often:',
            options: ['Buenas noches', 'Buenos días', 'Hasta luego', 'Perdón'],
            answerIndex: 1,
          },
        ],
      },
      {
        id: 'u1-l2',
        unitId: 'u1',
        title: 'Sounds',
        kind: 'lesson',
        xp: 10,
      },
      {
        id: 'u1-l3',
        unitId: 'u1',
        title: 'Basics 1',
        kind: 'lesson',
        xp: 12,
      },
      {
        id: 'u1-l4',
        unitId: 'u1',
        title: 'Basics 2',
        kind: 'lesson',
        xp: 12,
      },
      {
        id: 'u1-cp',
        unitId: 'u1',
        title: 'Unit 1 checkpoint',
        kind: 'checkpoint',
        xp: 20,
        questions: [
          {
            prompt: '“Thank you” in Spanish:',
            options: ['De nada', 'Gracias', 'Lo siento', 'Salud'],
            answerIndex: 1,
          },
          {
            prompt: '“Please” (common):',
            options: ['Por favor', 'Quizás', 'Tal vez', 'Aquí'],
            answerIndex: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'u2',
    title: 'Unit 2',
    subtitle: 'People & routines',
    accent: '#1CB0F6',
    lessons: [
      {
        id: 'u2-l1',
        unitId: 'u2',
        title: 'People',
        kind: 'lesson',
        xp: 14,
      },
      {
        id: 'u2-l2',
        unitId: 'u2',
        title: 'Verbs present',
        kind: 'lesson',
        xp: 14,
      },
      {
        id: 'u2-l3',
        unitId: 'u2',
        title: 'Time',
        kind: 'lesson',
        xp: 14,
      },
      {
        id: 'u2-l4',
        unitId: 'u2',
        title: 'Questions',
        kind: 'lesson',
        xp: 14,
      },
      {
        id: 'u2-cp',
        unitId: 'u2',
        title: 'Unit 2 checkpoint',
        kind: 'checkpoint',
        xp: 24,
        questions: [
          {
            prompt: '“Where is the bathroom?” ~',
            options: [
              '¿Dónde está el baño?',
              '¿Cuánto cuesta?',
              '¿Cómo te llamas?',
              'Me gusta el café.',
            ],
            answerIndex: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'u3',
    title: 'Unit 3',
    subtitle: 'Food & drink',
    accent: '#FF9600',
    lessons: [
      {
        id: 'u3-l1',
        unitId: 'u3',
        title: 'Food words',
        kind: 'lesson',
        xp: 16,
      },
      {
        id: 'u3-l2',
        unitId: 'u3',
        title: 'Drinks',
        kind: 'lesson',
        xp: 16,
      },
      {
        id: 'u3-l3',
        unitId: 'u3',
        title: 'Ordering',
        kind: 'lesson',
        xp: 16,
      },
      {
        id: 'u3-l4',
        unitId: 'u3',
        title: 'Review',
        kind: 'lesson',
        xp: 16,
      },
      {
        id: 'u3-cp',
        unitId: 'u3',
        title: 'Unit 3 checkpoint',
        kind: 'checkpoint',
        xp: 28,
        questions: [
          {
            prompt: '“I would like water.” ~',
            options: [
              'Quisiera agua.',
              'Tengo hambre.',
              'La cuenta, por favor.',
              'Estoy cansado.',
            ],
            answerIndex: 0,
          },
        ],
      },
    ],
  },
];

export const PLACEMENT_QUESTIONS: QuizQuestion[] = [
  {
    prompt: 'Choose the correct translation: “Goodbye”',
    options: ['Hola', 'Adiós', 'Buenos días', 'Sí'],
    answerIndex: 1,
  },
  {
    prompt: '“See you later” is closest to:',
    options: ['Hasta luego', 'Mucho gusto', 'Encantado', 'De nada'],
    answerIndex: 0,
  },
  {
    prompt: 'Match: “Sorry” (apology)',
    options: ['Perdón / Lo siento', 'Feliz', 'Rápido', 'Caro'],
    answerIndex: 0,
  },
  {
    prompt: '“I don’t understand.” ~',
    options: [
      'No entiendo.',
      'No sé.',
      'No hay problema.',
      'No importa.',
    ],
    answerIndex: 0,
  },
  {
    prompt: '“How much does it cost?” ~',
    options: [
      '¿Cuánto cuesta?',
      '¿Qué hora es?',
      '¿Dónde vives?',
      '¿Por qué?',
    ],
    answerIndex: 0,
  },
];

export function flattenLessons(units: PathUnit[] = COURSE_UNITS): PathLesson[] {
  return units.flatMap((u) => u.lessons);
}

export function questionsForLesson(lesson: PathLesson): QuizQuestion[] {
  if (lesson.questions?.length) {
    const need = 3 - lesson.questions.length;
    if (need <= 0) return lesson.questions.slice(0, 3);
    return [...lesson.questions, ...syntheticQuestions(lesson, need)];
  }
  return syntheticQuestions(lesson, 3);
}

function syntheticQuestions(lesson: PathLesson, count: number): QuizQuestion[] {
  const base = lesson.title;
  const pool: QuizQuestion[] = [
    {
      prompt: `In this lesson (“${base}”), pick the best study habit:`,
      options: [
        'Short daily practice',
        'Only on weekends',
        'Skip audio',
        'Avoid speaking aloud',
      ],
      answerIndex: 0,
    },
    {
      prompt: `Topic: “${base}” — which is a language-learning goal?`,
      options: [
        'Recognize common phrases',
        'Memorize random words only',
        'Ignore context',
        'Avoid review',
      ],
      answerIndex: 0,
    },
    {
      prompt: 'When you hear a new phrase, you should:',
      options: [
        'Repeat and shadow it',
        'Ignore pronunciation',
        'Only read silently',
        'Skip examples',
      ],
      answerIndex: 0,
    },
  ];
  return pool.slice(0, count);
}

export function lessonUnlockState(
  completedIds: Set<string>,
  units: PathUnit[] = COURSE_UNITS,
): Map<string, 'locked' | 'active' | 'completed'> {
  const flat = flattenLessons(units);
  const map = new Map<string, 'locked' | 'active' | 'completed'>();
  let foundActive = false;

  for (const lesson of flat) {
    if (completedIds.has(lesson.id)) {
      map.set(lesson.id, 'completed');
      continue;
    }
    if (!foundActive) {
      map.set(lesson.id, 'active');
      foundActive = true;
    } else {
      map.set(lesson.id, 'locked');
    }
  }

  return map;
}
