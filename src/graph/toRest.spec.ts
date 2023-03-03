import { GetSavedItemsQuery, Imageness, SavedItemStatus, Videoness } from '../generated/graphql/types';
import { convertSavedItemsToRestResponse } from './toRest';
import { RestResponse } from './types';

describe('convertSavedItemsToRestResponse',() => {
  const savedItemFragments = {
    id: 'id',
    status: SavedItemStatus.Unread,
    url: 'test.com',
    isFavorite: true,
    isArchived: true,
    _createdAt: 1677818995,
    _updatedAt: 1677818995,
    favoritedAt: 1677818995,
    archivedAt: 1677818995,
    tags : [{
      id: 'tag-id-1',
      name: 'tag-name-1'
    },
      {
        id: 'tag-id-2',
        name: 'tag-name-2'
      },
    ],
  };

  it('should transform graphql response to rest response', () => {
    const graphResponse : GetSavedItemsQuery= {
        user: {
          savedItems: {
            edges: [
              {
                cursor: 'some-cursor',
                node: {
                  __typename: 'SavedItem',
                  ...savedItemFragments,
                  item: {
                    __typename: 'Item',
                    itemId : 'item-id',
                    resolvedId: 'resolved-id',
                    wordCount: 100,
                    title : 'title',
                    timeToRead : 10,
                    resolvedUrl : 'https://test.com',
                    givenUrl : 'https://test.com',
                    excerpt : 'excerpt',
                    domain :  'test.com',
                    isArticle : true,
                    isIndex : true,
                    hasVideo : Videoness.HasVideos,
                    hasImage : Imageness.HasImages,
                    language : 'en',
                    ampUrl : 'https://test.com',
                    topImage : {
                      url : "https://test.com/image.jpg",
                    }
                  },
                },
              },
            ],
          },
        },
    };

    const restResponse : RestResponse = {
      cacheType: 'db',
      list: [
        {
          item_id: 'id',
          resolved_id: 'resolved-id',
          given_url: 'https://test.com',
          given_title: 'title',
          favorite: '1',
          status: '0',
          time_added: '1677818995',
          time_updated: '1677818995',
          time_read: '1677818995',
          time_favorited: '1677818995',
          resolved_title: 'title',
          resolved_url: 'https://test.com',
          title: 'title',
          excerpt: 'excerpt',
          is_article: '1',
          is_index: '1',
          has_video: '1',
          has_image: '1',
          word_count: '100',
          lang: 'en',
          time_to_read: 10,
          amp_url: 'https://test.com',
          top_image_url: 'https://test.com/image.jpg',
        }] }

    expect(convertSavedItemsToRestResponse(graphResponse)).toEqual(restResponse);
  });

  it('should not process pending items', () => {
    const graphResponse: GetSavedItemsQuery = {
      user: {
        savedItems: {
          edges: [
            {
              // all non-required fields null or undefined
              cursor: 'some-cursor',
              node: {
                __typename: 'SavedItem',
                ...savedItemFragments,
                item: {
                  __typename: 'PendingItem',
                },
              },
            },
          ],
        },
      },
    };
    const restResponse: RestResponse = {
      cacheType: 'db',
      list: [],
    }
    expect(convertSavedItemsToRestResponse(graphResponse)).toEqual(restResponse);

  });
});
