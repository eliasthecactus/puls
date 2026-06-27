/**
 * Auto-seed exercises and system plans on first startup.
 * Runs inside the same process, uses the shared prisma instance.
 */
import { PrismaClient } from '@prisma/client';

export async function autoSeed(prisma: PrismaClient) {
  await seedExercises(prisma);
  await seedSystemPlans(prisma);
}

async function seedExercises(prisma: PrismaClient) {
  const count = await prisma.exercise.count();
  if (count > 0) return;

  console.log('[seed] Seeding exercises…');

  const exercises = [
    { id: 'ub-ch-1', nameDE: 'Liegestütze', nameEN: 'Push-ups', detailDE: 'Schulterbreit', detailEN: 'Shoulder width', formTipDE: 'Körper gerade halten', formTipEN: 'Keep body straight', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids'], duration: 45, imageUrl: '/exercises/pushup.gif' },
    { id: 'ub-ch-2', nameDE: 'Weite Liegestütze', nameEN: 'Wide Push-ups', detailDE: 'Breite Griffweite', detailEN: 'Wide grip', formTipDE: 'Ellbogen nach außen', formTipEN: 'Elbows flare out', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front-deltoids'], duration: 40, imageUrl: '/exercises/pushup.gif' },
    { id: 'ub-ch-3', nameDE: 'Enge Liegestütze', nameEN: 'Close-grip Push-ups', detailDE: 'Schulterenge Griffweite', detailEN: 'Narrow grip', formTipDE: 'Ellbogen am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], duration: 40, imageUrl: '/exercises/pushup.gif' },
    { id: 'ub-ch-4', nameDE: 'Negative Liegestütze', nameEN: 'Negative Push-ups', detailDE: 'Langsam nach unten', detailEN: 'Slow eccentric', formTipDE: '3-4 Sekunden nach unten', formTipEN: '3-4 seconds down', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids'], duration: 40, imageUrl: '/exercises/pushup.gif' },
    { id: 'ub-ch-5', nameDE: 'Diamond Liegestütze', nameEN: 'Diamond Push-ups', detailDE: 'Hände bilden Diamantform', detailEN: 'Hands form diamond', formTipDE: 'Ellbogen dicht am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], duration: 35, imageUrl: '/exercises/pushup.gif' },
    { id: 'ub-ch-6', nameDE: 'Pike Liegestütze', nameEN: 'Pike Push-ups', detailDE: 'Hüfte hoch', detailEN: 'Hips high', formTipDE: 'V-Form mit dem Körper', formTipEN: 'Body forms V-shape', primaryMuscles: ['front-deltoids', 'triceps'], secondaryMuscles: ['chest', 'trapezius'], duration: 40, imageUrl: '/exercises/pike-pushup.gif' },
    { id: 'ub-sh-1', nameDE: 'Armkreisen', nameEN: 'Arm Circles', detailDE: 'Vorwärts & rückwärts', detailEN: 'Forward & backward', formTipDE: 'Große Kreise, Arme gestreckt', formTipEN: 'Large circles, arms straight', primaryMuscles: ['front-deltoids', 'back-deltoids'], secondaryMuscles: ['trapezius'], duration: 40, imageUrl: '/exercises/arm-circle.jpg' },
    { id: 'ub-sh-2', nameDE: 'Schulterdrücken', nameEN: 'Shoulder Press', detailDE: 'Kein Gewicht', detailEN: 'Bodyweight', formTipDE: 'Arme vollständig strecken', formTipEN: 'Fully extend arms', primaryMuscles: ['front-deltoids'], secondaryMuscles: ['triceps', 'trapezius'], duration: 35, imageUrl: '/exercises/arm-circle.jpg' },
    { id: 'ub-sh-3', nameDE: 'Seitheben', nameEN: 'Lateral Raises', detailDE: 'Langsam & kontrolliert', detailEN: 'Slow & controlled', primaryMuscles: ['back-deltoids', 'front-deltoids'], secondaryMuscles: ['trapezius'], duration: 35, imageUrl: '/exercises/lateral-raise.jpg' },
    { id: 'ub-sh-4', nameDE: 'Frontheben', nameEN: 'Front Raises', detailDE: 'Auf Schulterhöhe', detailEN: 'To shoulder height', primaryMuscles: ['front-deltoids'], secondaryMuscles: ['trapezius', 'chest'], duration: 35, imageUrl: '/exercises/front-raise.jpg' },
    { id: 'ub-bk-1', nameDE: 'Superman', nameEN: 'Superman', detailDE: 'Brust & Beine heben', detailEN: 'Lift chest & legs', formTipDE: 'Gluteal aktiv anspannen', formTipEN: 'Actively squeeze glutes', primaryMuscles: ['lower-back', 'gluteal'], secondaryMuscles: ['upper-back', 'hamstring'], duration: 40, imageUrl: '/exercises/superman.gif' },
    { id: 'ub-bk-2', nameDE: 'Bird Dog', nameEN: 'Bird Dog', detailDE: 'Abwechselnd Arm & Bein', detailEN: 'Alternating arm & leg', formTipDE: 'Rücken gerade halten', formTipEN: 'Keep back flat', primaryMuscles: ['lower-back', 'gluteal'], secondaryMuscles: ['abs', 'front-deltoids'], duration: 40, imageUrl: '/exercises/bird-dog.gif' },
    { id: 'ub-bk-3', nameDE: 'Rückenstrecken', nameEN: 'Back Extensions', detailDE: 'Auf dem Boden', detailEN: 'On the floor', formTipDE: 'Langsam und kontrolliert', formTipEN: 'Slow and controlled', primaryMuscles: ['lower-back'], secondaryMuscles: ['gluteal', 'upper-back'], duration: 35, imageUrl: '/exercises/superman.gif' },
    { id: 'cr-f-1', nameDE: 'Plank', nameEN: 'Plank', detailDE: 'Auf Unterarmen', detailEN: 'On forearms', formTipDE: 'Becken leicht kippen', formTipEN: 'Slight posterior tilt', primaryMuscles: ['abs'], secondaryMuscles: ['front-deltoids', 'lower-back', 'gluteal'], duration: 45, imageUrl: '/exercises/plank.jpg' },
    { id: 'cr-f-2', nameDE: 'High Plank', nameEN: 'High Plank', detailDE: 'Auf Händen', detailEN: 'On hands', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['chest', 'lower-back'], duration: 40, imageUrl: '/exercises/plank.jpg' },
    { id: 'cr-f-3', nameDE: 'Sit-ups', nameEN: 'Sit-ups', detailDE: 'Kontrolliert', detailEN: 'Controlled', formTipDE: 'Nacken nicht ziehen', formTipEN: "Don't pull neck", primaryMuscles: ['abs'], secondaryMuscles: ['obliques'], duration: 40, imageUrl: '/exercises/situp.gif' },
    { id: 'cr-f-4', nameDE: 'Crunches', nameEN: 'Crunches', detailDE: 'Schulterblätter heben', detailEN: 'Lift shoulder blades', primaryMuscles: ['abs'], secondaryMuscles: [], duration: 40, imageUrl: '/exercises/situp.gif' },
    { id: 'cr-f-5', nameDE: 'Beinheben', nameEN: 'Leg Raises', detailDE: 'Gestreckte Beine', detailEN: 'Straight legs', formTipDE: 'Lenden nicht hochwölben', formTipEN: "Don't arch lower back", primaryMuscles: ['abs'], secondaryMuscles: ['quadriceps'], duration: 40, imageUrl: '/exercises/leg-raise.gif' },
    { id: 'cr-s-1', nameDE: 'Seitstütz', nameEN: 'Side Plank', detailDE: 'Links & rechts', detailEN: 'Left & right', formTipDE: 'Hüfte anheben', formTipEN: 'Lift hips up', primaryMuscles: ['obliques'], secondaryMuscles: ['abs', 'adductor'], duration: 30, imageUrl: '/exercises/side-plank.jpg' },
    { id: 'cr-s-2', nameDE: 'Seitliche Crunches', nameEN: 'Oblique Crunches', detailDE: 'Wechselseitig', detailEN: 'Alternating', primaryMuscles: ['obliques'], secondaryMuscles: ['abs'], duration: 40, imageUrl: '/exercises/situp.gif' },
    { id: 'cr-s-3', nameDE: 'Bicycle Crunches', nameEN: 'Bicycle Crunches', detailDE: 'Wechselseitig', detailEN: 'Alternating', formTipDE: 'Ellbogen zum gegenüberliegenden Knie', formTipEN: 'Elbow to opposite knee', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: ['quadriceps'], duration: 40, imageUrl: '/exercises/bicycle-crunch.jpg' },
    { id: 'cr-d-1', nameDE: 'Dead Bug', nameEN: 'Dead Bug', detailDE: 'Arm & Bein senken', detailEN: 'Lower arm & leg', formTipDE: 'Lendenwirbel am Boden halten', formTipEN: 'Keep lower back on floor', primaryMuscles: ['abs'], secondaryMuscles: ['lower-back', 'front-deltoids'], duration: 40, imageUrl: '/exercises/dead-bug.jpg' },
    { id: 'cr-d-2', nameDE: 'Mountain Climbers', nameEN: 'Mountain Climbers', detailDE: 'Moderate Geschwindigkeit', detailEN: 'Moderate speed', formTipDE: 'Hüfte auf Schulterhöhe halten', formTipEN: 'Keep hips at shoulder height', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['quadriceps', 'obliques'], duration: 40, imageUrl: '/exercises/mountain-climber.jpg' },
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
    { id: 'cd-1', nameDE: 'Jumping Jacks', nameEN: 'Jumping Jacks', detailDE: 'Vollständig', detailEN: 'Full range', formTipDE: 'Arme über Kopf zusammenführen', formTipEN: 'Bring arms together overhead', primaryMuscles: ['quadriceps', 'calves'], secondaryMuscles: ['front-deltoids', 'abs'], duration: 45, imageUrl: '/exercises/jumping-jacks.gif' },
    { id: 'cd-2', nameDE: 'High Knees', nameEN: 'High Knees', detailDE: 'Schnell', detailEN: 'Fast', formTipDE: 'Knie auf Hüfthöhe', formTipEN: 'Knees to hip height', primaryMuscles: ['quadriceps', 'abs'], secondaryMuscles: ['hamstring', 'calves'], duration: 40, imageUrl: '/exercises/high-knees.gif' },
    { id: 'cd-3', nameDE: 'Burpees', nameEN: 'Burpees', detailDE: 'Volles Tempo', detailEN: 'Full pace', formTipDE: 'Volle Hüftstreckung beim Sprung', formTipEN: 'Full hip extension on jump', primaryMuscles: ['chest', 'quadriceps', 'abs'], secondaryMuscles: ['triceps', 'front-deltoids', 'gluteal'], duration: 30, imageUrl: '/exercises/burpee.gif' },
    { id: 'cd-4', nameDE: 'Inchworm', nameEN: 'Inchworm', detailDE: 'Hände laufen', detailEN: 'Hands walk out', formTipDE: 'Beine möglichst gestreckt halten', formTipEN: 'Keep legs as straight as possible', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['hamstring', 'lower-back'], duration: 40 },
    { id: 'mb-1', nameDE: 'Hüftkreisen', nameEN: 'Hip Circles', detailDE: 'Vorwärts & rückwärts', detailEN: 'Forward & backward', primaryMuscles: ['gluteal', 'adductor'], secondaryMuscles: ['lower-back'], duration: 30, imageUrl: '/exercises/hip-circle.gif' },
    { id: 'mb-2', nameDE: 'Taube', nameEN: 'Pigeon Pose', detailDE: 'Links & rechts halten', detailEN: 'Hold left & right', primaryMuscles: ['gluteal', 'adductor'], secondaryMuscles: [], duration: 60, imageUrl: '/exercises/pigeon-pose.jpg' },
    { id: 'mb-3', nameDE: 'Hüftbeuger-Stretch', nameEN: 'Hip Flexor Stretch', detailDE: 'Tiefer Ausfallschritt', detailEN: 'Deep lunge', primaryMuscles: ['adductor'], secondaryMuscles: ['quadriceps'], duration: 60, imageUrl: '/exercises/hip-flexor-stretch.jpg' },
    { id: 'mb-4', nameDE: 'Schulter-Stretch', nameEN: 'Shoulder Stretch', detailDE: 'Querstrecken', detailEN: 'Cross body', primaryMuscles: ['back-deltoids'], secondaryMuscles: ['upper-back'], duration: 30 },
    { id: 'pb-d-1', nameDE: 'Dips', nameEN: 'Dips', detailDE: 'Am Stuhl', detailEN: 'On chair', formTipDE: 'Ellbogen dicht am Körper', formTipEN: 'Elbows close to body', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'], duration: 35, imageUrl: '/exercises/dips.gif' },
    { id: 'pb-d-2', nameDE: 'Pseudo-Planché', nameEN: 'Pseudo Planche', detailDE: 'Lean forward', detailEN: 'Lean forward', formTipDE: 'Schultern vor die Hände lehnen', formTipEN: 'Lean shoulders past hands', primaryMuscles: ['front-deltoids', 'chest'], secondaryMuscles: ['triceps', 'abs'], duration: 30, imageUrl: '/exercises/pseudo-planche.jpg' },
  ];

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: ex,
      create: ex,
    });
  }
  console.log(`[seed] ${exercises.length} exercises seeded.`);
}

async function seedSystemPlans(prisma: PrismaClient) {
  const count = await prisma.systemPlan.count();
  if (count > 0) return;

  console.log('[seed] Seeding system plans…');

  // Full workout data from workouts.ts, stored as JSON in the DB
  const plans = [
    {
      planKey: 'full-body',
      name: { de: 'Merkur', en: 'Mercury' },
      subtitle: { de: 'Push · Beine · Core · Burnout', en: 'Push · Legs · Core · Burnout' },
      category: 'Kraft', duration: 40, icon: 'dumbbell', color: ['#7c3aed', '#5b21b6'], sortOrder: 0,
      sections: [
        { id: 'fb-push', name: 'Push', label: { de: 'Block A – Push', en: 'Block A – Push' }, rounds: 3, restBetweenRounds: 60, restAfterSection: 90, exercises: [
          { id: 'fb-push-1', name: { de: 'Liegestütze', en: 'Push-ups' }, detail: { de: 'Schulterbreiter Griff', en: 'Shoulder-width grip' }, duration: 45, formTip: { de: 'Ellbogen 45° zum Körper', en: 'Elbows 45° from body' }, animationType: 'pushup', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids', 'abs'] },
          { id: 'fb-push-2', name: { de: 'Schulterdrücken', en: 'Shoulder Press' }, detail: { de: 'Pike Position', en: 'Pike position' }, duration: 40, formTip: { de: 'Hüfte hoch, Kopf zwischen den Armen', en: 'Hips up, head between arms' }, animationType: 'pike-pushup', primaryMuscles: ['front-deltoids', 'triceps'], secondaryMuscles: ['trapezius', 'chest'] },
          { id: 'fb-push-3', name: { de: 'Trizeps-Dips', en: 'Tricep Dips' }, detail: { de: 'An der Stuhlkante', en: 'At the chair edge' }, duration: 40, formTip: { de: 'Hüfte nahe an der Kante', en: 'Hips close to the edge' }, animationType: 'dips', primaryMuscles: ['triceps'], secondaryMuscles: ['chest', 'front-deltoids'] },
        ]},
        { id: 'fb-legs', name: 'Legs', label: { de: 'Block B – Beine', en: 'Block B – Legs' }, rounds: 3, restBetweenRounds: 60, restAfterSection: 90, exercises: [
          { id: 'fb-legs-1', name: { de: 'Kniebeugen', en: 'Squats' }, detail: { de: 'Körpergewicht', en: 'Bodyweight' }, duration: 45, formTip: { de: 'Knie über Zehen, Rücken gerade', en: 'Knees over toes, back straight' }, animationType: 'squat', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring', 'calves'] },
          { id: 'fb-legs-2', name: { de: 'Ausfallschritte', en: 'Lunges' }, detail: { de: 'Wechselseitig', en: 'Alternating' }, duration: 45, formTip: { de: '90° Kniewinkel, Knie nicht über Zehen', en: '90° knee angle, knee not past toes' }, animationType: 'lunge', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring', 'calves', 'adductor'] },
          { id: 'fb-legs-3', name: { de: 'Glute Bridge', en: 'Glute Bridge' }, detail: { de: 'Beidbeinig', en: 'Both legs' }, duration: 40, formTip: { de: 'Hüfte vollständig strecken', en: 'Fully extend the hips' }, animationType: 'glute-bridge', primaryMuscles: ['gluteal', 'hamstring'], secondaryMuscles: ['lower-back', 'abs'] },
        ]},
        { id: 'fb-core', name: 'Core', label: { de: 'Block C – Core', en: 'Block C – Core' }, rounds: 2, restBetweenRounds: 45, restAfterSection: 60, exercises: [
          { id: 'fb-core-1', name: { de: 'Plank', en: 'Plank' }, detail: { de: 'Unterarme am Boden', en: 'Forearms on ground' }, duration: 45, formTip: { de: 'Becken neutral, nicht durchhängen', en: 'Neutral pelvis, no sagging' }, animationType: 'plank', primaryMuscles: ['abs', 'obliques'], secondaryMuscles: ['front-deltoids', 'gluteal'] },
          { id: 'fb-core-2', name: { de: 'Dead Bug', en: 'Dead Bug' }, detail: { de: 'Arm & Bein wechselseitig', en: 'Arm & leg alternating' }, duration: 40, formTip: { de: 'Lendenwirbel am Boden halten', en: 'Keep lower back pressed to floor' }, animationType: 'dead-bug', primaryMuscles: ['abs'], secondaryMuscles: ['obliques', 'lower-back'] },
          { id: 'fb-core-3', name: { de: 'Sit-ups', en: 'Sit-ups' }, detail: { de: 'Hände hinter Kopf', en: 'Hands behind head' }, duration: 40, formTip: { de: 'Nacken nicht ziehen', en: "Don't pull on neck" }, animationType: 'situp', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'] },
        ]},
        { id: 'fb-burnout', name: 'Burnout', label: { de: 'Block D – Burnout', en: 'Block D – Burnout' }, rounds: 1, restBetweenRounds: 0, restAfterSection: 0, exercises: [
          { id: 'fb-burn-1', name: { de: 'Jumping Jacks', en: 'Jumping Jacks' }, detail: { de: 'Vollständig', en: 'Full range' }, duration: 45, animationType: 'jumping-jacks', primaryMuscles: ['quadriceps', 'calves'], secondaryMuscles: ['front-deltoids', 'abs'] },
          { id: 'fb-burn-2', name: { de: 'High Knees', en: 'High Knees' }, detail: { de: 'Schnell', en: 'Fast' }, duration: 40, animationType: 'high-knees', primaryMuscles: ['quadriceps', 'abs'], secondaryMuscles: ['hamstring', 'calves'] },
          { id: 'fb-burn-3', name: { de: 'Burpees', en: 'Burpees' }, detail: { de: 'Volles Tempo', en: 'Full pace' }, duration: 30, animationType: 'burpee', primaryMuscles: ['chest', 'quadriceps', 'abs'], secondaryMuscles: ['triceps', 'front-deltoids', 'gluteal'] },
        ]},
      ],
    },
    {
      planKey: 'upper-body', name: { de: 'Venus', en: 'Venus' }, subtitle: { de: 'Brust · Schultern · Rücken · Burnout', en: 'Chest · Shoulders · Back · Burnout' },
      category: 'Kraft', duration: 35, icon: 'barbell', color: ['#3b82f6', '#0e7490'], sortOrder: 1,
      sections: [
        { id: 'ub-chest', name: 'Brust', label: { de: 'Block A – Brust', en: 'Block A – Chest' }, rounds: 3, restBetweenRounds: 60, restAfterSection: 90, exercises: [
          { id: 'ub-ch-1', name: { de: 'Weite Liegestütze', en: 'Wide Push-ups' }, detail: { de: 'Breiter als schulterbreit', en: 'Wider than shoulder-width' }, duration: 50, animationType: 'pushup', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front-deltoids'] },
          { id: 'ub-ch-2', name: { de: 'Enge Liegestütze', en: 'Close-grip Push-ups' }, detail: { de: 'Hände unter Schultern', en: 'Hands under shoulders' }, duration: 40, animationType: 'pushup', primaryMuscles: ['triceps', 'chest'], secondaryMuscles: ['front-deltoids'] },
          { id: 'ub-ch-3', name: { de: 'Pseudo Planche', en: 'Pseudo Planche' }, detail: { de: 'Finger nach hinten', en: 'Fingers pointing back' }, duration: 35, animationType: 'plank', primaryMuscles: ['chest', 'front-deltoids'], secondaryMuscles: ['triceps', 'abs'] },
        ]},
        { id: 'ub-shoulders', name: 'Schultern', label: { de: 'Block B – Schultern', en: 'Block B – Shoulders' }, rounds: 3, restBetweenRounds: 60, restAfterSection: 90, exercises: [
          { id: 'ub-sh-1', name: { de: 'Armkreisen', en: 'Arm Circles' }, detail: { de: 'Vorwärts & rückwärts', en: 'Forward & backward' }, duration: 40, animationType: 'arm-circle', primaryMuscles: ['front-deltoids', 'back-deltoids'], secondaryMuscles: ['trapezius'] },
          { id: 'ub-sh-2', name: { de: 'Pike Liegestütze', en: 'Pike Push-ups' }, detail: { de: 'Hüfte hoch', en: 'Hips up' }, duration: 45, animationType: 'pike-pushup', primaryMuscles: ['front-deltoids', 'triceps'], secondaryMuscles: ['trapezius', 'upper-back'] },
          { id: 'ub-sh-3', name: { de: 'Seitheben', en: 'Lateral Raises' }, detail: { de: 'Langsam & kontrolliert', en: 'Slow & controlled' }, duration: 35, animationType: 'arm-circle', primaryMuscles: ['back-deltoids', 'front-deltoids'], secondaryMuscles: ['trapezius'] },
        ]},
        { id: 'ub-back', name: 'Rücken', label: { de: 'Block C – Rücken', en: 'Block C – Back' }, rounds: 2, restBetweenRounds: 60, restAfterSection: 60, exercises: [
          { id: 'ub-bk-1', name: { de: 'Superman', en: 'Superman' }, detail: { de: 'Bauchlage', en: 'Prone position' }, duration: 40, animationType: 'hip-hinge', primaryMuscles: ['upper-back', 'lower-back'], secondaryMuscles: ['gluteal', 'back-deltoids'] },
          { id: 'ub-bk-2', name: { de: 'Rückwärts-Armheben', en: 'Rear Delt Raises' }, detail: { de: 'T-Position', en: 'T-position' }, duration: 40, animationType: 'hip-hinge', primaryMuscles: ['back-deltoids', 'upper-back'], secondaryMuscles: ['trapezius', 'lower-back'] },
        ]},
        { id: 'ub-burnout', name: 'Burnout', label: { de: 'Block D – Burnout', en: 'Block D – Burnout' }, rounds: 1, restBetweenRounds: 0, restAfterSection: 0, exercises: [
          { id: 'ub-bn-1', name: { de: 'Mountain Climbers', en: 'Mountain Climbers' }, detail: { de: 'Maximales Tempo', en: 'Maximum pace' }, duration: 45, animationType: 'mountain-climber', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['quadriceps', 'chest'] },
          { id: 'ub-bn-2', name: { de: 'Burpees', en: 'Burpees' }, detail: { de: 'Volle Streckung', en: 'Full extension' }, duration: 30, animationType: 'burpee', primaryMuscles: ['chest', 'quadriceps', 'abs'], secondaryMuscles: ['triceps', 'front-deltoids', 'gluteal'] },
        ]},
      ],
    },
    {
      planKey: 'legs', name: { de: 'Mars', en: 'Mars' }, subtitle: { de: 'Quads · Hamstrings · Explosiv · Burnout', en: 'Quads · Hamstrings · Explosive · Burnout' },
      category: 'Kraft', duration: 35, icon: 'legs', color: ['#f97316', '#b91c1c'], sortOrder: 2,
      sections: [
        { id: 'lg-quads', name: 'Quads', label: { de: 'Block A – Quads', en: 'Block A – Quads' }, rounds: 3, restBetweenRounds: 60, restAfterSection: 90, exercises: [
          { id: 'lg-q-1', name: { de: 'Kniebeugen', en: 'Squats' }, detail: { de: 'Tiefe Ausführung', en: 'Deep squat' }, duration: 50, animationType: 'squat', primaryMuscles: ['quadriceps'], secondaryMuscles: ['gluteal', 'hamstring', 'calves'] },
          { id: 'lg-q-2', name: { de: 'Pulse Squats', en: 'Pulse Squats' }, detail: { de: 'Halb unten bleiben', en: 'Stay halfway down' }, duration: 40, animationType: 'squat', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['calves'] },
          { id: 'lg-q-3', name: { de: 'Sprungkniebeugen', en: 'Jump Squats' }, detail: { de: 'Explosiv', en: 'Explosive' }, duration: 30, animationType: 'squat', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['calves', 'hamstring'] },
        ]},
        { id: 'lg-hamstrings', name: 'Hamstrings', label: { de: 'Block B – Hamstrings', en: 'Block B – Hamstrings' }, rounds: 3, restBetweenRounds: 60, restAfterSection: 90, exercises: [
          { id: 'lg-h-1', name: { de: 'Romanian Deadlift', en: 'Romanian Deadlift' }, detail: { de: 'Einbeinig oder beidbeinig', en: 'Single or both legs' }, duration: 45, animationType: 'hip-hinge', primaryMuscles: ['hamstring', 'lower-back'], secondaryMuscles: ['gluteal', 'calves'] },
          { id: 'lg-h-2', name: { de: 'Glute Bridge', en: 'Glute Bridge' }, detail: { de: 'Beidbeinig', en: 'Both legs' }, duration: 45, animationType: 'glute-bridge', primaryMuscles: ['gluteal', 'hamstring'], secondaryMuscles: ['lower-back'] },
          { id: 'lg-h-3', name: { de: 'Single-Leg Bridge', en: 'Single-Leg Bridge' }, detail: { de: 'Wechselseitig', en: 'Alternating' }, duration: 35, animationType: 'glute-bridge', primaryMuscles: ['gluteal', 'hamstring'], secondaryMuscles: ['lower-back', 'abs'] },
        ]},
        { id: 'lg-explosive', name: 'Explosiv', label: { de: 'Block C – Explosiv', en: 'Block C – Explosive' }, rounds: 2, restBetweenRounds: 75, restAfterSection: 60, exercises: [
          { id: 'lg-e-1', name: { de: 'Jump Lunges', en: 'Jump Lunges' }, detail: { de: 'Wechselseitig', en: 'Alternating' }, duration: 35, animationType: 'lunge', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring', 'calves'] },
          { id: 'lg-e-2', name: { de: 'Box Jumps', en: 'Box Jumps' }, detail: { de: 'Auf Stuhl oder Stufe', en: 'On chair or step' }, duration: 30, animationType: 'jumping-jacks', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['calves', 'hamstring'] },
          { id: 'lg-e-3', name: { de: 'Lateral Jumps', en: 'Lateral Jumps' }, detail: { de: 'Seitliche Sprünge', en: 'Side jumps' }, duration: 35, animationType: 'jumping-jacks', primaryMuscles: ['quadriceps', 'adductor'], secondaryMuscles: ['gluteal', 'calves'] },
        ]},
        { id: 'lg-burnout', name: 'Burnout', label: { de: 'Block D – Burnout', en: 'Block D – Burnout' }, rounds: 1, restBetweenRounds: 0, restAfterSection: 0, exercises: [
          { id: 'lg-bn-1', name: { de: 'Ausfallschritte', en: 'Lunges' }, detail: { de: 'Wechselseitig', en: 'Alternating' }, duration: 45, animationType: 'lunge', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring'] },
          { id: 'lg-bn-2', name: { de: 'Calf Raises', en: 'Calf Raises' }, detail: { de: 'Langsam & kontrolliert', en: 'Slow & controlled' }, duration: 40, animationType: 'calf-raise', primaryMuscles: ['calves'], secondaryMuscles: ['calves'] },
          { id: 'lg-bn-3', name: { de: 'Wall Sit', en: 'Wall Sit' }, detail: { de: 'Statisch halten', en: 'Hold static' }, duration: 45, animationType: 'squat', primaryMuscles: ['quadriceps'], secondaryMuscles: ['gluteal', 'calves'] },
        ]},
      ],
    },
    {
      planKey: 'core', name: { de: 'Jupiter', en: 'Jupiter' }, subtitle: { de: 'Vorderseite · Seite · Dynamisch · Burnout', en: 'Front · Side · Dynamic · Burnout' },
      category: 'Core', duration: 30, icon: 'core', color: ['#10b981', '#0f766e'], sortOrder: 3,
      sections: [
        { id: 'cr-front', name: 'Vorderseite', label: { de: 'Block A – Vorderseite', en: 'Block A – Front' }, rounds: 3, restBetweenRounds: 45, restAfterSection: 75, exercises: [
          { id: 'cr-f-1', name: { de: 'Plank', en: 'Plank' }, detail: { de: 'Unterarme am Boden', en: 'Forearms on ground' }, duration: 45, animationType: 'plank', primaryMuscles: ['abs'], secondaryMuscles: ['obliques', 'front-deltoids', 'lower-back'] },
          { id: 'cr-f-2', name: { de: 'Sit-ups', en: 'Sit-ups' }, detail: { de: 'Klassisch', en: 'Classic' }, duration: 45, animationType: 'situp', primaryMuscles: ['abs'], secondaryMuscles: ['obliques'] },
          { id: 'cr-f-3', name: { de: 'Leg Raises', en: 'Leg Raises' }, detail: { de: 'Beine gestreckt', en: 'Legs straight' }, duration: 40, animationType: 'dead-bug', primaryMuscles: ['abs'], secondaryMuscles: ['adductor', 'lower-back'] },
        ]},
        { id: 'cr-side', name: 'Seite', label: { de: 'Block B – Seite', en: 'Block B – Side' }, rounds: 3, restBetweenRounds: 45, restAfterSection: 75, exercises: [
          { id: 'cr-s-1', name: { de: 'Side Plank Links', en: 'Side Plank Left' }, detail: { de: 'Unterarm am Boden', en: 'Forearm on ground' }, duration: 40, animationType: 'side-plank', primaryMuscles: ['obliques'], secondaryMuscles: ['abs', 'front-deltoids', 'adductor'] },
          { id: 'cr-s-2', name: { de: 'Side Plank Rechts', en: 'Side Plank Right' }, detail: { de: 'Unterarm am Boden', en: 'Forearm on ground' }, duration: 40, animationType: 'side-plank', primaryMuscles: ['obliques'], secondaryMuscles: ['abs', 'front-deltoids', 'adductor'] },
          { id: 'cr-s-3', name: { de: 'Bicycle Crunches', en: 'Bicycle Crunches' }, detail: { de: 'Wechselseitig', en: 'Alternating' }, duration: 40, animationType: 'situp', primaryMuscles: ['obliques', 'abs'], secondaryMuscles: ['quadriceps'] },
        ]},
        { id: 'cr-dynamic', name: 'Dynamisch', label: { de: 'Block C – Dynamisch', en: 'Block C – Dynamic' }, rounds: 2, restBetweenRounds: 60, restAfterSection: 60, exercises: [
          { id: 'cr-d-1', name: { de: 'Dead Bug', en: 'Dead Bug' }, detail: { de: 'Arm & Bein wechselseitig', en: 'Arm & leg alternating' }, duration: 45, animationType: 'dead-bug', primaryMuscles: ['abs', 'lower-back'], secondaryMuscles: ['obliques'] },
          { id: 'cr-d-2', name: { de: 'Mountain Climbers', en: 'Mountain Climbers' }, detail: { de: 'Moderate Geschwindigkeit', en: 'Moderate speed' }, duration: 40, animationType: 'mountain-climber', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['quadriceps', 'obliques'] },
          { id: 'cr-d-3', name: { de: 'Bird Dog', en: 'Bird Dog' }, detail: { de: 'Vierfüßlerstand', en: 'Quadruped position' }, duration: 40, animationType: 'dead-bug', primaryMuscles: ['lower-back', 'abs'], secondaryMuscles: ['gluteal', 'front-deltoids'] },
        ]},
        { id: 'cr-burnout', name: 'Burnout', label: { de: 'Block D – Burnout', en: 'Block D – Burnout' }, rounds: 1, restBetweenRounds: 0, restAfterSection: 0, exercises: [
          { id: 'cr-bn-1', name: { de: 'Plank Up-Downs', en: 'Plank Up-Downs' }, detail: { de: 'Von Unterarm auf Hände', en: 'From forearms to hands' }, duration: 40, animationType: 'plank', primaryMuscles: ['abs', 'triceps'], secondaryMuscles: ['obliques', 'front-deltoids'] },
          { id: 'cr-bn-2', name: { de: 'High Knees', en: 'High Knees' }, detail: { de: 'Maximales Tempo', en: 'Maximum pace' }, duration: 35, animationType: 'high-knees', primaryMuscles: ['quadriceps', 'abs'], secondaryMuscles: ['calves', 'hamstring'] },
          { id: 'cr-bn-3', name: { de: 'Burpees', en: 'Burpees' }, detail: { de: 'Volle Ausführung', en: 'Full execution' }, duration: 30, animationType: 'burpee', primaryMuscles: ['chest', 'abs', 'quadriceps'], secondaryMuscles: ['triceps', 'gluteal'] },
        ]},
      ],
    },
    {
      planKey: 'quick', name: { de: 'Saturn', en: 'Saturn' }, subtitle: { de: '15-Minuten Ganzkörper-Circuit', en: '15-Minute Full-Body Circuit' },
      category: 'HIIT', duration: 15, icon: 'lightning', color: ['#facc15', '#ea580c'], sortOrder: 4,
      sections: [
        { id: 'qk-circuit', name: 'Circuit', label: { de: 'Ganzkörper Circuit', en: 'Full Body Circuit' }, rounds: 3, restBetweenRounds: 30, restAfterSection: 0, exercises: [
          { id: 'qk-1', name: { de: 'Jumping Jacks', en: 'Jumping Jacks' }, detail: { de: '30 Sekunden', en: '30 seconds' }, duration: 30, animationType: 'jumping-jacks', primaryMuscles: ['quadriceps', 'calves'], secondaryMuscles: ['front-deltoids', 'abs'] },
          { id: 'qk-2', name: { de: 'Kniebeugen', en: 'Squats' }, detail: { de: '30 Sekunden', en: '30 seconds' }, duration: 30, animationType: 'squat', primaryMuscles: ['quadriceps', 'gluteal'], secondaryMuscles: ['hamstring'] },
          { id: 'qk-3', name: { de: 'Liegestütze', en: 'Push-ups' }, detail: { de: '30 Sekunden', en: '30 seconds' }, duration: 30, animationType: 'pushup', primaryMuscles: ['chest', 'triceps'], secondaryMuscles: ['front-deltoids'] },
          { id: 'qk-4', name: { de: 'Mountain Climbers', en: 'Mountain Climbers' }, detail: { de: '30 Sekunden', en: '30 seconds' }, duration: 30, animationType: 'mountain-climber', primaryMuscles: ['abs', 'front-deltoids'], secondaryMuscles: ['quadriceps'] },
          { id: 'qk-5', name: { de: 'High Knees', en: 'High Knees' }, detail: { de: '30 Sekunden', en: '30 seconds' }, duration: 30, animationType: 'high-knees', primaryMuscles: ['quadriceps', 'abs'], secondaryMuscles: ['calves'] },
        ]},
      ],
    },
    {
      planKey: 'mobility', name: { de: 'Neptun', en: 'Neptune' }, subtitle: { de: 'Aufwärmen · Unterkörper · Oberkörper · Cool-down', en: 'Warm-up · Lower Body · Upper Body · Cool-down' },
      category: 'Mobilität', duration: 15, icon: 'flower', color: ['#f472b6', '#e11d48'], sortOrder: 5,
      sections: [
        { id: 'mb-warmup', name: 'Aufwärmen', label: { de: 'Warm-Up', en: 'Warm-Up' }, rounds: 1, restBetweenRounds: 0, restAfterSection: 30, exercises: [
          { id: 'mb-w-1', name: { de: 'Armkreisen', en: 'Arm Circles' }, detail: { de: 'Grosse Kreise, vorwärts & rückwärts', en: 'Large circles, forward & backward' }, duration: 45, animationType: 'arm-circle', primaryMuscles: ['front-deltoids', 'back-deltoids'], secondaryMuscles: ['trapezius'] },
          { id: 'mb-w-2', name: { de: 'Hüftkreisen', en: 'Hip Circles' }, detail: { de: 'Beide Richtungen', en: 'Both directions' }, duration: 45, animationType: 'arm-circle', primaryMuscles: ['lower-back', 'obliques'], secondaryMuscles: ['gluteal', 'adductor'] },
          { id: 'mb-w-3', name: { de: 'Inchworm', en: 'Inchworm' }, detail: { de: 'Vorwärts laufen', en: 'Walk forward' }, duration: 50, animationType: 'inchworm', primaryMuscles: ['hamstring', 'abs'], secondaryMuscles: ['front-deltoids', 'calves'] },
        ]},
        { id: 'mb-lower', name: 'Unterkörper', label: { de: 'Unterkörper Stretch', en: 'Lower Body Stretch' }, rounds: 1, restBetweenRounds: 30, restAfterSection: 30, exercises: [
          { id: 'mb-l-1', name: { de: 'Quad Stretch', en: 'Quad Stretch' }, detail: { de: 'Jede Seite 25 Sekunden', en: '25 sec each side' }, duration: 50, animationType: 'stretch-quad', primaryMuscles: ['quadriceps'], secondaryMuscles: [] },
          { id: 'mb-l-2', name: { de: 'Hamstring Stretch', en: 'Hamstring Stretch' }, detail: { de: 'Vorwärtsbeuge', en: 'Forward fold' }, duration: 50, animationType: 'stretch-hamstring', primaryMuscles: ['hamstring'], secondaryMuscles: ['calves', 'lower-back'] },
          { id: 'mb-l-3', name: { de: 'Hip Flexor Stretch', en: 'Hip Flexor Stretch' }, detail: { de: 'Ausfallschritt-Position', en: 'Lunge position' }, duration: 50, animationType: 'stretch-hip', primaryMuscles: ['adductor', 'quadriceps'], secondaryMuscles: ['gluteal'] },
        ]},
        { id: 'mb-upper', name: 'Oberkörper', label: { de: 'Oberkörper Stretch', en: 'Upper Body Stretch' }, rounds: 1, restBetweenRounds: 30, restAfterSection: 30, exercises: [
          { id: 'mb-u-1', name: { de: 'Shoulder Stretch', en: 'Shoulder Stretch' }, detail: { de: 'Arm über die Brust', en: 'Arm across chest' }, duration: 45, animationType: 'stretch-shoulder', primaryMuscles: ['back-deltoids'], secondaryMuscles: ['trapezius', 'upper-back'] },
          { id: 'mb-u-2', name: { de: "World's Greatest Stretch", en: "World's Greatest Stretch" }, detail: { de: 'Dynamisch', en: 'Dynamic' }, duration: 60, animationType: 'world-greatest-stretch', primaryMuscles: ['adductor', 'obliques', 'front-deltoids'], secondaryMuscles: ['hamstring', 'lower-back'] },
        ]},
        { id: 'mb-cooldown', name: 'Cool-down', label: { de: 'Cool-down', en: 'Cool-down' }, rounds: 1, restBetweenRounds: 0, restAfterSection: 0, exercises: [
          { id: 'mb-c-1', name: { de: "Child's Pose", en: "Child's Pose" }, detail: { de: 'Entspannt halten', en: 'Hold relaxed' }, duration: 60, animationType: 'plank', primaryMuscles: ['lower-back', 'upper-back'], secondaryMuscles: ['front-deltoids'] },
          { id: 'mb-c-2', name: { de: 'Pigeon Pose', en: 'Pigeon Pose' }, detail: { de: 'Jede Seite 30 Sekunden', en: '30 sec each side' }, duration: 60, animationType: 'stretch-hip', primaryMuscles: ['gluteal', 'adductor'], secondaryMuscles: ['lower-back'] },
        ]},
      ],
    },
  ] as const;

  for (let i = 0; i < plans.length; i++) {
    const p = plans[i];
    await prisma.systemPlan.upsert({
      where: { planKey: p.planKey },
      update: { name: p.name, subtitle: p.subtitle, category: p.category, duration: p.duration, icon: p.icon, color: [...p.color], sections: p.sections as any, sortOrder: i },
      create: { planKey: p.planKey, name: p.name, subtitle: p.subtitle, category: p.category, duration: p.duration, icon: p.icon, color: [...p.color], sections: p.sections as any, sortOrder: i },
    });
  }
  console.log(`[seed] ${plans.length} system plans seeded.`);
}
