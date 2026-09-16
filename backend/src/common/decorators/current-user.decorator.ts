import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      const fallbackId = request.headers['x-user-id'];
      if (fallbackId) {
        if (data === 'id' || data === 'userId') return fallbackId;
        return { id: fallbackId, userId: fallbackId, name: 'User Test' };
      }
      return null;
    }

    if (data === 'id' || data === 'userId') {
      return user.userId || user.id;
    }

    if (data) {
      return user[data];
    }

    return {
      ...user,
      id: user.userId || user.id,
      userId: user.userId || user.id,
    };
  },
);
