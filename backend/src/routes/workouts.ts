import { Router, Request, Response } from 'express';

const router = Router();

// Workout data is served from the API so the frontend stays thin
// and a future mobile app can consume the same endpoint.
const workoutPlans = [
  {
    id: 'full-body',
    name: 'Ganzkörper',
    subtitle: 'Push · Beine · Core · Burnout',
    category: 'Kraft',
    duration: 40,
    icon: 'dumbbell',
    color: ['#7c3aed', '#5b21b6'],
    sections: [
      {
        id: 'fb-push',
        name: 'Push',
        label: 'Block A – Push',
        rounds: 3,
        restBetweenRounds: 60,
        exercises: [
          { id: 'fb-push-1', name: 'Liegestütze', detail: 'Schulterbreiter Griff', duration: 45, formTip: 'Ellbogen 45° zum Körper', animationType: 'pushup' },
          { id: 'fb-push-2', name: 'Schulterdrücken', detail: 'Pike Position', duration: 40, formTip: 'Hüfte hoch, Kopf zwischen den Armen', animationType: 'pike-pushup' },
          { id: 'fb-push-3', name: 'Trizeps-Dips', detail: 'An der Stuhlkante', duration: 40, formTip: 'Hüfte nahe an der Kante', animationType: 'dips' },
        ],
      },
      {
        id: 'fb-legs',
        name: 'Legs',
        label: 'Block B – Beine',
        rounds: 3,
        restBetweenRounds: 60,
        exercises: [
          { id: 'fb-legs-1', name: 'Kniebeugen', detail: 'Körpergewicht', duration: 45, formTip: 'Knie über Zehen, Rücken gerade', animationType: 'squat' },
          { id: 'fb-legs-2', name: 'Ausfallschritte', detail: 'Wechselseitig', duration: 45, formTip: '90° Kniewinkel, Knie nicht über Zehen', animationType: 'lunge' },
          { id: 'fb-legs-3', name: 'Glute Bridge', detail: 'Beidbeinig', duration: 40, formTip: 'Hüfte vollständig strecken', animationType: 'glute-bridge' },
        ],
      },
      {
        id: 'fb-core',
        name: 'Core',
        label: 'Block C – Core',
        rounds: 2,
        restBetweenRounds: 45,
        exercises: [
          { id: 'fb-core-1', name: 'Plank', detail: 'Unterarme am Boden', duration: 45, formTip: 'Becken neutral, nicht durchhängen', animationType: 'plank' },
          { id: 'fb-core-2', name: 'Dead Bug', detail: 'Arm & Bein wechselseitig', duration: 40, formTip: 'Lendenwirbel am Boden halten', animationType: 'dead-bug' },
          { id: 'fb-core-3', name: 'Sit-ups', detail: 'Hände hinter Kopf', duration: 40, reps: 15, formTip: 'Nacken nicht ziehen', animationType: 'situp' },
        ],
      },
      {
        id: 'fb-burnout',
        name: 'Burnout',
        label: 'Block D – Burnout',
        rounds: 1,
        restBetweenRounds: 0,
        exercises: [
          { id: 'fb-burn-1', name: 'Jumping Jacks', detail: 'Vollständig', duration: 45, formTip: 'Arme über Kopf zusammenführen', animationType: 'jumping-jacks' },
          { id: 'fb-burn-2', name: 'High Knees', detail: 'Schnell', duration: 40, formTip: 'Knie auf Hüfthöhe', animationType: 'high-knees' },
          { id: 'fb-burn-3', name: 'Burpees', detail: 'Volles Tempo', duration: 30, formTip: 'Volle Hüftstreckung beim Sprung', animationType: 'burpee' },
        ],
      },
    ],
  },
  {
    id: 'upper-body',
    name: 'Oberkörper',
    subtitle: 'Brust · Schultern · Rücken · Burnout',
    category: 'Kraft',
    duration: 35,
    icon: 'barbell',
    color: ['#3b82f6', '#0e7490'],
    sections: [
      {
        id: 'ub-chest',
        name: 'Brust',
        label: 'Block A – Brust',
        rounds: 3,
        restBetweenRounds: 60,
        exercises: [
          { id: 'ub-ch-1', name: 'Weite Liegestütze', detail: 'Breiter als schulterbreit', duration: 50, formTip: 'Brust zur Erde, volle Streckung', animationType: 'pushup' },
          { id: 'ub-ch-2', name: 'Enge Liegestütze', detail: 'Hände unter Schultern', duration: 40, formTip: 'Ellbogen am Körper entlangführen', animationType: 'pushup' },
          { id: 'ub-ch-3', name: 'Pseudo Planche', detail: 'Finger nach hinten', duration: 35, formTip: 'Schultern über den Händen', animationType: 'plank' },
        ],
      },
      {
        id: 'ub-shoulders',
        name: 'Schultern',
        label: 'Block B – Schultern',
        rounds: 3,
        restBetweenRounds: 60,
        exercises: [
          { id: 'ub-sh-1', name: 'Armkreisen', detail: 'Vorwärts & rückwärts', duration: 40, formTip: 'Große Kreise, Arme gestreckt', animationType: 'arm-circle' },
          { id: 'ub-sh-2', name: 'Pike Liegestütze', detail: 'Hüfte hoch', duration: 45, formTip: 'Kopf zwischen den Armen', animationType: 'pike-pushup' },
          { id: 'ub-sh-3', name: 'Seitheben', detail: 'Langsam & kontrolliert', duration: 35, formTip: 'Daumen leicht nach unten', animationType: 'arm-circle' },
        ],
      },
      {
        id: 'ub-back',
        name: 'Rücken',
        label: 'Block C – Rücken',
        rounds: 2,
        restBetweenRounds: 60,
        exercises: [
          { id: 'ub-bk-1', name: 'Superman', detail: 'Bauchlage', duration: 40, formTip: 'Schulterblätter zusammenführen', animationType: 'hip-hinge' },
          { id: 'ub-bk-2', name: 'Rückwärts-Armheben', detail: 'T-Position', duration: 40, formTip: 'Daumen nach oben zeigen', animationType: 'hip-hinge' },
        ],
      },
      {
        id: 'ub-burnout',
        name: 'Burnout',
        label: 'Block D – Burnout',
        rounds: 1,
        restBetweenRounds: 0,
        exercises: [
          { id: 'ub-bn-1', name: 'Mountain Climbers', detail: 'Maximales Tempo', duration: 45, formTip: 'Hüfte stabil halten', animationType: 'mountain-climber' },
          { id: 'ub-bn-2', name: 'Burpees', detail: 'Volle Streckung', duration: 30, formTip: 'Arme über Kopf beim Sprung', animationType: 'burpee' },
        ],
      },
    ],
  },
  {
    id: 'legs',
    name: 'Beine',
    subtitle: 'Quads · Hamstrings · Explosiv · Burnout',
    category: 'Kraft',
    duration: 35,
    icon: 'legs',
    color: ['#f97316', '#b91c1c'],
    sections: [
      {
        id: 'lg-quads',
        name: 'Quads',
        label: 'Block A – Quads',
        rounds: 3,
        restBetweenRounds: 60,
        exercises: [
          { id: 'lg-q-1', name: 'Kniebeugen', detail: 'Tiefe Ausführung', duration: 50, formTip: 'Oberschenkel parallel zum Boden', animationType: 'squat' },
          { id: 'lg-q-2', name: 'Pulse Squats', detail: 'Halb unten bleiben', duration: 40, formTip: 'Kleiner Bewegungsradius, konstante Spannung', animationType: 'squat' },
          { id: 'lg-q-3', name: 'Sprungkniebeugen', detail: 'Explosiv', duration: 30, formTip: 'Sanfte Landung auf den Fußballen', animationType: 'squat' },
        ],
      },
      {
        id: 'lg-hamstrings',
        name: 'Hamstrings',
        label: 'Block B – Hamstrings',
        rounds: 3,
        restBetweenRounds: 60,
        exercises: [
          { id: 'lg-h-1', name: 'Romanian Deadlift', detail: 'Einbeinig oder beidbeinig', duration: 45, formTip: 'Rücken gerade, Hüfte zurück', animationType: 'hip-hinge' },
          { id: 'lg-h-2', name: 'Glute Bridge', detail: 'Beidbeinig', duration: 45, formTip: 'Gesäß vollständig anspannen', animationType: 'glute-bridge' },
          { id: 'lg-h-3', name: 'Single-Leg Bridge', detail: 'Wechselseitig', duration: 35, formTip: 'Becken level halten', animationType: 'glute-bridge' },
        ],
      },
      {
        id: 'lg-explosive',
        name: 'Explosiv',
        label: 'Block C – Explosiv',
        rounds: 2,
        restBetweenRounds: 75,
        exercises: [
          { id: 'lg-e-1', name: 'Jump Lunges', detail: 'Wechselseitig', duration: 35, formTip: 'Weiche Landung, Knie stabil', animationType: 'lunge' },
          { id: 'lg-e-2', name: 'Box Jumps', detail: 'Auf Stuhl oder Stufe', duration: 30, formTip: 'Beide Füße gleichzeitig abdrücken', animationType: 'jumping-jacks' },
          { id: 'lg-e-3', name: 'Lateral Jumps', detail: 'Seitliche Sprünge', duration: 35, formTip: 'Auf einem Bein landen', animationType: 'jumping-jacks' },
        ],
      },
      {
        id: 'lg-burnout',
        name: 'Burnout',
        label: 'Block D – Burnout',
        rounds: 1,
        restBetweenRounds: 0,
        exercises: [
          { id: 'lg-bn-1', name: 'Ausfallschritte', detail: 'Wechselseitig', duration: 45, reps: 20, animationType: 'lunge' },
          { id: 'lg-bn-2', name: 'Calf Raises', detail: 'Langsam & kontrolliert', duration: 40, reps: 25, formTip: 'Volle Streckung oben', animationType: 'calf-raise' },
          { id: 'lg-bn-3', name: 'Wall Sit', detail: 'Statisch halten', duration: 45, formTip: 'Oberschenkel parallel zum Boden', animationType: 'squat' },
        ],
      },
    ],
  },
  {
    id: 'core',
    name: 'Core & Rumpf',
    subtitle: 'Vorderseite · Seite · Dynamisch · Burnout',
    category: 'Core',
    duration: 30,
    icon: 'core',
    color: ['#10b981', '#0f766e'],
    sections: [
      {
        id: 'cr-front',
        name: 'Vorderseite',
        label: 'Block A – Vorderseite',
        rounds: 3,
        restBetweenRounds: 45,
        exercises: [
          { id: 'cr-f-1', name: 'Plank', detail: 'Unterarme am Boden', duration: 45, formTip: 'Becken neutral, nicht durchhängen lassen', animationType: 'plank' },
          { id: 'cr-f-2', name: 'Sit-ups', detail: 'Klassisch', duration: 45, reps: 15, formTip: 'Nacken nicht mit Händen ziehen', animationType: 'situp' },
          { id: 'cr-f-3', name: 'Leg Raises', detail: 'Beine gestreckt', duration: 40, reps: 12, formTip: 'Lendenwirbel am Boden halten', animationType: 'dead-bug' },
        ],
      },
      {
        id: 'cr-side',
        name: 'Seite',
        label: 'Block B – Seite',
        rounds: 3,
        restBetweenRounds: 45,
        exercises: [
          { id: 'cr-s-1', name: 'Side Plank Links', detail: 'Unterarm am Boden', duration: 40, formTip: 'Hüfte oben halten, Körper gerade', animationType: 'side-plank' },
          { id: 'cr-s-2', name: 'Side Plank Rechts', detail: 'Unterarm am Boden', duration: 40, formTip: 'Hüfte oben halten, Körper gerade', animationType: 'side-plank' },
          { id: 'cr-s-3', name: 'Bicycle Crunches', detail: 'Wechselseitig', duration: 40, reps: 20, formTip: 'Ellbogen zum gegenüberliegenden Knie', animationType: 'situp' },
        ],
      },
      {
        id: 'cr-dynamic',
        name: 'Dynamisch',
        label: 'Block C – Dynamisch',
        rounds: 2,
        restBetweenRounds: 60,
        exercises: [
          { id: 'cr-d-1', name: 'Dead Bug', detail: 'Arm & Bein wechselseitig', duration: 45, formTip: 'Lenden niemals vom Boden heben', animationType: 'dead-bug' },
          { id: 'cr-d-2', name: 'Mountain Climbers', detail: 'Moderate Geschwindigkeit', duration: 40, formTip: 'Hüfte auf Schulterhöhe halten', animationType: 'mountain-climber' },
          { id: 'cr-d-3', name: 'Bird Dog', detail: 'Vierfüßlerstand', duration: 40, formTip: 'Rücken gerade, Bewegung aus der Hüfte', animationType: 'dead-bug' },
        ],
      },
      {
        id: 'cr-burnout',
        name: 'Burnout',
        label: 'Block D – Burnout',
        rounds: 1,
        restBetweenRounds: 0,
        exercises: [
          { id: 'cr-bn-1', name: 'Plank Up-Downs', detail: 'Von Unterarm auf Hände', duration: 40, formTip: 'Hüfte stabil, nicht rotieren', animationType: 'plank' },
          { id: 'cr-bn-2', name: 'High Knees', detail: 'Maximales Tempo', duration: 35, formTip: 'Knie auf Hüfthöhe', animationType: 'high-knees' },
          { id: 'cr-bn-3', name: 'Burpees', detail: 'Volle Ausführung', duration: 30, formTip: 'Volle Hüftstreckung beim Sprung', animationType: 'burpee' },
        ],
      },
    ],
  },
  {
    id: 'quick',
    name: 'Schnell & Knackig',
    subtitle: '15-Minuten Ganzkörper-Circuit',
    category: 'HIIT',
    duration: 15,
    icon: 'lightning',
    color: ['#facc15', '#ea580c'],
    sections: [
      {
        id: 'qk-circuit',
        name: 'Circuit',
        label: 'Ganzkörper Circuit',
        rounds: 3,
        restBetweenRounds: 30,
        exercises: [
          { id: 'qk-1', name: 'Jumping Jacks', detail: '30 Sekunden', duration: 30, formTip: 'Volle Arm- und Beinbewegung', animationType: 'jumping-jacks' },
          { id: 'qk-2', name: 'Kniebeugen', detail: '30 Sekunden', duration: 30, formTip: 'Tief genug – Oberschenkel parallel', animationType: 'squat' },
          { id: 'qk-3', name: 'Liegestütze', detail: '30 Sekunden', duration: 30, formTip: 'Brust zum Boden', animationType: 'pushup' },
          { id: 'qk-4', name: 'Mountain Climbers', detail: '30 Sekunden', duration: 30, formTip: 'Hüfte stabil', animationType: 'mountain-climber' },
          { id: 'qk-5', name: 'High Knees', detail: '30 Sekunden', duration: 30, formTip: 'Knie auf Hüfthöhe', animationType: 'high-knees' },
        ],
      },
    ],
  },
  {
    id: 'mobility',
    name: 'Mobility & Stretching',
    subtitle: 'Aufwärmen · Unterkörper · Oberkörper · Cool-down',
    category: 'Mobilität',
    duration: 15,
    icon: 'flower',
    color: ['#f472b6', '#e11d48'],
    sections: [
      {
        id: 'mb-warmup',
        name: 'Aufwärmen',
        label: 'Warm-Up',
        rounds: 1,
        restBetweenRounds: 0,
        exercises: [
          { id: 'mb-w-1', name: 'Armkreisen', detail: 'Grosse Kreise, vorwärts & rückwärts', duration: 45, formTip: 'Schultern locker, voller Bewegungsradius', animationType: 'arm-circle' },
          { id: 'mb-w-2', name: 'Hüftkreisen', detail: 'Beide Richtungen', duration: 45, formTip: 'Knie leicht gebeugt', animationType: 'arm-circle' },
          { id: 'mb-w-3', name: 'Inchworm', detail: 'Vorwärts laufen', duration: 50, formTip: 'Hände nahe an die Füße, Beine gestreckt', animationType: 'inchworm' },
        ],
      },
      {
        id: 'mb-lower',
        name: 'Unterkörper',
        label: 'Unterkörper Stretch',
        rounds: 1,
        restBetweenRounds: 30,
        exercises: [
          { id: 'mb-l-1', name: 'Quad Stretch', detail: 'Jede Seite 25 Sekunden', duration: 50, formTip: 'Knie zusammen halten, aufrecht stehen', animationType: 'stretch-quad' },
          { id: 'mb-l-2', name: 'Hamstring Stretch', detail: 'Vorwärtsbeuge', duration: 50, formTip: 'Knie leicht gebeugt, Rücken gerade', animationType: 'stretch-hamstring' },
          { id: 'mb-l-3', name: 'Hip Flexor Stretch', detail: 'Ausfallschritt-Position', duration: 50, formTip: 'Hüfte nach vorne drücken', animationType: 'stretch-hip' },
        ],
      },
      {
        id: 'mb-upper',
        name: 'Oberkörper',
        label: 'Oberkörper Stretch',
        rounds: 1,
        restBetweenRounds: 30,
        exercises: [
          { id: 'mb-u-1', name: 'Shoulder Stretch', detail: 'Arm über die Brust', duration: 45, formTip: 'Schulter runter, nicht hochziehen', animationType: 'stretch-shoulder' },
          { id: 'mb-u-2', name: "World's Greatest Stretch", detail: 'Dynamisch', duration: 60, formTip: 'Hüfte öffnen, Rotation aus der Wirbelsäule', animationType: 'world-greatest-stretch' },
        ],
      },
      {
        id: 'mb-cooldown',
        name: 'Cool-down',
        label: 'Cool-down',
        rounds: 1,
        restBetweenRounds: 0,
        exercises: [
          { id: 'mb-c-1', name: "Child's Pose", detail: 'Entspannt halten', duration: 60, formTip: 'Arme weit nach vorne, Stirn am Boden', animationType: 'plank' },
          { id: 'mb-c-2', name: 'Pigeon Pose', detail: 'Jede Seite 30 Sekunden', duration: 60, formTip: 'Vorderes Schienbein parallel zur Matte', animationType: 'stretch-hip' },
        ],
      },
    ],
  },
];

router.get('/', (_req: Request, res: Response): void => {
  res.json(workoutPlans);
});

router.get('/:id', (req: Request, res: Response): void => {
  const plan = workoutPlans.find((p) => p.id === req.params.id);
  if (!plan) {
    res.status(404).json({ error: 'Workout not found' });
    return;
  }
  res.json(plan);
});

export default router;
