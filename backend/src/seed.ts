/**
 * Seed exercises from the hardcoded workout plans into the Exercise table.
 * Run: npx ts-node src/seed.ts
 * Or via Docker: docker exec puls-backend-1 npx ts-node src/seed.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map from animationType / exercise ID pattern to local image URL
const IMAGE_MAP: Record<string, string> = {
  'pushup': '/exercises/pushup.gif',
  'pike-pushup': '/exercises/pike-pushup.gif',
  'squat': '/exercises/squat.gif',
  'lunge': '/exercises/lunge.gif',
  'burpee': '/exercises/burpee.gif',
  'mountain-climber': '/exercises/mountain-climber.jpg',
  'high-knees': '/exercises/high-knees.gif',
  'jumping-jacks': '/exercises/jumping-jacks.gif',
  'situp': '/exercises/situp.gif',
  'plank': '/exercises/plank.gif',
  'side-plank': '/exercises/side-plank.jpg',
  'glute-bridge': '/exercises/glute-bridge.gif',
  'calf-raise': '/exercises/calf-raise.gif',
  'dead-bug': '/exercises/dead-bug.jpg',
  'dips': '/exercises/dips.gif',
  'arm-circle': '/exercises/arm-circle.gif',
  'hip-hinge': '/exercises/romanian-deadlift.gif',
  'hip-hinge-ro': '/exercises/romanian-deadlift.gif',
  'inchworm': '/exercises/inchworm.gif',
};

// All unique exercises extracted from workouts.ts
const EXERCISES = [
  // Upper body - push
  { id: 'ub-ch-1', nameDE: 'Liegestütze', nameEN: 'Push-ups', detailDE: 'Schulterbreit', detailEN: 'Shoulder width', formTipDE: 'Körper gerade halten', formTipEN: 'Keep body straight', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids'], duration: 45, imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-2', nameDE: 'Weite Liegestütze', nameEN: 'Wide Push-ups', detailDE: 'Breite Griffweite', detailEN: 'Wide grip', formTipDE: 'Ellbogen nach außen', formTipEN: 'Elbows flare out', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front-deltoids'], duration: 40, imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-3', nameDE: 'Enge Liegestütze', nameEN: 'Close-grip Push-ups', detailDE: 'Schulterenge Griffweite', detailEN: 'Narrow grip', formTipDE: 'Ellbogen am Körper halten', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], duration: 40, imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-4', nameDE: 'Negative Liegestütze', nameEN: 'Negative Push-ups', detailDE: 'Langsam nach unten', detailEN: 'Slow eccentric', formTipDE: '3-4 Sekunden nach unten', formTipEN: '3-4 seconds down', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids'], duration: 40, imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-5', nameDE: 'Diamond Liegestütze', nameEN: 'Diamond Push-ups', detailDE: 'Hände bilden Diamantform', detailEN: 'Hands form diamond', formTipDE: 'Ellbogen dicht am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], duration: 35, imageUrl: '/exercises/pushup.gif' },
  { id: 'ub-ch-6', nameDE: 'Pike Liegestütze', nameEN: 'Pike Push-ups', detailDE: 'Hüfte hoch', detailEN: 'Hips high', formTipDE: 'V-Form mit dem Körper', formTipEN: 'Body forms V-shape', primaryMuscles: ['front-deltoids', 'triceps'], secondaryMuscles: ['chest', 'trapezius'], duration: 40, imageUrl: '/exercises/pike-pushup.gif' },
  // Shoulders
  { id: 'ub-sh-1', nameDE: 'Armkreisen', nameEN: 'Arm Circles', detailDE: 'Vorwärts & rückwärts', detailEN: 'Forward & backward', formTipDE: 'Große Kreise, Arme gestreckt', formTipEN: 'Large circles, arms straight', primaryMuscles: ['front-deltoids', 'back-deltoids'], secondaryMuscles: ['trapezius'], duration: 40, imageUrl: '/exercises/arm-circle.gif' },
  { id: 'ub-sh-2', nameDE: 'Schulterdrücken', nameEN: 'Shoulder Press', detailDE: 'Kein Gewicht', detailEN: 'Bodyweight', formTipDE: 'Arme vollständig strecken', formTipEN: 'Fully extend arms', primaryMuscles: ['front-deltoids'], secondaryMuscles: ['triceps', 'trapezius'], duration: 35, imageUrl: '/exercises/arm-circle.gif' },
  { id: 'ub-sh-3', nameDE: 'Seitheben', nameEN: 'Lateral Raises', detailDE: 'Langsam & kontrolliert', detailEN: 'Slow & controlled', primaryMuscles: ['back-deltoids', 'front-deltoids'], secondaryMuscles: ['trapezius'], duration: 35, imageUrl: '/exercises/arm-circle.gif' },
  { id: 'ub-sh-4', nameDE: 'Frontheben', nameEN: 'Front Raises', detailDE: 'Auf Schulterhöhe', detailEN: 'To shoulder height', primaryMuscles: ['front-deltoids'], secondaryMuscles: ['trapezius', 'chest'], duration: 35, imageUrl: '/exercises/arm-circle.gif' },
  // Back
  { id: 'ub-bk-1', nameDE: 'Superman', nameEN: 'Superman', detailDE: 'Brust & Beine heben', detailEN: 'Lift chest & legs', formTipDE: 'Gluteal aktiv anspannen', formTipEN: 'Actively squeeze glutes', primaryMuscles: ['lower-back', 'gluteal'], secondaryMuscles: ['upper-back', 'hamstring'], duration: 40, imageUrl: '/exercises/superman.gif' },
  { id: 'ub-bk-2', nameDE: 'Bird Dog', nameEN: 'Bird Dog', detailDE: 'Abwechselnd Arm & Bein', detailEN: 'Alternating arm & leg', formTipDE: 'Rücken gerade halten', formTipEN: 'Keep back flat', primaryMuscles: ['lower-back', 'gluteal'], secondaryMuscles: ['abs', 'front-deltoids'], duration: 40, imageUrl: '/exercises/bird-dog.gif' },
  { id: 'ub-bk-3', nameDE: 'Rückenstrecken', nameEN: 'Back Extensions', detailDE: 'Auf dem Boden', detailEN: 'On the floor', formTipDE: 'Langsam und kontrolliert', formTipEN: 'Slow and controlled', primaryMuscles: ['lower-back'], secondaryMuscles: ['gluteal', 'upper-back'], duration: 35, imageUrl: '/exercises/superman.gif' },
  // Core
  { id: 'cr-f-1', nameDE: 'Plank', nameEN: 'Plank', detailDE: 'Auf Unterarmen', detailEN: 'On forearms', formTipDE: 'Becken leicht kippen', formTipEN: 'Slight posterior tilt', primaryMuscles: ['abs'], secondaryMuscles: ['front-deltoids', 'lower-back', 'gluteal'], duration: 45, imageUrl: '/exercises/plank.gif' },
  { id: 'cr-f-2', nameDE: 'High Plank', nameEN: 'High Plank', detailDE: 'Auf Händen', detailEN: 'On hands', formTipDE: 'Körper gerade wie ein Brett', formTipEN: 'Body straight as a board', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['chest', 'lower-back'], duration: 40, imageUrl: '/exercises/plank.gif' },
  { id: 'cr-f-3', nameDE: 'Sit-ups', nameEN: 'Sit-ups', detailDE: 'Kontrolliert', detailEN: 'Controlled', formTipDE: 'Nacken nicht ziehen', formTipEN: 'Don\'t pull neck', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'], duration: 40, imageUrl: '/exercises/situp.gif' },
  { id: 'cr-f-4', nameDE: 'Crunches', nameEN: 'Crunches', detailDE: 'Schulterblätter heben', detailEN: 'Lift shoulder blades', formTipDE: 'Unterer Rücken am Boden', formTipEN: 'Lower back on floor', primaryMuscles: ['abs'], secondaryMuscles: [], duration: 40, imageUrl: '/exercises/situp.gif' },
  { id: 'cr-f-5', nameDE: 'Beinheben', nameEN: 'Leg Raises', detailDE: 'Gestreckte Beine', detailEN: 'Straight legs', formTipDE: 'Lenden nicht hochwölben', formTipEN: 'Don\'t arch lower back', primaryMuscles: ['abs'], secondaryMuscles: ['quadriceps'], duration: 40, imageUrl: '/exercises/leg-raise.gif' },
  { id: 'cr-s-1', nameDE: 'Seitstütz', nameEN: 'Side Plank', detailDE: 'Links & rechts', detailEN: 'Left & right', formTipDE: 'Hüfte anheben', formTipEN: 'Lift hips up', primaryMuscles: ['obliques'], secondaryMuscles: ['abs', 'adductor'], duration: 30, imageUrl: '/exercises/side-plank.jpg' },
  { id: 'cr-s-2', nameDE: 'Seitliche Crunches', nameEN: 'Oblique Crunches', detailDE: 'Wechselseitig', detailEN: 'Alternating', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'], duration: 40, imageUrl: '/exercises/situp.gif' },
  { id: 'cr-s-3', nameDE: 'Bicycle Crunches', nameEN: 'Bicycle Crunches', detailDE: 'Wechselseitig', detailEN: 'Alternating', formTipDE: 'Ellbogen zum gegenüberliegenden Knie', formTipEN: 'Elbow to opposite knee', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: ['quadriceps'], duration: 40, imageUrl: '/exercises/bicycle-crunch.gif' },
  { id: 'cr-d-1', nameDE: 'Dead Bug', nameEN: 'Dead Bug', detailDE: 'Arm & Bein senken', detailEN: 'Lower arm & leg', formTipDE: 'Lendenwirbel am Boden halten', formTipEN: 'Keep lower back on floor', primaryMuscles: ['abs'], secondaryMuscles: ['lower-back', 'front-deltoids'], duration: 40, imageUrl: '/exercises/dead-bug.jpg' },
  { id: 'cr-d-2', nameDE: 'Mountain Climbers', nameEN: 'Mountain Climbers', detailDE: 'Moderate Geschwindigkeit', detailEN: 'Moderate speed', formTipDE: 'Hüfte auf Schulterhöhe halten', formTipEN: 'Keep hips at shoulder height', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['quadriceps', 'obliques'], duration: 40, imageUrl: '/exercises/mountain-climber.jpg' },
  // Legs
  { id: 'lg-q-1', nameDE: 'Kniebeugen', nameEN: 'Squats', detailDE: 'Tiefe Ausführung', detailEN: 'Deep squat', formTipDE: 'Oberschenkel parallel zum Boden', formTipEN: 'Thighs parallel to floor', primaryMuscles: ['quadriceps'], secondaryMuscles: ['gluteal', 'hamstring', 'calves'], duration: 50, imageUrl: '/exercises/squat.gif' },
  { id: 'lg-q-2', nameDE: 'Pulse Squats', nameEN: 'Pulse Squats', detailDE: 'Halb unten bleiben', detailEN: 'Stay halfway down', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['calves'], duration: 40, imageUrl: '/exercises/squat.gif' },
  { id: 'lg-q-3', nameDE: 'Sprungkniebeugen', nameEN: 'Jump Squats', detailDE: 'Explosiv', detailEN: 'Explosive', formTipDE: 'Sanfte Landung auf den Fußballen', formTipEN: 'Soft landing on balls of feet', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['calves', 'hamstring'], duration: 30, imageUrl: '/exercises/squat.gif' },
  { id: 'lg-q-4', nameDE: 'Bulgarische Kniebeugen', nameEN: 'Bulgarian Split Squats', detailDE: 'Hinteres Bein erhöht', detailEN: 'Rear foot elevated', formTipDE: 'Knie über zweite Zehe', formTipEN: 'Knee over second toe', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring', 'calves'], duration: 45, imageUrl: '/exercises/bulgarian-split-squat.gif' },
  { id: 'lg-h-1', nameDE: 'Ausfallschritte', nameEN: 'Lunges', detailDE: 'Wechselseitig', detailEN: 'Alternating', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring'], duration: 45, imageUrl: '/exercises/lunge.gif' },
  { id: 'lg-h-2', nameDE: 'Romanian Deadlift', nameEN: 'Romanian Deadlift', detailDE: 'Einbeinig', detailEN: 'Single leg', formTipDE: 'Knie leicht gebeugt, Rücken gerade', formTipEN: 'Slight knee bend, straight back', primaryMuscles: ['hamstring', 'lower-back'], secondaryMuscles: ['gluteal'], duration: 40, imageUrl: '/exercises/romanian-deadlift.gif' },
  { id: 'lg-h-3', nameDE: 'Glute Bridge', nameEN: 'Glute Bridge', detailDE: 'Hüfte anheben', detailEN: 'Lift hips', formTipDE: 'Gluteal oben maximal anspannen', formTipEN: 'Squeeze glutes at top', primaryMuscles: ['gluteal', 'hamstring'], secondaryMuscles: ['lower-back'], duration: 40, imageUrl: '/exercises/glute-bridge.gif' },
  { id: 'lg-c-1', nameDE: 'Calf Raises', nameEN: 'Calf Raises', detailDE: 'Langsam & kontrolliert', detailEN: 'Slow & controlled', formTipDE: 'Volle Streckung oben', formTipEN: 'Full extension at top', primaryMuscles: ['calves'], secondaryMuscles: [], duration: 40, imageUrl: '/exercises/calf-raise.gif' },
  { id: 'lg-c-2', nameDE: 'Wall Sit', nameEN: 'Wall Sit', detailDE: 'Statisch halten', detailEN: 'Hold static', formTipDE: 'Oberschenkel parallel zum Boden', formTipEN: 'Thighs parallel to floor', primaryMuscles: ['quadriceps'], secondaryMuscles: ['gluteal', 'calves'], duration: 45, imageUrl: '/exercises/wall-sit.svg' },
  { id: 'lg-e-1', nameDE: 'Jump Lunges', nameEN: 'Jump Lunges', detailDE: 'Wechselseitig', detailEN: 'Alternating', formTipDE: 'Weiche Landung, Knie stabil', formTipEN: 'Soft landing, stable knees', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring', 'calves'], duration: 35, imageUrl: '/exercises/lunge.gif' },
  { id: 'lg-e-2', nameDE: 'Donkey Kicks', nameEN: 'Donkey Kicks', detailDE: 'Auf allen Vieren', detailEN: 'On all fours', formTipDE: 'Hüfte stabil halten', formTipEN: 'Keep hips stable', primaryMuscles: ['gluteal'], secondaryMuscles: ['hamstring', 'lower-back'], duration: 35, imageUrl: '/exercises/donkey-kick.gif' },
  // Cardio
  { id: 'cd-1', nameDE: 'Jumping Jacks', nameEN: 'Jumping Jacks', detailDE: 'Vollständig', detailEN: 'Full range', formTipDE: 'Arme über Kopf zusammenführen', formTipEN: 'Bring arms together overhead', primaryMuscles: ['quadriceps', 'calves'], secondaryMuscles: ['front-deltoids', 'abs'], duration: 45, imageUrl: '/exercises/jumping-jacks.gif' },
  { id: 'cd-2', nameDE: 'High Knees', nameEN: 'High Knees', detailDE: 'Schnell', detailEN: 'Fast', formTipDE: 'Knie auf Hüfthöhe', formTipEN: 'Knees to hip height', primaryMuscles: ['quadriceps', 'abs'], secondaryMuscles: ['hamstring', 'calves'], duration: 40, imageUrl: '/exercises/high-knees.gif' },
  { id: 'cd-3', nameDE: 'Burpees', nameEN: 'Burpees', detailDE: 'Volles Tempo', detailEN: 'Full pace', formTipDE: 'Volle Hüftstreckung beim Sprung', formTipEN: 'Full hip extension on jump', primaryMuscles: ['chest', 'quadriceps', 'abs'], secondaryMuscles: ['triceps', 'front-deltoids', 'gluteal'], duration: 30, imageUrl: '/exercises/burpee.gif' },
  { id: 'cd-4', nameDE: 'Inchworm', nameEN: 'Inchworm', detailDE: 'Hände laufen', detailEN: 'Hands walk out', formTipDE: 'Beine möglichst gestreckt halten', formTipEN: 'Keep legs as straight as possible', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['hamstring', 'lower-back'], duration: 40, imageUrl: '/exercises/inchworm.gif' },
  // Stretch / mobility
  { id: 'mb-1', nameDE: 'Hüftkreisen', nameEN: 'Hip Circles', detailDE: 'Vorwärts & rückwärts', detailEN: 'Forward & backward', primaryMuscles: ['gluteal', 'adductor'], secondaryMuscles: ['lower-back'], duration: 30, imageUrl: '/exercises/hip-circle.gif' },
  { id: 'mb-2', nameDE: 'Taube', nameEN: 'Pigeon Pose', detailDE: 'Links & rechts halten', detailEN: 'Hold left & right', primaryMuscles: ['gluteal', 'adductor'], secondaryMuscles: [], duration: 60, imageUrl: '/exercises/pigeon-pose.gif' },
  { id: 'mb-3', nameDE: 'Hüftbeuger-Stretch', nameEN: 'Hip Flexor Stretch', detailDE: 'Tiefer Ausfallschritt', detailEN: 'Deep lunge', primaryMuscles: ['adductor'], secondaryMuscles: ['quadriceps'], duration: 60, imageUrl: '/exercises/hip-flexor-stretch.gif' },
  { id: 'mb-4', nameDE: 'Schulter-Stretch', nameEN: 'Shoulder Stretch', detailDE: 'Querstrecken', detailEN: 'Cross body', primaryMuscles: ['back-deltoids'], secondaryMuscles: ['upper-back'], duration: 30, imageUrl: '/exercises/arm-circle.gif' },
  // Dips / pull
  { id: 'pb-d-1', nameDE: 'Dips', nameEN: 'Dips', detailDE: 'Am Stuhl', detailEN: 'On chair', formTipDE: 'Ellbogen dicht am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], duration: 35, imageUrl: '/exercises/dips.gif' },
  { id: 'pb-d-2', nameDE: 'Pseudo-Planché', nameEN: 'Pseudo Planche', detailDE: 'Lean forward', detailEN: 'Lean forward', formTipDE: 'Schultern vor die Hände lehnen', formTipEN: 'Lean shoulders past hands', primaryMuscles: ['front-deltoids', 'chest'], secondaryMuscles: ['triceps', 'abs'], duration: 30, imageUrl: '/exercises/pseudo-planche.gif' },
];

async function main() {
  let created = 0, updated = 0;
  for (const ex of EXERCISES) {
    const existing = await prisma.exercise.findUnique({ where: { id: ex.id } });
    if (existing) {
      await prisma.exercise.update({ where: { id: ex.id }, data: ex });
      updated++;
    } else {
      await prisma.exercise.create({ data: ex });
      created++;
    }
  }
  console.log(`Seed complete: ${created} created, ${updated} updated.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
