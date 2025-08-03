import { SetMetadata } from '@nestjs/common';
import { SET_ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../enum/route-policies.enum';

export const SetRoutePolicy = (policy: RoutePolicies) => {
  return SetMetadata(SET_ROUTE_POLICY_KEY, policy);
};
