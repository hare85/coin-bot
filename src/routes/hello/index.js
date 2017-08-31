import { Router } from 'express';
import wrap from 'express-wrap-async';

import logger from '../../utils/logger';

import hello from './hello';

const router = Router();

router.get('/', (req, res) => res.send('hello'));
router.get('/world', wrap(hello));

// error handling
router.use((err, req, res, next) => {
  logger.error('/hello -', err);
  res.status(500);
  res.json({
    Error: err.message,
  });
  next();
});
export default router;
