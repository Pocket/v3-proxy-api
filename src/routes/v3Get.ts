import { Request, Response, Router } from 'express';
import { setSaveInputsFromGetCall } from '../graph/toGraphQL';
import { callSavedItems } from '../graph/graphQLClient';
import { convertSavedItemsToRestResponse } from '../graph/toRest';
import { UserSavedItemsArgs } from '../generated/graphql/types';
import * as Sentry from '@sentry/node';
import { ErrorCodes, getErrorHeaders } from './errorMapper';

const router: Router = Router();
// v3/get is a POST request
/**
 * function to process v3/get call
 * Note: for now, we are fetching access_token and consumer_key from headers
 * todo: we might have to cover all forms of auth once before we
 * redirect request directly from dotcom gateway
 */

router.post('/', async (req: Request, res: Response) => {
  try {
    const variables = setSaveInputsFromGetCall(req.params);
    const headers = req.headers;
    const accessToken = req.body.access_token as string;
    const consumerKey = req.body.consumer_key as string;

    if(!accessToken) {
      return res.status(401).header(getErrorHeaders(ErrorCodes.INVALID_ACCESS_TOKEN)).send({})
    }

    if (!consumerKey) {
      return res.status(400).header(getErrorHeaders(ErrorCodes.INVALID_CONSUMER_KEY)).send({})
    }

    return await processV3call(accessToken, consumerKey, headers, variables);
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
