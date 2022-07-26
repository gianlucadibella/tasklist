import { arg, booleanArg, enumType, extendType, intArg, nonNull, objectType, queryType, stringArg } from 'nexus';
import { User } from './User';

export const Task = objectType({
    name: 'Task',
    definition(t) {
        t.string('id');
        t.string('title');
        t.string('description');
        t.field('category', {
            type: Category
        });
        t.boolean('deleted');
        t.boolean('done');
        t.string('userId')
        t.field('user', {
            type: User,
            async resolve(parent, _args, ctx) {
                return await ctx.prisma.task
                    .findUnique({
                        where: {
                            id: parent.id,

                        }
                    })
                    .user();
            }
        })
    }
})

const Category = enumType({
    name: 'Categories',
    members: ['WORK', 'HOME', 'OTHER']
})


export const Edge = objectType({
    name: 'Edge',
    definition(t) {
        t.string('cursor');
        t.field('node', {
            type: Task,
        });
    },
});

export const PageInfo = objectType({
    name: 'PageInfo',
    definition(t) {
        t.string('endCursor');
        t.boolean('hasNextPage');
    },
});

export const Response = objectType({
    name: 'Response',
    definition(t) {
        t.field('pageInfo', { type: PageInfo });
        t.list.field('edges', {
            type: Edge,
        });
    },
});

export const TasksQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('tasks', {
            type: 'Response',
            args: {
                first: intArg(),
                after: stringArg(),
            },
            async resolve(_, args, ctx) {
                let queryResults = null;

                if (args.after) {
                    queryResults = await ctx.prisma.task.findMany({
                        take: args.first, //the number of items to return from the database
                        skip: 1, //skip the cursor
                        cursor: {
                            id: args.after, //the cursor
                        },
                        where: {
                            user: {
                                email: ctx.user.email
                            }
                        }
                    });
                } else {
                    queryResults = await ctx.prisma.task.findMany({
                        take: args.first,
                        where: {
                            user: {
                                email: ctx.user.email
                            }
                        }
                    });
                }
                if (queryResults.length > 0) {

                    const lastTaskResults = queryResults[queryResults.length - 1];

                    const myCursor = lastTaskResults.id;

                    const secondQueryResults = await ctx.prisma.task.findMany({
                        take: args.first,
                        cursor: {
                            id: myCursor,
                        },
                        where: {
                            user: {
                                email: ctx.user.email
                            }
                        }
                    });

                    const result = {
                        pageInfo: {
                            endCursor: myCursor,
                            hasNextPage: secondQueryResults.length >= args.first,
                        },
                        edges: queryResults.map(task => ({
                            cursor: task.id,
                            node: task,
                        })),
                    };
                    return result;
                }

                return {
                    pageInfo: {
                        endCursor: null,
                        hasNextPage: false,
                    },
                    edges: [],
                };
            },
        });
    },
})

export const CreateTaskMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createTask', {
            type: Task,
            args: {
                title: nonNull(stringArg()),
                category: nonNull(stringArg()),
                description: nonNull(stringArg()),
            },
            async resolve(_parent, args, ctx) {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: ctx.user.email
                    },
                });

                if (!ctx.user) {
                    throw new Error(`You need to be logged in to perform an action`)
                }

                const newTask = {
                    title: args.title,
                    category: args.category,
                    description: args.description,
                    userId: user.id,
                    deleted: false,
                    done: false
                }

                return await ctx.prisma.task.create({
                    data: newTask,
                })
            },
        })
    },
})