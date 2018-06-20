import moment from 'moment';
import { get } from 'lodash';
import pRetry from 'p-retry';
import prisma from '~/prisma';
import { PERFORM_SYNC_INTERVAL } from '~/loop/constants';
import { issueFreeDollarsManaged } from '~/future/dollars-managed';
import { fromPriceToAmount } from '~/utils/converters';
import { batchUpdateEarnings } from '~/loop/batch-update-earnings';

const handler = async () => {
  console.log('Starting passive item sync');

  const itemsToSync = await prisma.query.passiveItemSyncs(
    {
      where: {
        nextSyncAt_lte: new Date()
      }
    },
    `
    {
      id
      interval
      item {
        id
      }
    }
  `
  );

  if (itemsToSync.length === 0) {
    console.log(`No passive items can be synced, skipping`);

    return;
  }

  console.log(`Preparing to sync ${itemsToSync.length} passive items`);

  await batchUpdateEarnings({
    itemsToSync
  });
};

export default {
  handler,
  interval: PERFORM_SYNC_INTERVAL
};
