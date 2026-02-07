import tools from './tools.json';

export const specLoader = {
    async loadTools() {
        return Object.entries(tools).map(([name, config]) => ({
            name,
            description: config.description,
            handler: config.handler,
            parameters: config.parameters
        }));
    },

    async loadTool(name: string) {
        const tool = (tools as Record<string, any>)[name];
        if (!tool) return null;
        return {
            name,
            ...tool
        };
    }
};
