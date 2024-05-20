export const truncate = (text, num) => {
  if (text?.length > num) {
    return text.slice(0, num) + "...";
  }
  return text;
};
export const truncateReverse = (text, num) => {
  if (text?.length > num) {
    return text.slice(text?.length - num, text?.length);
  }
  return text;
};
