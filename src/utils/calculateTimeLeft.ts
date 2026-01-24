export const calculatorTimeLeft = (endDate: string) => {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const difference = end - now;

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};
