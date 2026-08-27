import React from 'react';
import { AuthenticatedPlaceholder } from '../../components';

export default function ClinicHomeScreen() {
  return (
    <AuthenticatedPlaceholder
      portalTitle="Clinic Portal"
      portalSubtitle="Manage doctors, receptionists, schedules, and analytics"
      expectedRole="CLINIC"
      iconName="building"
    />
  );
}
