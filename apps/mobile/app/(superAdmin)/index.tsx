import React from 'react';
import { AuthenticatedPlaceholder } from '../../components';

export default function SuperAdminHomeScreen() {
  return (
    <AuthenticatedPlaceholder
      portalTitle="Super Admin Portal"
      portalSubtitle="Full platform oversight, role configuration, and analytics"
      expectedRole="SUPER_ADMIN"
      iconName="shield"
    />
  );
}
