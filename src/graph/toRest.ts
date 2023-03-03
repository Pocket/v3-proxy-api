/**
 * method to convert graph responses to REST responses
 */
import { callSavedItems } from './graphQLClient';
import { GetSavedItemsQuery, Imageness, Videoness } from '../generated/graphql/types';
import {
  GraphItem,
  GraphSavedItem,
  GraphSavedItemEdge,
  ItemListObject,
  RestResponse,
} from './types';

/**
 * process if the item fields are populated. if its pendingItem, we just return null
 * @param savedItem
 */

function convertHasImage(imageStatus: Imageness) {
  switch (imageStatus) {
    case Imageness.IsImage:
    case Imageness.HasImages:
      return '1';
    case Imageness.NoImages:
      return '0';
    default:
      return '0';
  }
}

function convertHasVideo(videoStatus: Videoness) {
  switch (videoStatus) {
    case Videoness.HasVideos:
    case Videoness.IsVideo:
      return '1';
    case Videoness.NoVideos:
      return '0';
    default:
      return '0';
  }
}
const reduceItem = (savedItem: GraphSavedItemEdge): ItemListObject => {
  switch (savedItem.node.item.__typename) {
    case 'Item':
      return convertGraphSavedItemToListObject(savedItem.node);
    case 'PendingItem':
      return null;
  }
};
export function convertGraphSavedItemToListObject(
  savedItem: GraphSavedItem
): ItemListObject {
  const nestedItem: GraphItem = savedItem.item as GraphItem;
  return {
    item_id: savedItem.id,
    resolved_id: nestedItem.resolvedId,
    given_url: nestedItem.givenUrl,
    given_title: nestedItem.title,
    favorite: savedItem.isFavorite ? '1' : '0',
    status: savedItem.isArchived ? '0' : '1',
    time_added: savedItem._createdAt.toString(), //timestamp as string
    time_updated: savedItem._updatedAt.toString(), //timestamp as string
    time_read: savedItem.archivedAt.toString(), //timestamp as string
    time_favorited: savedItem.favoritedAt.toString(), //timestamp as string
    resolved_title: nestedItem.title,
    resolved_url: nestedItem.resolvedUrl,
    title: nestedItem.title,
    excerpt: nestedItem.excerpt,
    is_article: nestedItem.isArticle ? '1' : '0',
    is_index: nestedItem.isIndex ? '1' : '0',
    has_video: convertHasVideo(nestedItem.hasVideo),
    has_image: convertHasImage(nestedItem.hasImage),
    word_count: nestedItem.wordCount.toString(),
    lang: nestedItem.language,
    time_to_read: nestedItem.timeToRead,
    amp_url: nestedItem.ampUrl,
    top_image_url: nestedItem.topImage.url,
  };
}
export function convertSavedItemsToRestResponse(
  response: GetSavedItemsQuery
): RestResponse {
  return {
    // todo: map top level fields
    cacheType: 'db',
    list: response.user.savedItems.edges
      .map(reduceItem)
      .filter((s) => s !== null),
  };
}
