export const switchTurn = (fenString: string) => {
  const splitString = fenString.split(' ');
  splitString[1] = splitString[1] !== 'w' ? 'w' : 'b';

  // Clear the en passant square
  splitString[3] = '-';

  return splitString.join(' ');
};
