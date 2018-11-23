import { GraphQLScalarType, GraphQLInt } from 'graphql';
import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'
import { buildMenuFromNodes, normalizePath } from './menu-builder'

const copyFile = util.promisify(fs.copyFile);

const mergeConfiguredTree = (builtTree: MenuItemInterface[], configuredTree: MenuItemInterface[]) => {
    const mergedTree: MenuItemInterface[] = [];

    // The built tree needs to match the order of the configured tree, and
    // contain any titles that has.
    const builtPaths = [];
    for (const builtItem of builtTree) {
        builtPaths.push(builtItem.path);
    }

    const configuredPaths = [];
    for (const configuredItem of configuredTree) {
        let i = builtPaths.indexOf(normalizePath(configuredItem.path));
        // Only need to consider things in the configured tree that actually
        // exist in the built tree.
        if (i !== -1) {
            configuredPaths.push(builtTree[i].path);

            if (configuredItem.title) {
                builtTree[i].title = configuredItem.title
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

const buildTreeForPath = async(pagePath: string, getNodes: GetNodes, ignorePaths: string[], configuredTree: MenuItemInterface[]) => {
    const built = buildMenuFromNodes(getNodes(), pagePath, ignorePaths);
    return mergeConfiguredTree(built, configuredTree);
};

export const setFieldsOnGraphQLNodeType = async({ type, getNodes }: {type: any, getNodes: GetNodes}, pluginOptions: PluginOptions) => {
    if(!pluginOptions.ignorePaths) {
        pluginOptions.ignorePaths = [
            '/404',
            '/dev-404-page'
        ];
    }

    if (type.name === 'SitePage') {
        return {
            menu: {
                type: new GraphQLScalarType({
                    name: 'Menu',
                    serialize(value) {
                        return value;
                    }
                }),
                resolve: (node: GatsbyNode) => {
                    const tree = node.context.tree || pluginOptions.tree || [];
                    return buildTreeForPath(node.path, getNodes, pluginOptions.ignorePaths, tree);
                }
            },
            order: {
                type: GraphQLInt,
                result: (node: GatsbyNode) => {
                    if(node.fields && node.fields.order) {
                        return node.fields.order;
                    }
                    return 0;
                }
            }
        };
    }

    return {};
};

export const onPreExtractQueries = async ({
    store,
    getNodes,
    boundActionCreators,
  }) => {
    // Copy the helper fragment used to query the current page and it's menu items.
    const program = store.getState().program;
    await copyFile(path.join(__dirname, "fragments.js"),
        `${program.directory}/.cache/fragments/page-tree.js`);
};
