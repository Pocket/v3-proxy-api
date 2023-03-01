/**
 * this file has logic to transform the data from REST to GraphQL
 */

import {
  SavedItemsSortBy,
  SavedItemsSortOrder,
  SavedItemStatusFilter,
  UserSavedItemsArgs
} from '../generated/graphql/types';

/**
 * transform v3/get input methods to graphQL saveById inputs
 * @param queryparams
 */
export function setSaveInputsFromGetCall (getParams: any) : UserSavedItemsArgs {
  //todo: map rest to graphql saveById inputs
  return {
    pagination: {
      first:10,
    },
    sort: {
      sortBy: SavedItemsSortBy.UpdatedAt,
      sortOrder: SavedItemsSortOrder.Asc,
    },
    filter: {
      status: SavedItemStatusFilter.Unread
    }
  }
}
