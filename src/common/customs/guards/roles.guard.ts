import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "../enums/enum-user-roles";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRoles[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return false;
    }
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new ForbiddenException("사용자가 인증되지 않았습니다.");
    }

    const userRole = request.user.role;

    if (!userRole) {
      throw new ForbiddenException("사용자 역할을 확인할 수 없습니다.");
    }

    if (requiredRoles.includes(UserRoles.ADMIN)) {
      if (userRole === UserRoles.ADMIN) {
        return true;
      } else {
        throw new ForbiddenException("관리자 권한이 필요합니다.");
      }
    }
    return false;
  }
}
