
interface GatsbyNode {
    path: string
    context: {
        title: string
        tree: Array<MenuItemInterface>
    }
    internal: {
        type: string
    }
    fields: {
        order: number | null
    }
}

type GetNodes = () => GatsbyNode[];

interface MenuItemInterface {
    order: number
    path: string
    title: string
    selected: boolean
    active: boolean
    isEmptyParent: boolean
    children: Array<MenuItemInterface>
}

interface PluginOptions {
    ignorePaths: string[]
    tree: MenuItemInterface[]
}