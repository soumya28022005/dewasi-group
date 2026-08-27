import React from 'react';
import { AuthenticatedPlaceholder } from '../../components';

export default function DiagnosticCenterHomeScreen() {
  return (
    <AuthenticatedPlaceholder
      portalTitle="Diagnostic Center Portal"
      portalSubtitle="Manage incoming referrals, tests, staff, and report uploads"
      expectedRole="DIAGNOSTIC_CENTER"
      iconName="pulse"
    />
  );
}
