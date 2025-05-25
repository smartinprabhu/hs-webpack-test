export class RandomUtil {
  static num(min: number, max: number): number {
    return Math.floor(Math.random() * Math.floor(max + 1 - min)) + min
  }

  static maybe(): boolean {
    return RandomUtil.num(0, 1) === 0
  }

  static chance(percentage: number): boolean {
    return percentage > RandomUtil.num(0, 99)
  }
}
