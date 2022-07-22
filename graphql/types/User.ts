import { prisma } from "@prisma/client";
import { enumType, nonNull, objectType, queryField, stringArg, extendType } from "nexus";
import { Task } from './Task';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.string('id');
        t.string('name');
        t.string('email');
        t.field('role', { type: Role });
        t.list.field('tasks', {
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

export const UserIdByEmail = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user', {
            type: 'User',
            args: {
                email: nonNull(stringArg())
            },
            async resolve(_, args, ctx) {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: args.email,
                    },
                });
                return user
            },
        });
    },
});
