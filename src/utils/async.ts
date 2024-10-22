export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDefaultBanner() {
  return 'https://w.ladicdn.com/5dc3a14853beb7418826ae66/onmart-3-20241018164455-nblnu.png';
}