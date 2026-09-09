import React from 'react';
import { AuthenticatedPlaceholder } from '../../components';

export default function DiagnosticStaffHomeScreen() {
  return (
    <AuthenticatedPlaceholder
      portalTitle="Diagnostic Staff Portal"
      portalSubtitle="Manage and process incoming diagnostic referrals"
      expectedRole="DIAGNOSTIC_STAFF"
      iconName="pulse"
    />
  );
}
