import { enumType, nonNull, objectType, queryField, stringArg, extendType, queryType } from "nexus";
import { Task } from './Task';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.string('id');
        t.string('name');
        t.string('email');
        t.field('role', { type: Role });
        t.nonNull.list.nonNull.field('tasklist', {
            type: Task,
            async resolve(parent, _args, ctx) {
                return await ctx.prisma.user
                    .findUnique({
                        where: {
                            id: parent.id,
                        }
                    })
                    .tasks();
            },
        });
    },
});


const Role = enumType({
    name: 'Role',
    members: ['USER', 'ADMIN']
})

export const fetchUser = extendType({
    type: 'Query',
    definition(t) {
        t.field('user', {
            type: User,
            resolve(parent, args, ctx) {
                return ctx.prisma.user.findUnique({
                    where: {
                        email: ctx.user.email
                    },
                })
            }
        }),
            t.field('tasklist', {
                type: Task,
                resolve(parent, _args, ctx) {
                    const data = ctx.prisma.user.findUnique({
                        where: {
                            email: ctx.user.email
                        },
                    }).tasks()

                    return data
                }
            })

    }
})
