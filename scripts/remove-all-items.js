const prisma = require('./prisma');

async function removeAllItems() {
  const passiveItemSync = await prisma.mutation.deleteManyPassiveItemSyncs({
    where: {
      NOT: [
        {
          id: null
        }
      ]
    }
  });

  const purchasedItems = await prisma.mutation.deleteManyPurchasedItems({
    where: {
      NOT: [
        {
          id: null
        }
      ]
    }
  });

  const purchaseableItems = await prisma.mutation.deleteManyPurchaseableItems({
    where: {
      NOT: [
        {
          id: null
        }
      ]
    }
  });
}

removeAllItems()
  .then(() => {
    console.log('Removed all items');

    process.exit(0);
  })
  .catch(err => {
    console.log(err);

    process.exit(1);
  });
