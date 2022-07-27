import { MockContext, Context, createMockContext } from '../lib/test_context'
import {Role} from '@prisma/client';

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

interface CreateUser {
  name: string,
  email: string,
  id: string,
  role: Role,
  createdAt: any,
  updatedAt: any,
}

export async function createUser(user:CreateUser, ctx: Context) {
  if (user.email){
    return await ctx.prisma.user.create({
      data: user
    })
  }else{
    return new Error("Email need to be unique")
  }
}
