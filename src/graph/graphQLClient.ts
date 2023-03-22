import { GraphQLClient } from 'graphql-request';

import {
  GetSavedItemsDocument,
  GetSavedItemsQuery,
  GetSavedItemsQueryVariables,
  SaveArchiveDocument,
  SaveArchiveMutation,
  SaveFavoriteDocument,
  SaveFavoriteMutation,
  SaveFavoriteMutationVariables,
} from '../generated/graphql/types';
import { SaveArchiveMutationVariables } from '../generated/graphql/types';
import config from '../config';

/**
 * gives a graphQLClient for pocket-graph url
 *
 * This client initializes a `graphql-request` client
 * @param headers any headers received by proxy is just pass through to web graphQL proxy.
 * @param accessToken accessToken of the user
 * @param consumerKey consumerKey associated with the user
 */
export function getClient(
  accessToken: string,
  consumerKey: string,
  headers: any
) {
  return new GraphQLClient(
    `${config.graphQLProxy}?consumer_key=${consumerKey}&access_token=${accessToken}`,
    {
      //todo : investigate: ideally, we should pass any headers.
      //however this fails if we dont explicitly pass cookie header
      headers: {
        cookie: headers?.cookie,
      },
      //fetch implementation used by node version,
      //can give custom fetch package
      fetch,
    }
  );
}
/**
 * Calls saveArchive mutation
 *
 * @param accessToken accessToken of the user
 * @param consumerKey consumerKey associated with the user
 * @param variables variables required for the mutation
 * @param headers any headers received by proxy is just pass through to web graphQL proxy.
 */
export async function callSaveArchive(
  accessToken: string,
  consumerKey: string,
  headers: any,
  variables: SaveArchiveMutationVariables
): Promise<SaveArchiveMutation> {
  const client = getClient(accessToken, consumerKey, headers);
  return client.request<SaveArchiveMutation, SaveArchiveMutationVariables>(
    SaveArchiveDocument,
    variables
  );
}

/**
 * Calls saveFavorite mutation
 *
 * @param accessToken accessToken of the user
 * @param consumerKey consumerKey associated with the user
 * @param variables variables required for the mutation
 * @param headers any headers received by proxy is just pass through to web graphQL proxy.
 */
export async function callSaveFavorite(
  accessToken: string,
  consumerKey: string,
  headers: any,
  variables: SaveFavoriteMutationVariables
): Promise<SaveFavoriteMutation> {
  const client = getClient(accessToken, consumerKey, headers);
  return client.request<SaveFavoriteMutation, SaveFavoriteMutationVariables>(
    SaveFavoriteDocument,
    variables
  );
}

/**
 * function call to get saves
 *
 * @param accessToken accessToken of the user
 * @param consumerKey consumerKey associated with the user
 * @param headers any headers received by proxy is just pass through to web graphQL proxy.
 * @param variables input variables required for the query
 */
export async function callSavedItems(
  accessToken: string,
  consumerKey: string,
  headers: any,
  variables: GetSavedItemsQueryVariables
): Promise<GetSavedItemsQuery> {
  const client = getClient(accessToken, consumerKey, headers);
  return client.request<GetSavedItemsQuery, GetSavedItemsQueryVariables>(
    GetSavedItemsDocument,
    variables
  );
}
