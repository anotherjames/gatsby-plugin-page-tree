import MenuItem from './menu-item';
export declare const normalizePath: (p: string) => string;
export declare function buildMenuFromNodes(nodes: Array<GatsbyNode>, selectedPath: string, ignorePaths: string[]): Array<MenuItem>;
