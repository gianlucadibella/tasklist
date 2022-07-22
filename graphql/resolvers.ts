export const resolvers = {
    Query: {
        tasks: async (_parent, _args, ctx) => await ctx.prisma.task.findMany(),
    },
}