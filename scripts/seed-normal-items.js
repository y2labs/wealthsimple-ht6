const moment = require('moment');
const { random } = require('lodash');
const prisma = require('./prisma');
const normalItems = require('./normal-items');

async function seedNormalItems() {
  const users = await prisma.query.users({
    where: {
      NOT: [
        {
          id: null
        }
      ]
    }
  });

  const itemIds = await Promise.all(
    normalItems.map(async item => {
      const { id } = await prisma.mutation.createItem(
        {
          data: {
            name: item.name,
            description: item.description,
            singleUse: item.singleUse,
            image: {
              create: {
                uri: item.image
              }
            },
            effects: {
              create: item.effects
            }
          }
        },
        `{ id }`
      );

      return id;
    })
  );

  await Promise.all(
    users.map(async ({ id: userId }) => {
      await Promise.all(
        itemIds.map(async id => {
          await prisma.mutation.createPurchaseableItem({
            data: {
              expiresAt: moment().add(3, 'd'),
              price: random(100, 250),
              availableForUser: {
                connect: {
                  id: userId
                }
              },
              item: {
                connect: {
                  id
                }
              }
            }
          });
        })
      );
    })
  );
}

seedNormalItems()
  .then(() => {
    console.log('Seeded');

    process.exit(0);
  })
  .catch(err => {
    console.log(err);

    process.exit(1);
  });
