import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth-context';
import { AuthenticatedPlaceholder } from '../../components';

export default function MainFallbackScreen() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role === 'PATIENT') {
      router.replace('/(patient)');
    }
  }, [loading, isAuthenticated, user, router]);

  return (
    <AuthenticatedPlaceholder
      portalTitle="Healthcare Portal"
      portalSubtitle="Dewasi Group Healthcare Ecosystem"
      expectedRole={user?.role || 'PATIENT'}
      iconName="user"
    />
  );
}
