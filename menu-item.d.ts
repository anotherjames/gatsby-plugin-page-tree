export default class MenuItem implements MenuItemInterface {
    constructor();
    order: number;
    path: string;
    title: string;
    selected: boolean;
    active: boolean;
    isEmptyParent: boolean;
    children: Array<MenuItem>;
}
