import * as hexToRgb from 'pure-color/parse/hex';
import * as rgbToHsv from 'pure-color/convert/rgb2hsv';
import * as rgbToHex from 'pure-color/convert/rgb2hex';
import * as hsvToRgb from 'pure-color/convert/hsv2rgb';

export default class Color {
  public alpha: number = 1;

  private color: {
    rgb?: number[];
    hsv?: number[];
    hex?: string;
  };

  constructor(color: string = '#000') {
    if (color[0] == '#') {
      this.hex = color;
    } else {
      let match = /(.*)\((.*)\)/.exec(color);

      if (match) {
        let values = match[2].split(',').map(val => parseInt(val.trim()));

        switch (match[1].trim()) {
          case 'rgb':
            this.rgb = values;

            break;

          case 'rgba':
            this.rgba = values;

            break;

          case 'hsv':
            this.hsv = values;

            break;

          default:
            throw new Error('Unsupported color format: ' + color);
        }
      } else {
        throw new Error('Unknown color format: ' + color);
      }
    }
  }

  clone(): Color {
    return new Color('rgb(' + this.rgb.join(',') + ')');
  }

  set rgb(rgb: number[]) {
    if (rgb.length != 3) {
      throw new Error('An array with a length of 3 is expected.');
    }

    this.alpha = 1;
    this.color = {
      rgb: rgb
    };
  }

  get rgb(): number[] {
    return (this.color.rgb = this.color.rgb || (this.color.hex ? this.hexToRgb(this.hex) : this.hsvToRgb(this.hsv)));
  }

  set rgba(rgba: number[]) {
    if (rgba.length != 4) {
      throw new Error('An array with a length of 3 is expected.');
    }

    this.rgb = [rgba[0], rgba[1], rgba[2]];
    this.alpha = rgba[3];
  }

  get rgba(): number[] {
    return [this.rgb[0], this.rgb[1], this.rgb[2], this.alpha];
  }

  set hsv(hsv: number[]) {
    if (hsv.length != 3) {
      throw new Error('An array with a length of 3 is expected.');
    }

    this.alpha = 1;
    this.color = {
      hsv: hsv
    };
  }

  get hsv(): number[] {
    // Slice array to return copy
    return (this.color.hsv = this.color.hsv || this.rgbToHsv(this.rgb)).slice(0);
  }

  set hex(hex: string) {
    this.alpha = 1;
    this.color = {
      hex: hex
    };
  }

  get hex(): string {
    // Slice array to return copy
    return (this.color.hex = this.color.hex || this.rgbToHex(this.rgb)).slice(0);
  }

  public brighterThan(color: Color, difference: number): this {
    let primaryColorHsv = this.hsv;
    let secondaryColorHsv = color.hsv;

    if (primaryColorHsv[2] >= secondaryColorHsv[2] + difference) {
      return this;
    }

    primaryColorHsv[2] = secondaryColorHsv[2] + difference;

    if (primaryColorHsv[2] > 360) {
      primaryColorHsv[2] = 360;
    }

    this.hsv = primaryColorHsv;

    return this;
  }

  public darkerThan(color: Color, difference: number): this {
    let primaryColorHsv = this.hsv;
    let secondaryColorHsv = color.hsv;

    if (primaryColorHsv[2] <= secondaryColorHsv[2] - difference) {
      return this;
    }

    primaryColorHsv[2] = secondaryColorHsv[2] - difference;

    if (primaryColorHsv[2] < 0) {
      primaryColorHsv[2] = 0;
    }

    this.hsv = primaryColorHsv;

    return this;
  }

  public brighterOrDarkerThan(color: Color, difference: number): this {
    let primaryColorHsv = this.hsv;
    let secondaryColorHsv = color.hsv;

    if (primaryColorHsv[2] <= secondaryColorHsv[2]) {
      return this.darkerThan(color, difference);
    } else {
      return this.brighterThan(color, difference);
    }
  }

  private rgbToHex(rgb: number[]): string {
    return rgbToHex(rgb);
  }

  private hexToRgb(hex: string): number[] {
    return hexToRgb(hex).map(val => Math.round(val));
  }

  private rgbToHsv(rgb: number[]): number[] {
    return rgbToHsv(rgb).map(val => Math.round(val));
  }

  private hsvToRgb(hsv: number[]): number[] {
    return hsvToRgb(hsv).map(val => Math.round(val));
  }
}