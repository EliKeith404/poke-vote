export default function getVoteCategory() {
  const category = localStorage.getItem('category');

  if (category) return category;

  let genCategory: string;

  const num = Math.floor(Math.random() * 5) + 1;

  switch (num) {
    case 1:
      genCategory = 'round';
      break;
    case 2:
      genCategory = 'sharp';
      break;
    case 3:
      genCategory = 'nice';
      break;
    case 4:
      genCategory = 'mean';
      break;
    case 5:
      genCategory = 'round';
      break;
  }
}
