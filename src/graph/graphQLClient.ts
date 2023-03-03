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
 * @param access_token accessToken of the user
 * @param consumer_key consumerKey assocuated with the user
 */
export function getClient(accessToken: string, consumerKey: string) {
  return new GraphQLClient(
    `${config.graphQLProxy}?consumer_key=${consumerKey}&access_token=${accessToken}`,
    {
      //fetch implementation used by node version,
      //can give custom fetch package
      fetch,
    }
  );
}
/**
 * Calls saveArchive mutation
 *
 * @param auth auth headers from the web repo
 * @param variables variables required for the mutation
 */
export async function callSaveArchive(
  auth: any,
  accessToken: string,
  consumerKey: string,
  variables: SaveArchiveMutationVariables
): Promise<SaveArchiveMutation> {
  const client = getClient(accessToken, consumerKey);
  return client.request<SaveArchiveMutation, SaveArchiveMutationVariables>(
    SaveArchiveDocument,
    variables
  );
}

/**
 * Calls saveFavorite mutation
 *
 * @param auth auth headers from the web repo
 * @param variables variables required for the mutation
 */
export async function callSaveFavorite(
  accessToken: string,
  consumerKey: string,
  variables: SaveFavoriteMutationVariables
): Promise<SaveFavoriteMutation> {
  const client = getClient(accessToken, consumerKey);
  return client.request<SaveFavoriteMutation, SaveFavoriteMutationVariables>(
    SaveFavoriteDocument,
    variables
  );
}

/**
 * function call to get saves
 * @param auth
 * @param document
 * @param variables
 */
export async function callSavedItems(
  accessToken: string,
  consumerKey: string,
  variables: GetSavedItemsQueryVariables
): Promise<GetSavedItemsQuery> {
  const client = getClient(accessToken, consumerKey);
  return client.request<GetSavedItemsQuery, GetSavedItemsQueryVariables>(
    GetSavedItemsDocument,
    variables
  );
}
