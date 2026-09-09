import React from 'react';
import { AuthenticatedPlaceholder } from '../../components';

export default function AdminHomeScreen() {
  return (
    <AuthenticatedPlaceholder
      portalTitle="Admin Portal"
      portalSubtitle="System administration, clinic management, and doctor verification"
      expectedRole="ADMIN"
      iconName="shield"
    />
  );
}
