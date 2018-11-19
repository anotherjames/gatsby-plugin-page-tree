"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MenuItem {
    constructor() {
        this.order = 0;
        this.path = "";
        this.title = "";
        this.selected = false;
        this.active = false;
        this.isEmptyParent = false;
        this.children = [];
    }
}
exports.default = MenuItem;
//# sourceMappingURL=menu-item.js.map