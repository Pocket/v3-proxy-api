/**
 * methods that converts REST inputs/query params to graphQL inputs
 */
import {
  SavedItemsSortBy,
  SavedItemsSortOrder,
  SavedItemStatusFilter,
  UserSavedItemsArgs,
} from '../generated/graphql/types';

export function setSaveInputsFromGetCall(getParams: any): UserSavedItemsArgs {
  //todo: map rest to graphql saveById inputs
  return {
    pagination: {
      first: 10,
    },
    sort: {
      sortBy: SavedItemsSortBy.UpdatedAt,
      sortOrder: SavedItemsSortOrder.Asc,
    },
    filter: {
      status: SavedItemStatusFilter.Unread,
    },
  };
}
