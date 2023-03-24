import { Request, Response, Router } from 'express';
import { setSaveInputsFromGetCall } from '../graph/toGraphQL';
import { callSavedItems } from '../graph/graphQLClient';
import { convertSavedItemsToRestResponse } from '../graph/toRest';
import { UserSavedItemsArgs } from '../generated/graphql/types';
import * as Sentry from '@sentry/node';

const router: Router = Router();
//v3 in web repo can support both POST and GET request.
//proxy need to be backward compatible with both of them

router.get('/', async (req: Request, res: Response) => {
  try {
    const variables = setSaveInputsFromGetCall(req.params);
    const headers = req.headers;
    const accessToken = req.params.access_token as string;
    const consumerKey = req.params.consumer_key as string;
    return res.json(
      await processV3call(accessToken, consumerKey, headers, variables)
    );
  } catch (err) {
    const errMessage = `v3/get: ${err}`;
    console.log(errMessage);
    Sentry.addBreadcrumb({ message: errMessage });
    Sentry.captureException(err);
    //todo: set error code and error message in header
    return res.status(500).send({ error: errMessage });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const variables = setSaveInputsFromGetCall(req.body);
    const headers = req.headers;
    const accessToken = req.body.access_token as string;
    const consumerKey = req.body.consumer_key as string;

    return res.json(
      await processV3call(accessToken, consumerKey, headers, variables)
    );
  } catch (err) {
    const errMessage = `v3/get: ${err}`;
    console.log(errMessage);
    Sentry.addBreadcrumb({ message: errMessage });
    Sentry.captureException(err);
    //todo: set error code and error message in header
    return res.status(500).send({ error: errMessage });
  }
});

/**
 * function call to get saves from graphQL and convert it to v3 Get response
 * @param accessToken user access token
 * @param consumerKey user consumer key
 * @param variables input variables required for the graphql query
 * @param headers request headers. treated as blackbox pass through for proxy
 */
export async function processV3call(
  accessToken: string,
  consumerKey: string,
  headers: any,
  variables: UserSavedItemsArgs
) {
  const response = await callSavedItems(
    accessToken,
    consumerKey,
    headers,
    variables
  );
  return convertSavedItemsToRestResponse(response);
}

export default router;
