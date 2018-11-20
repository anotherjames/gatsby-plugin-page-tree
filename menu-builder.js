"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const treeify_paths_1 = require("treeify-paths");
const menu_item_1 = require("./menu-item");
class TreeNode {
}
exports.normalizePath = (p) => {
    if (p.endsWith('/')) {
        p = p.substr(0, p.length - 1);
    }
    if (!p.startsWith('/')) {
        p = '/' + p;
    }
    return p;
};
function buildMenuFromNodes(nodes, selectedPath, ignorePaths) {
    selectedPath = exports.normalizePath(selectedPath);
    let pages = nodes.filter(x => x.internal.type == 'SitePage');
    if (!ignorePaths) {
        ignorePaths = [];
    }
    ignorePaths = ignorePaths.map(exports.normalizePath);
    let treePaths = pages
        .map(x => exports.normalizePath(x.path))
        .filter(x => x !== '/')
        .filter(x => {
        return ignorePaths.findIndex(ignorePath => ignorePath == x) == -1;
    });
    let tree = treeify_paths_1.default(treePaths);
    let rootNode = tree.children[0];
    let result = [];
    const walkTreeNode = (node, parents) => {
        let normalizedPath = exports.normalizePath(node.path);
        let menuItem = new menu_item_1.default();
        menuItem.path = normalizedPath;
        let page = pages.find(x => exports.normalizePath(x.path) == normalizedPath);
        if (page) {
            menuItem.title = page.context.title;
            if (page.fields && page.fields.order) {
                menuItem.order = page.fields.order;
            }
            else {
                menuItem.order = 0;
            }
        }
        else {
            menuItem.title = node.name;
            menuItem.isEmptyParent = true;
            menuItem.order = 0;
        }
        if (normalizedPath == selectedPath) {
            menuItem.selected = true;
            for (let parent of parents) {
                parent.active = true;
            }
        }
        if (node.children && node.children.length > 0) {
            let newParents = [
                ...parents,
                menuItem
            ];
            menuItem.children = node.children.map(child => {
                return walkTreeNode(child, newParents);
            });
        }
        return menuItem;
    };
    for (let child of rootNode.children) {
        result.push(walkTreeNode(child, []));
    }
    const sortChildren = (items) => {
        for (let item of items) {
            item.children = sortChildren(item.children);
        }
        return items.sort((a, b) => a.order - b.order);
    };
    result = result.sort((a, b) => a.order - b.order);
    for (let item of result) {
        item.children = sortChildren(item.children);
    }
    // Now that we built the entire tree, let's remove the nodes that don't matter.
    const collapseChildren = (item) => {
        // We only want to consider collapsing children if this current node can be selected.
        // If it isn't a valid page, then the user can't navigate to it to see it's children.
        if (!item.isEmptyParent) {
            // Collapse children if this node isn't in the active selected path.
            if (!item.active && !item.selected) {
                item.children = [];
            }
        }
        for (let child of item.children) {
            collapseChildren(child);
        }
    };
    for (let child of result) {
        collapseChildren(child);
    }
    return result;
}
exports.buildMenuFromNodes = buildMenuFromNodes;
//# sourceMappingURL=menu-builder.js.map