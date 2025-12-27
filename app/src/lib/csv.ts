export class CSVBuilder {
    private csvHeader: string[] = [];
    private csvRows: string[][] = [];

    public header(...header: string[]) {
        this.csvHeader.push(...header);
        return this;
    }

    public map<T>(data: T[], fn: (x: T, i: number) => any[]) {
        this.csvRows.push(data.map((x, i) => String(fn(x, i))));
        return this;
    }

    public build() {
        return this.csvHeader.join(",") + "\n" + this.csvRows.map((row) => row.join(",")).join("\n");
    }
}
