import Color from "color";

/**
 * Converts a color string or a color to a hex string.
 *
 * @param color The value to convert.
 *
 * @returns A hex string of the given color, including the alpha value.
 */
export const colorToHex = (
  color: string | Color | undefined
): string | undefined => {
  if (!color) {
    return;
  }

  if (typeof color === "string") {
    color = new Color(color);
  }

  // Hex color values have no alpha component, so we have to add that explicitly.
  if (color.alpha() < 1) {
    let alpha = Math.round(color.alpha() * 255).toString(16);
    if (alpha.length < 2) {
      alpha = "0" + alpha;
    }

    return color.hex() + alpha;
  } else {
    return color.hex();
  }
};

export interface Colors {
  [key: string]: string;
}
export interface ITokenEntry {
  name?: string;
  scope: string[] | string;
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
  };
}

// This is the structure of a vscode theme file.
export interface IThemeObject {
  name: string;
  type?: string;
  include?: string;
  colors?: Colors;

  settings?: ITokenEntry[]; // Old style specification.
  tokenColors?: ITokenEntry[]; // This is how it should be done now.
}

export const updateTheme = (
  theme: string,
  type: "light" | "dark",
  values: IThemeObject
) => {
  const entries: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(values.colors || {})) {
    entries[key] = colorToHex(value) || "";
  }
  const tokenRules: Array<any> = [];
  (values.tokenColors || []).forEach((value: ITokenEntry): void => {
    const scopeValue = value.scope || [];
    const scopes = Array.isArray(scopeValue)
      ? scopeValue
      : scopeValue.split(",");
    scopes.forEach((scope: string): void => {
      tokenRules.push({
        token: scope,
        foreground: colorToHex(value.settings.foreground),
        background: colorToHex(value.settings.background),
        fontStyle: value.settings.fontStyle,
      });
    });
  });

  return {
    base: type === "light" ? "vs" : "vs-dark",
    inherit: true,
    rules: tokenRules,
    colors: entries,
  };
};
