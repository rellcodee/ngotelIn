import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // 1. Ambil user_id dari Header HTTP 'x-user-id' saat ngetes
    const mockUserId =
      request.headers['x-user-id'] || '6210b2d2-175b-4f64-a184-51174d8e193a';

    // Kalau controller minta spesifik prop misal @CurrentUser('id')
    if (data === 'id') {
      return mockUserId;
    }

    return { id: mockUserId, name: 'User Test' };
  },
);
