const hexToHSL = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    (r /= 255), (g /= 255), (b /= 255);

    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    h = Math.round(360 * h);
    s = Math.round(100 * s);
    l = Math.round(100 * l);
    return { h, s, l };
  }
  return { h: 0, s: 0, l: 0 };
};

function Label({ color, name, onClick, ...props }) {
  const c = hexToHSL(color);

  return (
    <span
      className={
        "rounded-full px-2 border text-xs leading-5 inline-block " +
        (onClick ? "cursor-pointer" : "")
      }
      data-test="existing_labels"
      onClick={onClick}
      style={{
        backgroundColor: "hsla(" + c.h + "," + c.s + "%," + c.l + "%, 0.2)",
        color:
          "hsl(" +
          c.h +
          "," +
          Math.min(Number(c.s * 1.2), 100) +
          "%," +
          Math.min(Number(c.l * 1.5), 100) +
          "%)",
        borderColor:
          "hsl(" +
          c.h +
          "," +
          Number(c.s * 0.8) +
          "%," +
          Number(c.l * 0.8) +
          "%)",
      }}
    >
      {name}
    </span>
  );
}

export default Label;
