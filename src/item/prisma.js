import prisma from '~/prisma';

export const getPurchaseableItem = async ({ id }) => {
  const item = await prisma.query.purchaseableItem({ where: { id } });

  return item;
};
