export class NavElement {
    constructor(
        public Name: string,
        public RouterLink: any[],
        public Children?: NavElement[],
    ) {
    };
}
