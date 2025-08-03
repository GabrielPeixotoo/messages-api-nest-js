import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SET_ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../enum/route-policies.enum';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<RoutePolicies>(
      SET_ROUTE_POLICY_KEY,
      context.getHandler(),
    );
    console.log(routePolicyRequired);
    return true;
  }
}
