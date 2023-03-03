import { GetSavedItemsQuery } from '../generated/graphql/types';
import { convertSavedItemsToRestResponse } from './toRest';
import { RestResponse } from './types';
import {
  testV3GetResponse,
  testItemFragment,
  testSavedItemFragment,
} from './fixtures';

describe('convertSavedItemsToRestResponse', () => {
  it('should transform graphql response to rest response', () => {
    const graphResponse: GetSavedItemsQuery = {
      user: {
        savedItems: {
          edges: [
            {
              cursor: 'some-cursor',
              node: {
                __typename: 'SavedItem',
                ...testSavedItemFragment('id1'),
                item: {
                  __typename: 'Item',
                  ...testItemFragment(`id1`),
                },
              },
            },
            {
              cursor: 'some-cursor-2',
              node: {
                __typename: 'SavedItem',
                ...testSavedItemFragment('id2'),
                item: {
                  __typename: 'Item',
                  ...testItemFragment(`id2`),
                },
              },
            },
          ],
        },
      },
    };

    expect(convertSavedItemsToRestResponse(graphResponse)).toEqual(
      testV3GetResponse(['id1', 'id2'])
    );
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
                ...testSavedItemFragment(`id1`),
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
      list: {},
    };
    expect(convertSavedItemsToRestResponse(graphResponse)).toEqual(
      restResponse
    );
  });
});
