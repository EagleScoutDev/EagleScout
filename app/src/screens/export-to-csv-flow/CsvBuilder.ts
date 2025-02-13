export class CsvBuilder {
  private header: string[] = [];
  private rows: string[][] = [];

  constructor() {
    return this;
  }

  addHeader(...header: string[]) {
    this.header.push(...header);
    return this;
  }

  addRow(...row: any[]) {
    this.rows.push(row.map(cell => cell.toString()));
    return this;
  }

  build() {
    return [this.header.join(',')]
      .concat(this.rows.map(row => row.join(',')))
      .join('\r\n');
  }
}
