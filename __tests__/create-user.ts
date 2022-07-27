import { MockContext, Context, createMockContext } from '../lib/test_context';
import { createUser } from '../functions-with-context/create-user'
import {Role} from '@prisma/client';

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

test('should create new user ', async () => {
  var genDate = new Date(Date.now())
  const user = {
    id: '1',
    name: 'Rich',
    email: 'hello@prisma.io',
    createdAt: genDate,
    updatedAt: genDate,
    role: Role.USER,
  }
  mockCtx.prisma.user.create.mockResolvedValue(user)

  await expect(createUser(user, ctx)).resolves.toEqual({
    id: '1',
    name: 'Rich',
    email: 'hello@prisma.io',
    createdAt: genDate,
    updatedAt: genDate,
    role: 'USER',
  })
})