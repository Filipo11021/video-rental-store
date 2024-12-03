const RENTAL_PRICES = {
  PREMIUM: 40,
  BASIC: 30,
} as const;

const RENTAL_PERIODS = {
  REGULAR: 3,
  OLD: 5,
} as const;

export function calculateNewReleasePrice(durationInDays: number): number {
  return RENTAL_PRICES.PREMIUM * durationInDays;
}

export function calculateRegularPrice(durationInDays: number): number {
  if (durationInDays <= RENTAL_PERIODS.REGULAR) {
    return RENTAL_PRICES.BASIC;
  }
  return (
    RENTAL_PRICES.BASIC +
    (durationInDays - RENTAL_PERIODS.REGULAR) * RENTAL_PRICES.BASIC
  );
}

export function calculateOldFilmPrice(durationInDays: number): number {
  if (durationInDays <= RENTAL_PERIODS.OLD) {
    return RENTAL_PRICES.BASIC;
  }
  return (
    RENTAL_PRICES.BASIC +
    (durationInDays - RENTAL_PERIODS.OLD) * RENTAL_PRICES.BASIC
  );
}
