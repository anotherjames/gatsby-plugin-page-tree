
interface GatsbyNode {
    path: string
    context: {
        title: string
    }
    internal: {
        type: string
    }
    fields: {
        order: number | null
    }
}

type GetNodes = () => GatsbyNode[];

interface PluginOptions {
    ignorePaths: string[]
}