"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const util = require("util");
const fs = require("fs");
const path = require("path");
const menu_builder_1 = require("./menu-builder");
const copyFile = util.promisify(fs.copyFile);
const mergeConfiguredTree = (builtTree, configuredTree) => {
    const mergedTree = [];
    // The built tree needs to match the order of the configured tree, and
    // contain any titles that has.
    const builtPaths = [];
    for (const builtItem of builtTree) {
        builtPaths.push(builtItem.path);
    }
    const configuredPaths = [];
    for (const configuredItem of configuredTree) {
        let i = builtPaths.indexOf(menu_builder_1.normalizePath(configuredItem.path));
        // Only need to consider things in the configured tree that actually
        // exist in the built tree.
        if (i !== -1) {
            configuredPaths.push(builtTree[i].path);
            if (configuredItem.title) {
                builtTree[i].title = configuredItem.title;
            }
            mergedTree.push(builtTree[i]);
            // Traverse children.
            if (builtTree[i].children && builtTree[i].children.length > 0) {
                builtTree[i].children = mergeConfiguredTree(builtTree[i].children, configuredItem.children);
            }
        }
    }
    // Add remaining (unconfigured) paths of this level to the tree. No need to
    // traverse deeper here, because configured child items can only exist if
    // their parents are configured.
    for (const builtItem of builtTree) {
        if (configuredPaths.indexOf(builtItem.path) === -1) {
            mergedTree.push(builtItem);
        }
    }
    return mergedTree;
};
const buildTreeForPath = (pagePath, getNodes, ignorePaths, configuredTree) => __awaiter(this, void 0, void 0, function* () {
    const built = menu_builder_1.buildMenuFromNodes(getNodes(), pagePath, ignorePaths);
    return mergeConfiguredTree(built, configuredTree);
});
exports.setFieldsOnGraphQLNodeType = ({ type, getNodes }, pluginOptions) => __awaiter(this, void 0, void 0, function* () {
    if (!pluginOptions.ignorePaths) {
        pluginOptions.ignorePaths = [
            '/404',
            '/dev-404-page'
        ];
    }
    if (type.name === 'SitePage') {
        return {
            menu: {
                type: new graphql_1.GraphQLScalarType({
                    name: 'Menu',
                    serialize(value) {
                        return value;
                    }
                }),
                resolve: (node) => {
                    const tree = node.context.tree || pluginOptions.tree || [];
                    return buildTreeForPath(node.path, getNodes, pluginOptions.ignorePaths, tree);
                }
            },
            order: {
                type: graphql_1.GraphQLInt,
                result: (node) => {
                    if (node.fields && node.fields.order) {
                        return node.fields.order;
                    }
                    return 0;
                }
            }
        };
    }
    return {};
});
exports.onPreExtractQueries = ({ store, getNodes, boundActionCreators, }) => __awaiter(this, void 0, void 0, function* () {
    // Copy the helper fragment used to query the current page and it's menu items.
    const program = store.getState().program;
    yield copyFile(path.join(__dirname, "fragments.js"), `${program.directory}/.cache/fragments/page-tree.js`);
});
//# sourceMappingURL=gatsby-node.js.map