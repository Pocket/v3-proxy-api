import { Router } from 'express';
import { Request, Response } from 'express';

const router: Router = Router();
// v3/get is a POST request
router.post('/', (req: Request, res: Response) => {
  res.status(200).send('Ok!');
});

export default router;
