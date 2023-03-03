import { Router } from 'express';
import { Request, Response } from 'express';
import { setSaveInputsFromGetCall } from '../graph/toGraphQL';
import { callSavedItems } from '../graph/graphQLClient';
import { convertSavedItemsToRestResponse } from '../graph/toRest';
import { UserSavedItemsArgs } from '../generated/graphql/types';

const router: Router = Router();
// v3/get is a POST request
router.post('/',  (req: Request, res: Response) => {
  const variables = setSaveInputsFromGetCall(req.params);
  const accessToken = req.headers.access_token as string;
  const consumerKey = req.headers.consumer_key as string;
  return res.json(processV3call(accessToken,consumerKey,variables));
  //todo: error handling in try/catch - log sentry
});

export async function processV3call( accessToken: string, consumerKey: string, variables: UserSavedItemsArgs ,) {
  const response = await callSavedItems(accessToken,consumerKey, variables);
  return convertSavedItemsToRestResponse(response);
}

export default router;
