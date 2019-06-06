export interface SqlError {
    class: number;
    lineNumber: number;
    message: string;
    number: number
    procedure: number
    server: string;
    source: string;
    state: number;
}
