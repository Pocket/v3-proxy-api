import { Router } from 'express';
import { Request, Response } from 'express';
import { setSaveInputsFromGetCall } from './transform';
import { callSavedItems } from '../graph/graphQLClient';

const router: Router = Router();
// v3/get is a POST request
router.post('/', (req: Request, res: Response) => {
  const variables  = setSaveInputsFromGetCall(req.params);
  return callSavedItems(req.headers, variables);
  //transformation back to REST and return
});

export default router;
