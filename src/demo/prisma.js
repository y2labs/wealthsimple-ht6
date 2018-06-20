import prisma from '~/prisma';

export const getUserItemsToSync = async ({ userId }) => {
  const itemsToSync = await prisma.query.passiveItemSyncs(
    {
      where: {
        item: {
          owner: {
            id: userId
          }
        }
      }
    },
    `
    {
      id
      interval
      item {
        id
      }    
    }`
  );

  return itemsToSync;
};
