import { Category } from '@prisma/client';

export default function getVoteCategory() {
  const index = Math.floor(Math.random() * 5) + 1;

  const randCat = Object.values(Category)[index];

  return randCat;
}
