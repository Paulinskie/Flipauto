export function calculatePrice({ model, price, mileage, year }) {
  let base = 8000;

  if (model?.includes("Corolla")) base = 9000;
  if (model?.includes("Golf")) base = 8500;

  const predicted =
    base -
    (2026 - year) * 400 -
    Math.floor(mileage / 20000) * 300;

  const profit = predicted - price;

  return {
    predicted,
    profit,
    score: profit > 2000 ? 9 : profit > 1000 ? 7 : 4,
    underpriced: profit > 1500,
  };
}
