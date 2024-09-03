import { Role } from '@common/enums/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@auth/interfaces/requestWithUser.interface';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const user = req.user;
      return user?.roles.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;
