export class NavElement {
    constructor(
        public name: string,
        public routerLink: any[],
        public children?: NavElement[],
    ) {
    };
}
