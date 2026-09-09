import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../theme';
import { Icon } from '../../components/Icon';
import { loginSchema } from '../../lib/validation';
import { api, setAccessToken } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';
import type { Role, AuthUser } from '../../types';

const CLINIC_PHONE = '+919777777777';
const CLINIC_WHATSAPP = '919777777777';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [serverError, setServerError] = useState('');

  const navigateForRole = (role: Role) => {
    switch (role) {
      case 'PATIENT':
        router.replace('/(patient)');
        break;
      case 'DOCTOR':
        router.replace('/(doctor)');
        break;
      case 'CLINIC':
        router.replace('/(clinic)');
        break;
      case 'DIAGNOSTIC_CENTER':
        router.replace('/(diagnosticCenter)');
        break;
      case 'DIAGNOSTIC_STAFF':
        router.replace('/(diagnosticStaff)');
        break;
      case 'SUPER_ADMIN':
        router.replace('/(superAdmin)');
        break;
      case 'ADMIN':
        router.replace('/(admin)');
        break;
      default:
        router.replace('/(main)');
        break;
    }
  };

  const handleLogin = async () => {
    setServerError('');
    setFieldErrors({});

    // Validate with Zod
    const validation = loginSchema.safeParse({ email: email.trim(), password });
    if (!validation.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as 'email' | 'password';
        if (field && !formattedErrors[field]) {
          formattedErrors[field] = issue.message;
        }
      }
      setFieldErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const responseData = response.data?.data;
      if (!responseData?.accessToken || !responseData?.user) {
        throw new Error('Invalid authentication response structure');
      }

      const { accessToken, refreshToken, user } = responseData;

      // Update Auth Context & SecureStore
      await login(
        { accessToken, refreshToken },
        user as AuthUser
      );

      // Role-based navigation
      navigateForRole(user.role);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const res = (err as { response?: { data?: { message?: string } } }).response;
        const msg = res?.data?.message || 'Invalid email or password. Please try again.';
        setServerError(msg);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        const errorObj = err as { message: string };
        if (errorObj.message.includes('Network Error') || errorObj.message.includes('timeout')) {
          setServerError('Network error. Please verify server connection and try again.');
        } else {
          setServerError(errorObj.message || 'Authentication failed. Please try again.');
        }
      } else {
        setServerError('Unable to connect to service. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPhone = () => {
    Linking.openURL(`tel:${CLINIC_PHONE}`).catch(() => {});
  };

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${CLINIC_WHATSAPP}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Header */}
          <View style={styles.headerRow}>
            <View style={styles.brandGroup}>
              <View style={styles.iconBox}>
                <Image
                  source={require('../../assets/logo-icon.png')}
                  style={styles.logoIcon}
                  resizeMode="contain"
                />
              </View>
              <Image
                source={require('../../assets/LOGO.png')}
                style={styles.logoFull}
                resizeMode="contain"
              />
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Portal</Text>
            </View>
          </View>

          {/* Card Container */}
          <View style={styles.card}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <View style={styles.featurePill}>
                <Icon name="sparkles" size={14} color="#D97706" />
                <Text style={styles.featurePillText}>Unified Healthcare Portal</Text>
              </View>

              <Text style={styles.heading}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Fast, reliable care without waiting room stress. Sign in to access your account.
              </Text>
            </View>

            {/* Single Sign-In Role Pill Bar */}
            <View style={styles.rolePillBar}>
              <Text style={styles.rolePillLabel}>Single Sign-In for:</Text>
              <View style={styles.roleTagsRow}>
                <View style={[styles.roleTag, styles.patientTag]}>
                  <Text style={[styles.roleTagText, styles.patientTagText]}>Patient</Text>
                </View>
                <View style={[styles.roleTag, styles.doctorTag]}>
                  <Text style={[styles.roleTagText, styles.doctorTagText]}>Doctor</Text>
                </View>
                <View style={[styles.roleTag, styles.clinicTag]}>
                  <Text style={[styles.roleTagText, styles.clinicTagText]}>Clinic</Text>
                </View>
                <View style={[styles.roleTag, styles.diagnosticTag]}>
                  <Text style={[styles.roleTagText, styles.diagnosticTagText]}>Diagnostic</Text>
                </View>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputFocused,
                    fieldErrors.email ? styles.inputError : null,
                  ]}
                >
                  <View style={styles.leadingIcon}>
                    <Icon
                      name="mail"
                      size={18}
                      color={emailFocused ? Colors.light.primary : Colors.light.ink400}
                    />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="you@example.com"
                    placeholderTextColor={Colors.light.ink400}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                    editable={!isSubmitting}
                  />
                </View>
                {fieldErrors.email && (
                  <View style={styles.errorRow}>
                    <Icon name="alert-circle" size={14} color={Colors.light.danger} />
                    <Text style={styles.errorText}>{fieldErrors.email}</Text>
                  </View>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputFocused,
                    fieldErrors.password ? styles.inputError : null,
                  ]}
                >
                  <View style={styles.leadingIcon}>
                    <Icon
                      name="lock"
                      size={18}
                      color={passwordFocused ? Colors.light.primary : Colors.light.ink400}
                    />
                  </View>
                  <TextInput
                    style={[styles.textInput, styles.passwordInput]}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.light.ink400}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    editable={!isSubmitting}
                  />
                  <TouchableOpacity
                    style={styles.trailingAction}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Icon
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={Colors.light.ink400}
                    />
                  </TouchableOpacity>
                </View>
                {fieldErrors.password && (
                  <View style={styles.errorRow}>
                    <Icon name="alert-circle" size={14} color={Colors.light.danger} />
                    <Text style={styles.errorText}>{fieldErrors.password}</Text>
                  </View>
                )}
              </View>

              {/* Server Error Banner */}
              {serverError ? (
                <View style={styles.serverErrorBanner}>
                  <Icon name="alert-circle" size={18} color={Colors.light.danger} />
                  <Text style={styles.serverErrorText}>{serverError}</Text>
                </View>
              ) : null}

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleLogin}
                activeOpacity={0.85}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Signing in...</Text>
                  </View>
                ) : (
                  <View style={styles.submitButtonContent}>
                    <Text style={styles.submitButtonText}>Sign In</Text>
                    <Icon name="arrow-right" size={18} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              {/* Registration Prompt */}
              <View style={styles.registerRow}>
                <Text style={styles.registerPrompt}>Don't have an account? </Text>
                <Text style={styles.registerLink}>Self-register via Web</Text>
              </View>
            </View>

            {/* Quick Clinic & Support Assistance Section */}
            <View style={styles.supportSection}>
              <Text style={styles.supportHeading}>
                Run a clinic or facing trouble logging in?
              </Text>
              <View style={styles.supportButtonGroup}>
                <TouchableOpacity
                  style={styles.supportButton}
                  onPress={openPhone}
                  activeOpacity={0.8}
                >
                  <Icon name="phone" size={15} color={Colors.light.ink700} />
                  <Text style={styles.supportButtonText}>Call Helpdesk</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.supportButton, styles.whatsappButton]}
                  onPress={openWhatsApp}
                  activeOpacity={0.8}
                >
                  <Icon name="message-circle" size={16} color="#059669" />
                  <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom Security Assurance */}
          <View style={styles.securityFooter}>
            <Icon name="shield-check" size={16} color={Colors.light.secondary} />
            <Text style={styles.securityText}>
              100% Secure Session <Text style={styles.securityDot}>•</Text> 256-bit Encryption
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSoft,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  logoIcon: {
    width: 26,
    height: 26,
  },
  logoFull: {
    width: 130,
    height: 28,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: '#10B981',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  card: {
    backgroundColor: Colors.light.surfaceWhite,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.md,
  },
  titleSection: {
    marginBottom: Spacing.three,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: Radius.full,
    marginBottom: Spacing.two,
  },
  featurePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  heading: {
    fontSize: Typography.fontSizes['2xl'],
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.light.primaryDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.light.ink500,
    lineHeight: Typography.lineHeights.sm,
    marginTop: Spacing.half,
  },
  rolePillBar: {
    backgroundColor: Colors.light.surface50,
    borderColor: Colors.light.surface200,
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.two,
    marginBottom: Spacing.four,
  },
  rolePillLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.ink600,
    marginBottom: Spacing.one,
  },
  roleTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  patientTag: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  patientTagText: {
    color: '#1D4ED8',
  },
  doctorTag: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  doctorTagText: {
    color: '#047857',
  },
  clinicTag: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  clinicTagText: {
    color: '#4338CA',
  },
  diagnosticTag: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  diagnosticTagText: {
    color: '#7E22CE',
  },
  form: {
    gap: Spacing.three,
  },
  inputGroup: {
    gap: Spacing.half,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.ink800,
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.inputBg,
    borderWidth: 1.2,
    borderColor: Colors.light.surface200,
    borderRadius: Radius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.two,
  },
  inputFocused: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: Colors.light.danger,
    backgroundColor: '#FEF2F2',
  },
  leadingIcon: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailingAction: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.ink900,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  passwordInput: {
    paddingRight: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.danger,
    fontWeight: '500',
  },
  serverErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.md,
    padding: Spacing.two,
  },
  serverErrorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.danger,
    fontWeight: '500',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: Radius.md,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.one,
    ...Shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.half,
  },
  registerPrompt: {
    fontSize: 13,
    color: Colors.light.ink500,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  supportSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.surface200,
    marginTop: Spacing.four,
    paddingTop: Spacing.three,
    alignItems: 'center',
  },
  supportHeading: {
    fontSize: 12,
    color: Colors.light.ink500,
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  supportButtonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.light.surfaceWhite,
    borderWidth: 1,
    borderColor: Colors.light.surface200,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: Spacing.two,
  },
  supportButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.ink700,
  },
  whatsappButton: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  whatsappButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.two,
    marginTop: Spacing.two,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.ink500,
  },
  securityDot: {
    color: Colors.light.ink400,
  },
});
