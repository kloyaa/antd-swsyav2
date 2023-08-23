export const capitalizeName = (name: string): string => {
  const words: string[] = name.split(' ');

  const capitalizedWords: string[] = words.map((word) => {
    if (word.length > 0) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }
    return '';
  });

  return capitalizedWords.join(' ');
};
