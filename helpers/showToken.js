export default function showToken(value, denom) {
  if (denom === process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN) {
    return value + " " + denom;
  } else {
    let roundOff = Math.floor(value / 10000) / 100;
    return roundOff + " " + denom;
  }
}
