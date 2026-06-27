/**
 * Auto-seed the exercise pool and the built-in system trainings on startup.
 * Both are idempotent: exercises are upserted by id, system plans by planetKey.
 * Exercises carry no duration — duration is set per-exercise inside a training.
 */
import { PrismaClient } from '@prisma/client';

export async function autoSeed(prisma: PrismaClient) {
  await seedExercises(prisma);
  await seedSystemPlans(prisma);
}

interface SeedExercise {
  id: string;
  nameDE: string; nameEN: string;
  detailDE: string; detailEN: string;
  formTipDE?: string; formTipEN?: string;
  imageUrl?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

const EXERCISES: SeedExercise[] = [
  { id: 'ub-ch-1', nameDE: 'Liegestütze', nameEN: 'Push-ups', detailDE: 'Schulterbreit', detailEN: 'Shoulder width', formTipDE: 'Körper gerade halten', formTipEN: 'Keep body straight', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids'], imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-2', nameDE: 'Weite Liegestütze', nameEN: 'Wide Push-ups', detailDE: 'Breite Griffweite', detailEN: 'Wide grip', formTipDE: 'Ellbogen nach außen', formTipEN: 'Elbows flare out', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front-deltoids'], imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-3', nameDE: 'Enge Liegestütze', nameEN: 'Close-grip Push-ups', detailDE: 'Schulterenge Griffweite', detailEN: 'Narrow grip', formTipDE: 'Ellbogen am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-4', nameDE: 'Negative Liegestütze', nameEN: 'Negative Push-ups', detailDE: 'Langsam nach unten', detailEN: 'Slow eccentric', formTipDE: '3-4 Sekunden nach unten', formTipEN: '3-4 seconds down', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids'], imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-5', nameDE: 'Diamond Liegestütze', nameEN: 'Diamond Push-ups', detailDE: 'Hände bilden Diamantform', detailEN: 'Hands form diamond', formTipDE: 'Ellbogen dicht am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], imageUrl: '/exercises/diamond-pushup.jpg' },
  { id: 'ub-ch-6', nameDE: 'Pike Liegestütze', nameEN: 'Pike Push-ups', detailDE: 'Hüfte hoch', detailEN: 'Hips high', formTipDE: 'V-Form mit dem Körper', formTipEN: 'Body forms V-shape', primaryMuscles: ['front-deltoids', 'triceps'], secondaryMuscles: ['chest', 'trapezius'], imageUrl: '/exercises/pike-pushup.gif' },
  { id: 'ub-sh-1', nameDE: 'Armkreisen', nameEN: 'Arm Circles', detailDE: 'Vorwärts & rückwärts', detailEN: 'Forward & backward', formTipDE: 'Große Kreise, Arme gestreckt', formTipEN: 'Large circles, arms straight', primaryMuscles: ['front-deltoids', 'back-deltoids'], secondaryMuscles: ['trapezius'], imageUrl: '/exercises/arm-circle.jpg' },
  { id: 'ub-sh-2', nameDE: 'Schulterdrücken', nameEN: 'Shoulder Press', detailDE: 'Kein Gewicht', detailEN: 'Bodyweight', formTipDE: 'Arme vollständig strecken', formTipEN: 'Fully extend arms', primaryMuscles: ['front-deltoids'], secondaryMuscles: ['triceps', 'trapezius'], imageUrl: '/exercises/arm-circle.jpg' },
  { id: 'ub-sh-3', nameDE: 'Seitheben', nameEN: 'Lateral Raises', detailDE: 'Langsam & kontrolliert', detailEN: 'Slow & controlled', primaryMuscles: ['back-deltoids', 'front-deltoids'], secondaryMuscles: ['trapezius'], imageUrl: '/exercises/lateral-raise.jpg' },
  { id: 'ub-sh-4', nameDE: 'Frontheben', nameEN: 'Front Raises', detailDE: 'Auf Schulterhöhe', detailEN: 'To shoulder height', primaryMuscles: ['front-deltoids'], secondaryMuscles: ['trapezius', 'chest'], imageUrl: '/exercises/front-raise.jpg' },
  { id: 'ub-bk-1', nameDE: 'Superman', nameEN: 'Superman', detailDE: 'Brust & Beine heben', detailEN: 'Lift chest & legs', formTipDE: 'Gluteal aktiv anspannen', formTipEN: 'Actively squeeze glutes', primaryMuscles: ['lower-back', 'gluteal'], secondaryMuscles: ['upper-back', 'hamstring'], imageUrl: '/exercises/superman.gif' },
  { id: 'ub-bk-2', nameDE: 'Bird Dog', nameEN: 'Bird Dog', detailDE: 'Abwechselnd Arm & Bein', detailEN: 'Alternating arm & leg', formTipDE: 'Rücken gerade halten', formTipEN: 'Keep back flat', primaryMuscles: ['lower-back', 'gluteal'], secondaryMuscles: ['abs', 'front-deltoids'], imageUrl: '/exercises/bird-dog.gif' },
  { id: 'ub-bk-3', nameDE: 'Rückenstrecken', nameEN: 'Back Extensions', detailDE: 'Auf dem Boden', detailEN: 'On the floor', formTipDE: 'Langsam und kontrolliert', formTipEN: 'Slow and controlled', primaryMuscles: ['lower-back'], secondaryMuscles: ['gluteal', 'upper-back'], imageUrl: '/exercises/superman.gif' },
  { id: 'cr-f-1', nameDE: 'Plank', nameEN: 'Plank', detailDE: 'Auf Unterarmen', detailEN: 'On forearms', formTipDE: 'Becken leicht kippen', formTipEN: 'Slight posterior tilt', primaryMuscles: ['abs'], secondaryMuscles: ['front-deltoids', 'lower-back', 'gluteal'], imageUrl: '/exercises/plank.jpg' },
  { id: 'cr-f-2', nameDE: 'High Plank', nameEN: 'High Plank', detailDE: 'Auf Händen', detailEN: 'On hands', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['chest', 'lower-back'], imageUrl: '/exercises/plank.jpg' },
  { id: 'cr-f-3', nameDE: 'Sit-ups', nameEN: 'Sit-ups', detailDE: 'Kontrolliert', detailEN: 'Controlled', formTipDE: 'Nacken nicht ziehen', formTipEN: "Don't pull neck", primaryMuscles: ['abs'], secondaryMuscles: ['obliques'], imageUrl: '/exercises/situp.gif' },
  { id: 'cr-f-4', nameDE: 'Crunches', nameEN: 'Crunches', detailDE: 'Schulterblätter heben', detailEN: 'Lift shoulder blades', primaryMuscles: ['abs'], secondaryMuscles: [], imageUrl: '/exercises/situp.gif' },
  { id: 'cr-f-5', nameDE: 'Beinheben', nameEN: 'Leg Raises', detailDE: 'Gestreckte Beine', detailEN: 'Straight legs', formTipDE: 'Lenden nicht hochwölben', formTipEN: "Don't arch lower back", primaryMuscles: ['abs'], secondaryMuscles: ['quadriceps'], imageUrl: '/exercises/leg-raise.gif' },
  { id: 'cr-s-1', nameDE: 'Seitstütz', nameEN: 'Side Plank', detailDE: 'Links & rechts', detailEN: 'Left & right', formTipDE: 'Hüfte anheben', formTipEN: 'Lift hips up', primaryMuscles: ['obliques'], secondaryMuscles: ['abs', 'adductor'], imageUrl: '/exercises/side-plank.jpg' },
  { id: 'cr-s-2', nameDE: 'Seitliche Crunches', nameEN: 'Oblique Crunches', detailDE: 'Wechselseitig', detailEN: 'Alternating', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'], imageUrl: '/exercises/situp.gif' },
  { id: 'cr-s-3', nameDE: 'Bicycle Crunches', nameEN: 'Bicycle Crunches', detailDE: 'Wechselseitig', detailEN: 'Alternating', formTipDE: 'Ellbogen zum gegenüberliegenden Knie', formTipEN: 'Elbow to opposite knee', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: ['quadriceps'], imageUrl: '/exercises/bicycle-crunch.jpg' },
  { id: 'cr-d-1', nameDE: 'Dead Bug', nameEN: 'Dead Bug', detailDE: 'Arm & Bein senken', detailEN: 'Lower arm & leg', formTipDE: 'Lendenwirbel am Boden halten', formTipEN: 'Keep lower back on floor', primaryMuscles: ['abs'], secondaryMuscles: ['lower-back', 'front-deltoids'], imageUrl: '/exercises/dead-bug.jpg' },
  { id: 'cr-d-2', nameDE: 'Mountain Climbers', nameEN: 'Mountain Climbers', detailDE: 'Moderate Geschwindigkeit', detailEN: 'Moderate speed', formTipDE: 'Hüfte auf Schulterhöhe halten', formTipEN: 'Keep hips at shoulder height', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['quadriceps', 'obliques'], imageUrl: '/exercises/mountain-climber.jpg' },
  { id: 'lg-q-1', nameDE: 'Kniebeugen', nameEN: 'Squats', detailDE: 'Tiefe Ausführung', detailEN: 'Deep squat', formTipDE: 'Oberschenkel parallel zum Boden', formTipEN: 'Thighs parallel to floor', primaryMuscles: ['quadriceps'], secondaryMuscles: ['gluteal', 'hamstring', 'calves'], imageUrl: '/exercises/squat.gif' },
  { id: 'lg-q-2', nameDE: 'Pulse Squats', nameEN: 'Pulse Squats', detailDE: 'Halb unten bleiben', detailEN: 'Stay halfway down', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['calves'], imageUrl: '/exercises/squat.gif' },
  { id: 'lg-q-3', nameDE: 'Sprungkniebeugen', nameEN: 'Jump Squats', detailDE: 'Explosiv', detailEN: 'Explosive', formTipDE: 'Sanfte Landung auf den Fußballen', formTipEN: 'Soft landing on balls of feet', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['calves', 'hamstring'], imageUrl: '/exercises/squat.gif' },
  { id: 'lg-q-4', nameDE: 'Bulgarische Kniebeugen', nameEN: 'Bulgarian Split Squats', detailDE: 'Hinteres Bein erhöht', detailEN: 'Rear foot elevated', formTipDE: 'Knie über zweite Zehe', formTipEN: 'Knee over second toe', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring', 'calves'], imageUrl: '/exercises/bulgarian-split-squat.gif' },
  { id: 'lg-h-1', nameDE: 'Ausfallschritte', nameEN: 'Lunges', detailDE: 'Wechselseitig', detailEN: 'Alternating', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring'], imageUrl: '/exercises/lunge.gif' },
  { id: 'lg-h-2', nameDE: 'Romanian Deadlift', nameEN: 'Romanian Deadlift', detailDE: 'Einbeinig', detailEN: 'Single leg', formTipDE: 'Knie leicht gebeugt, Rücken gerade', formTipEN: 'Slight knee bend, straight back', primaryMuscles: ['hamstring', 'lower-back'], secondaryMuscles: ['gluteal'], imageUrl: '/exercises/romanian-deadlift.gif' },
  { id: 'lg-h-3', nameDE: 'Glute Bridge', nameEN: 'Glute Bridge', detailDE: 'Hüfte anheben', detailEN: 'Lift hips', formTipDE: 'Gluteal oben maximal anspannen', formTipEN: 'Squeeze glutes at top', primaryMuscles: ['gluteal', 'hamstring'], secondaryMuscles: ['lower-back'], imageUrl: '/exercises/glute-bridge.gif' },
  { id: 'lg-c-1', nameDE: 'Calf Raises', nameEN: 'Calf Raises', detailDE: 'Langsam & kontrolliert', detailEN: 'Slow & controlled', formTipDE: 'Volle Streckung oben', formTipEN: 'Full extension at top', primaryMuscles: ['calves'], secondaryMuscles: [], imageUrl: '/exercises/calf-raise.gif' },
  { id: 'lg-c-2', nameDE: 'Wall Sit', nameEN: 'Wall Sit', detailDE: 'Statisch halten', detailEN: 'Hold static', formTipDE: 'Oberschenkel parallel zum Boden', formTipEN: 'Thighs parallel to floor', primaryMuscles: ['quadriceps'], secondaryMuscles: ['gluteal', 'calves'], imageUrl: '/exercises/wall-sit.svg' },
  { id: 'lg-e-1', nameDE: 'Jump Lunges', nameEN: 'Jump Lunges', detailDE: 'Wechselseitig', detailEN: 'Alternating', formTipDE: 'Weiche Landung, Knie stabil', formTipEN: 'Soft landing, stable knees', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring', 'calves'], imageUrl: '/exercises/lunge.gif' },
  { id: 'lg-e-2', nameDE: 'Donkey Kicks', nameEN: 'Donkey Kicks', detailDE: 'Auf allen Vieren', detailEN: 'On all fours', formTipDE: 'Hüfte stabil halten', formTipEN: 'Keep hips stable', primaryMuscles: ['gluteal'], secondaryMuscles: ['hamstring', 'lower-back'], imageUrl: '/exercises/donkey-kick.gif' },
  { id: 'cd-1', nameDE: 'Jumping Jacks', nameEN: 'Jumping Jacks', detailDE: 'Vollständig', detailEN: 'Full range', formTipDE: 'Arme über Kopf zusammenführen', formTipEN: 'Bring arms together overhead', primaryMuscles: ['quadriceps', 'calves'], secondaryMuscles: ['front-deltoids', 'abs'], imageUrl: '/exercises/jumping-jacks.gif' },
  { id: 'cd-2', nameDE: 'High Knees', nameEN: 'High Knees', detailDE: 'Schnell', detailEN: 'Fast', formTipDE: 'Knie auf Hüfthöhe', formTipEN: 'Knees to hip height', primaryMuscles: ['quadriceps', 'abs'], secondaryMuscles: ['hamstring', 'calves'], imageUrl: '/exercises/high-knees.gif' },
  { id: 'cd-3', nameDE: 'Burpees', nameEN: 'Burpees', detailDE: 'Volles Tempo', detailEN: 'Full pace', formTipDE: 'Volle Hüftstreckung beim Sprung', formTipEN: 'Full hip extension on jump', primaryMuscles: ['chest', 'quadriceps', 'abs'], secondaryMuscles: ['triceps', 'front-deltoids', 'gluteal'], imageUrl: '/exercises/burpee.gif' },
  { id: 'cd-4', nameDE: 'Inchworm', nameEN: 'Inchworm', detailDE: 'Hände laufen', detailEN: 'Hands walk out', formTipDE: 'Beine möglichst gestreckt halten', formTipEN: 'Keep legs as straight as possible', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['hamstring', 'lower-back'] },
  { id: 'mb-1', nameDE: 'Hüftkreisen', nameEN: 'Hip Circles', detailDE: 'Vorwärts & rückwärts', detailEN: 'Forward & backward', primaryMuscles: ['gluteal', 'adductor'], secondaryMuscles: ['lower-back'], imageUrl: '/exercises/hip-circle.gif' },
  { id: 'mb-2', nameDE: 'Taube', nameEN: 'Pigeon Pose', detailDE: 'Links & rechts halten', detailEN: 'Hold left & right', primaryMuscles: ['gluteal', 'adductor'], secondaryMuscles: [], imageUrl: '/exercises/pigeon-pose.jpg' },
  { id: 'mb-3', nameDE: 'Hüftbeuger-Stretch', nameEN: 'Hip Flexor Stretch', detailDE: 'Tiefer Ausfallschritt', detailEN: 'Deep lunge', primaryMuscles: ['adductor'], secondaryMuscles: ['quadriceps'], imageUrl: '/exercises/hip-flexor-stretch.jpg' },
  { id: 'mb-4', nameDE: 'Schulter-Stretch', nameEN: 'Shoulder Stretch', detailDE: 'Querstrecken', detailEN: 'Cross body', primaryMuscles: ['back-deltoids'], secondaryMuscles: ['upper-back'] },
  { id: 'pb-d-1', nameDE: 'Dips', nameEN: 'Dips', detailDE: 'Am Stuhl', detailEN: 'On chair', formTipDE: 'Ellbogen dicht am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], imageUrl: '/exercises/dips.gif' },
  { id: 'pb-d-2', nameDE: 'Pseudo-Planché', nameEN: 'Pseudo Planche', detailDE: 'Lean forward', detailEN: 'Lean forward', formTipDE: 'Schultern vor die Hände lehnen', formTipEN: 'Lean shoulders past hands', primaryMuscles: ['front-deltoids', 'chest'], secondaryMuscles: ['triceps', 'abs'], imageUrl: '/exercises/pseudo-planche.jpg' },
];

async function seedExercises(prisma: PrismaClient) {
  const count = await prisma.exercise.count();
  if (count > 0) return;
  console.log('[seed] Seeding exercises…');
  for (const ex of EXERCISES) {
    await prisma.exercise.upsert({ where: { id: ex.id }, update: ex, create: ex });
  }
  console.log(`[seed] ${EXERCISES.length} exercises seeded.`);
}

// ── System plans (ref-based) ─────────────────────────────────────────────────

interface SeedRefSection {
  id: string;
  label: string;
  rounds: number;
  restBetweenRounds: number;
  restAfterSection: number;
  exercises: { exerciseId: string; duration: number }[];
}
interface SeedPlan {
  planetKey: string;
  subtitle: string;
  category: string;
  sections: SeedRefSection[];
}

function block(id: string, label: string, rounds: number, restBetweenRounds: number, restAfterSection: number, exercises: [string, number][]): SeedRefSection {
  return { id, label, rounds, restBetweenRounds, restAfterSection, exercises: exercises.map(([exerciseId, duration]) => ({ exerciseId, duration })) };
}

const SYSTEM_PLANS: SeedPlan[] = [
  {
    planetKey: 'mercury', subtitle: 'Push · Beine · Core · Burnout', category: 'Ganzkörper',
    sections: [
      block('mercury-a', 'Block A – Push', 3, 60, 90, [['ub-ch-1', 45], ['ub-ch-6', 40], ['pb-d-1', 40]]),
      block('mercury-b', 'Block B – Beine', 3, 60, 90, [['lg-q-1', 45], ['lg-h-1', 45], ['lg-h-3', 40]]),
      block('mercury-c', 'Block C – Core', 2, 45, 60, [['cr-f-1', 45], ['cr-d-1', 40], ['cr-f-3', 40]]),
      block('mercury-d', 'Block D – Burnout', 1, 0, 0, [['cd-1', 45], ['cd-2', 40], ['cd-3', 30]]),
    ],
  },
  {
    planetKey: 'venus', subtitle: 'Brust · Schultern · Rücken · Burnout', category: 'Oberkörper',
    sections: [
      block('venus-a', 'Block A – Brust', 3, 60, 90, [['ub-ch-2', 50], ['ub-ch-3', 40], ['pb-d-2', 35]]),
      block('venus-b', 'Block B – Schultern', 3, 60, 90, [['ub-sh-1', 40], ['ub-ch-6', 45], ['ub-sh-3', 35]]),
      block('venus-c', 'Block C – Rücken', 2, 60, 60, [['ub-bk-1', 40], ['ub-bk-2', 40]]),
      block('venus-d', 'Block D – Burnout', 1, 0, 0, [['cr-d-2', 45], ['cd-3', 30]]),
    ],
  },
  {
    planetKey: 'mars', subtitle: 'Quads · Hamstrings · Explosiv · Burnout', category: 'Unterkörper',
    sections: [
      block('mars-a', 'Block A – Quads', 3, 60, 90, [['lg-q-1', 50], ['lg-q-2', 40], ['lg-q-3', 30]]),
      block('mars-b', 'Block B – Hamstrings', 3, 60, 90, [['lg-h-2', 45], ['lg-h-3', 45], ['lg-e-2', 35]]),
      block('mars-c', 'Block C – Explosiv', 2, 75, 60, [['lg-e-1', 35], ['lg-q-3', 30], ['lg-q-4', 35]]),
      block('mars-d', 'Block D – Burnout', 1, 0, 0, [['lg-h-1', 45], ['lg-c-1', 40], ['lg-c-2', 45]]),
    ],
  },
  {
    planetKey: 'jupiter', subtitle: 'Vorderseite · Seite · Dynamisch · Burnout', category: 'Core',
    sections: [
      block('jupiter-a', 'Block A – Vorderseite', 3, 45, 75, [['cr-f-1', 45], ['cr-f-3', 45], ['cr-f-5', 40]]),
      block('jupiter-b', 'Block B – Seite', 3, 45, 75, [['cr-s-1', 40], ['cr-s-3', 40], ['cr-s-2', 40]]),
      block('jupiter-c', 'Block C – Dynamisch', 2, 60, 60, [['cr-d-1', 45], ['cr-d-2', 40], ['ub-bk-2', 40]]),
      block('jupiter-d', 'Block D – Burnout', 1, 0, 0, [['cr-f-2', 40], ['cd-2', 35], ['cd-3', 30]]),
    ],
  },
  {
    planetKey: 'saturn', subtitle: '15-Minuten Ganzkörper-Circuit', category: 'HIIT',
    sections: [
      block('saturn-a', 'Ganzkörper Circuit', 3, 30, 0, [['cd-1', 30], ['lg-q-1', 30], ['ub-ch-1', 30], ['cr-d-2', 30], ['cd-2', 30]]),
    ],
  },
  {
    planetKey: 'neptune', subtitle: 'Aufwärmen · Unterkörper · Oberkörper · Cool-down', category: 'Mobilität',
    sections: [
      block('neptune-a', 'Warm-Up', 1, 0, 30, [['ub-sh-1', 45], ['mb-1', 45], ['cd-4', 50]]),
      block('neptune-b', 'Unterkörper', 1, 30, 30, [['mb-3', 50], ['lg-h-2', 50], ['mb-2', 50]]),
      block('neptune-c', 'Oberkörper', 1, 30, 30, [['mb-4', 45], ['ub-bk-2', 45]]),
      block('neptune-d', 'Cool-down', 1, 0, 0, [['cr-f-1', 60], ['mb-2', 60]]),
    ],
  },
];

async function seedSystemPlans(prisma: PrismaClient) {
  const count = await prisma.systemPlan.count();
  if (count > 0) return;
  console.log('[seed] Seeding system plans…');
  for (const p of SYSTEM_PLANS) {
    await prisma.systemPlan.upsert({
      where: { planetKey: p.planetKey },
      update: { subtitle: p.subtitle, category: p.category, sections: p.sections as any },
      create: { planetKey: p.planetKey, subtitle: p.subtitle, category: p.category, sections: p.sections as any },
    });
  }
  console.log(`[seed] ${SYSTEM_PLANS.length} system plans seeded.`);
}
