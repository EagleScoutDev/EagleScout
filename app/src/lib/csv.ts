export class CSVBuilder {
    private header: string[] = [];
    private rows: string[][] = [];

    public constructor() {}

    public addHeader(...header: string[]) {
        this.header.push(...header);
        return this;
    }

    public addRow(...row: any[]) {
        this.rows.push(row.map((cell) => cell.toString()));
        return this;
    }

    public build() {
        return [this.header.join(","), ...this.rows.map((row) => row.join(","))].join("\n");
    }
}
