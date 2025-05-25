export class RegexTest {
  static isoDate(string: string): boolean {
    return string.match(Regex.ISO_DATE) != null || string.match(Regex.DATE) != null
  }
  static email(string: string): boolean {
    return string.match(Regex.EMAIL) != null
  }
}

export const Regex = {
  is: RegexTest,
  ISO_DATE_RUBY: /^[0-9]{4}-[0-9]{2}-[0-9]{2}T([0-9]{2}:){2}[0-9]{2}\.[0-9]{3}[+|-][0-9]{2}:[0-9]{2}$/,
  ISO_DATE: /^(\d{4}-\d{2}-\d{2})[A-Z]+(\d{2}:\d{2}:\d{2}).([0-9+-:]+)Z?$/,
  DATE: /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/,
  EMAIL: /^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/
}
