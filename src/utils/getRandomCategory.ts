import { Category } from '@prisma/client';

function getRandomCategory() {
  const categoryValues = Object.keys(Category);
  const randomIndex = Math.floor(Math.random() * categoryValues.length);

  const randomizedCategory = categoryValues[
    randomIndex
  ] as keyof typeof Category;

  return randomizedCategory;
}

export default getRandomCategory;
