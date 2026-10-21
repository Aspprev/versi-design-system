export function contrastRatio(a: string | readonly number[], b: string | readonly number[]) {
  const luminance = (value: string | readonly number[]) => {
    const channels = typeof value === "string" ? value.match(/[\d.]+/g)!.slice(0, 3).map(Number) : value;
    return channels.reduce((sum, channel, index) => {
      const n = channel / 255;
      return sum + (n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4) * [.2126, .7152, .0722][index];
    }, 0);
  };
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
