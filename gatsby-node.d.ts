export declare const setFieldsOnGraphQLNodeType: ({ type, getNodes }: {
    type: any;
    getNodes: GetNodes;
}, pluginOptions: PluginOptions) => Promise<{
    menu: {
        type: any;
        resolve: (node: GatsbyNode) => Promise<MenuItemInterface[]>;
    };
    order: {
        type: any;
        result: (node: GatsbyNode) => number;
    };
} | {
    menu?: undefined;
    order?: undefined;
}>;
export declare const onPreExtractQueries: ({ store, getNodes, boundActionCreators, }: {
    store: any;
    getNodes: any;
    boundActionCreators: any;
}) => Promise<void>;
