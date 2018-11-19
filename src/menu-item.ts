export default class MenuItem {
    constructor() {
        this.order = 0;
        this.path = "";
        this.title = "";
        this.selected = false;
        this.active = false;
        this.isEmptyParent = false;
        this.children = [];
    }
    order: number
    path: string
    title: string
    selected: boolean
    active: boolean
    isEmptyParent: boolean
    children: Array<MenuItem>
}