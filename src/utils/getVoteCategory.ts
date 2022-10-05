export default function getVoteCategory() {
  const category = localStorage.getItem('category');

  if (category) return category;

  const num = Math.floor(Math.random() * 5) + 1;

  return num;
}
