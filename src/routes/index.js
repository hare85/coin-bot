import { Router } from 'express';
import Hello from './hello';

const router = Router();

router.use('/hello', Hello);

export default router;
