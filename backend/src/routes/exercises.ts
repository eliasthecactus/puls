import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/authenticate';
import { requireAdmin } from '../middleware/admin';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Same base directory that index.ts serves at /api/uploads. With UPLOADS_DIR set
// (as in docker-compose) files used to land outside the folder their URL points to.
const UPLOADS_DIR = path.join(process.env.UPLOADS_DIR || '/app/uploads', 'exercises');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// No SVG: it is served from the app's own origin and can carry scripts
const ALLOWED_IMAGES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const expected = ALLOWED_IMAGES[path.extname(file.originalname).toLowerCase()];
    cb(null, expected !== undefined && file.mimetype === expected);
  },
});

const exerciseSchema = z.object({
  nameDE: z.string().min(1),
  nameEN: z.string().min(1),
  detailDE: z.string().default(''),
  detailEN: z.string().default(''),
  formTipDE: z.string().optional(),
  formTipEN: z.string().optional(),
  imageUrl: z.string().optional(),
  primaryMuscles: z.array(z.string()).default([]),
  secondaryMuscles: z.array(z.string()).default([]),
});

// Public — list all exercises
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const exercises = await prisma.exercise.findMany({ orderBy: { nameEN: 'asc' } });
  res.json(exercises);
});

// Admin — create exercise
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = exerciseSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const exercise = await prisma.exercise.create({ data: parsed.data });
  res.status(201).json(exercise);
});

// Admin — update exercise
router.patch('/:id', authenticate, requireAdmin, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const parsed = exerciseSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }
  const exercise = await prisma.exercise.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(exercise);
});

// Admin — delete exercise
router.delete('/:id', authenticate, requireAdmin, async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  await prisma.exercise.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

// Admin — upload image
router.post('/:id/image', authenticate, requireAdmin, upload.single('image'), async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const imageUrl = `/api/uploads/exercises/${req.file.filename}`;
  const exercise = await prisma.exercise.update({ where: { id: req.params.id }, data: { imageUrl } });
  res.json(exercise);
});

export default router;
