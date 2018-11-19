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
const buildTreeForPath = (pagePath, getNodes, ignorePaths) => __awaiter(this, void 0, void 0, function* () {
    return menu_builder_1.buildMenuFromNodes(getNodes(), pagePath, ignorePaths);
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
                    return buildTreeForPath(node.path, getNodes, pluginOptions.ignorePaths);
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