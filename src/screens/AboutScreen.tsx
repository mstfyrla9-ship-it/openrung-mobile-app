/**
 * About us tab: wordmark hero with version pill and project manifesto, followed
 * by privacy / open-source-licenses panels and icon-only links to the website
 * and social profiles. Version and licensing live here so the Settings tab
 * stays purely operational.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import { SettingPanel } from '../components/SettingPanel';
import {
  BlueskyIcon,
  GitHubIcon,
  InstagramIcon,
  TelegramIcon,
  ThreadsIcon,
  WebsiteIcon,
  XIcon,
} from '../components/SocialIcons';
import { APP_VERSION, AppConfig } from '../config';
import { resolveLanguage, useLanguage, useStrings } from '../i18n';
import { edgePadding, layout, useTabSceneColumns } from '../layout';
import { monoFont, palette, tokens } from '../theme';

const SHAM_CASH_TRANSFER_ID = '963793dbb5e910b81683981b2c8fd9f6';
const SUPPORT_MANAGER = 'مصطفى أبو محمد';
const SUPPORT_UPDATES_URL = 'https://t.me/SourceForging';
const SUPPORT_EMAIL = 'mwings740@gmail.com';
const COPIED_FEEDBACK_MS = 1500;

export interface AboutScreenProps {
  onOpenLicenses: () => void;
}

const SOCIAL_LINKS = [
  {
    label: 'OpenRung website',
    url: AppConfig.WEBSITE_URL,
    color: palette.terminalGreen,
    Icon: WebsiteIcon,
  },
  {
    label: 'OpenRung on GitHub',
    url: AppConfig.GITHUB_URL,
    color: palette.bodyText,
    Icon: GitHubIcon,
  },
  {
    label: 'OpenRung on X',
    url: AppConfig.X_URL,
    color: palette.bodyText,
    Icon: XIcon,
  },
  {
    label: 'OpenRung on Threads',
    url: AppConfig.THREADS_URL,
    color: palette.bodyText,
    Icon: ThreadsIcon,
  },
  {
    label: 'OpenRung on Bluesky',
    url: AppConfig.BLUESKY_URL,
    color: '#1185FE',
    Icon: BlueskyIcon,
  },
  {
    label: 'OpenRung on Instagram',
    url: AppConfig.INSTAGRAM_URL,
    color: '#E4405F',
    Icon: InstagramIcon,
  },
  {
    label: 'OpenRung Telegram bot',
    url: AppConfig.TELEGRAM_URL,
    color: '#26A5E4',
    Icon: TelegramIcon,
  },
] as const;

export function AboutScreen({
  onOpenLicenses,
}: AboutScreenProps): React.JSX.Element {
  const s = useStrings();
  const { languageTag } = useLanguage();
  const { insets, twoColumns, contentWidth, columnWidth } = useTabSceneColumns();
  const columnStyle = { width: columnWidth };
  const isRtl = ['ar', 'fa'].includes(resolveLanguage(languageTag));
  const [shamCashCopied, setShamCashCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current != null) {
        clearTimeout(copiedTimer.current);
      }
    },
    [],
  );

  const onOpenDonate = useCallback(() => {
    Linking.openURL(AppConfig.DONATE_URL).catch(() => {
      // Ignore: no browser available.
    });
  }, []);

  const onOpenPrivacy = useCallback(() => {
    Linking.openURL(AppConfig.PRIVACY_URL).catch(() => {
      // Ignore: no browser available.
    });
  }, []);

  const onOpenSocial = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      // Ignore: no browser or matching app available.
    });
  }, []);

  const onCopyShamCashId = useCallback(() => {
    try {
      Clipboard.setString(SHAM_CASH_TRANSFER_ID);
      setShamCashCopied(true);
      if (copiedTimer.current != null) {
        clearTimeout(copiedTimer.current);
      }
      copiedTimer.current = setTimeout(
        () => setShamCashCopied(false),
        COPIED_FEEDBACK_MS,
      );
      Alert.alert(s.actionCopied);
    } catch {
      Alert.alert(s.actionCopyFailed);
    }
  }, [s.actionCopied, s.actionCopyFailed]);

  const onOpenSupportLink = useCallback(
    (url: string) => {
      Linking.openURL(url).catch(() => {
        Alert.alert(s.actionOpenLinkFailed);
      });
    },
    [s.actionOpenLinkFailed],
  );

  return (
    <ScrollView
      style={[styles.root, isRtl ? styles.rtl : styles.ltr]}
      contentContainerStyle={edgePadding(insets, 24)}
    >
      <View style={[styles.content, twoColumns && layout.twoColumns, { width: contentWidth }]}>
        <View style={[styles.sectionColumn, columnStyle]}>
          <Text style={styles.title}>{s.aboutTitle}</Text>

          <View style={styles.hero}>
            <View style={styles.heroRow}>
              <View style={styles.appMark} accessible accessibilityLabel={s.appName}>
                <Text style={styles.appMarkText}>OR</Text>
              </View>
              <Text style={styles.heroWordmark}>{s.appName}</Text>
              <View style={styles.versionPill}>
                <Text style={styles.versionText}>v{APP_VERSION}</Text>
              </View>
            </View>
            <Text style={styles.heroTagline}>{s.homeTagline}</Text>
            <Text style={styles.missionLead}>{s.aboutMissionLead}</Text>
            <Text style={styles.mission}>{s.aboutMissionBody}</Text>
          </View>
          <View style={styles.projectInfo}>
            <View style={styles.projectInfoRow}>
              <Text style={styles.projectInfoLabel}>{s.aboutDeveloperLabel}</Text>
              <Text style={styles.projectInfoValue}>{s.aboutDeveloperName}</Text>
            </View>
            <Text style={styles.copyrightText}>
              © {new Date().getFullYear()} {s.aboutCopyright}
            </Text>
          </View>
        </View>

        <View style={[styles.sectionColumn, columnStyle]}>
          <Text style={styles.sectionHeader}>
            {s.aboutSupportHeader.toUpperCase()}
          </Text>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={s.donateTitle}
            onPress={onOpenDonate}
            style={({ pressed }) => [
              styles.donateButton,
              pressed && styles.donateButtonPressed,
            ]}
          >
            <Text style={styles.donateHeart}>♥</Text>
            <View style={styles.donateTextColumn}>
              <Text style={styles.donateTitle}>{s.donateTitle}</Text>
              <Text style={styles.donateSubtitle}>{s.donateSubtitle}</Text>
            </View>
            <Text style={styles.donateChevron}>›</Text>
          </Pressable>

          <View style={styles.supportMessage}>
            <Text style={styles.supportMessageText}>{s.aboutSupportMessage}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${s.shamCashTransferIdLabel}: ${SHAM_CASH_TRANSFER_ID}`}
            onPress={onCopyShamCashId}
            style={({ pressed }) => [
              styles.shamCashCard,
              pressed && styles.supportItemPressed,
            ]}
          >
            <View style={styles.supportItemText}>
              <Text style={styles.supportItemTitle}>شام كاش – Sham Cash</Text>
              <Text style={styles.supportItemSubtitle}>
                {s.shamCashTransferIdLabel}
              </Text>
              <Text selectable style={styles.transferId}>
                {SHAM_CASH_TRANSFER_ID}
              </Text>
            </View>
            <Text style={styles.copyLabel}>
              {shamCashCopied ? s.actionCopied : s.actionCopy}
            </Text>
          </Pressable>

          <Text style={styles.sectionHeader}>
            {s.supportContactsHeader.toUpperCase()}
          </Text>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`${s.supportManagerLabel}: ${SUPPORT_MANAGER}`}
            onPress={() => onOpenSupportLink(`mailto:${SUPPORT_EMAIL}`)}
            style={({ pressed }) => [
              styles.supportContact,
              pressed && styles.supportItemPressed,
            ]}
          >
            <Text style={styles.supportItemTitle}>{s.supportManagerLabel}</Text>
            <Text style={styles.supportItemSubtitle}>{SUPPORT_MANAGER}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`${s.supportUpdatesLabel}: ${SUPPORT_UPDATES_URL}`}
            onPress={() => onOpenSupportLink(SUPPORT_UPDATES_URL)}
            style={({ pressed }) => [
              styles.supportContact,
              pressed && styles.supportItemPressed,
            ]}
          >
            <Text style={styles.supportItemTitle}>{s.supportUpdatesLabel}</Text>
            <Text style={styles.supportItemSubtitle}>{SUPPORT_UPDATES_URL}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`${s.supportEmailLabel}: ${SUPPORT_EMAIL}`}
            onPress={() => onOpenSupportLink(`mailto:${SUPPORT_EMAIL}`)}
            style={({ pressed }) => [
              styles.supportContact,
              pressed && styles.supportItemPressed,
            ]}
          >
            <Text style={styles.supportItemTitle}>{s.supportEmailLabel}</Text>
            <Text style={styles.supportItemSubtitle}>{SUPPORT_EMAIL}</Text>
          </Pressable>

          <Text style={styles.sectionHeader}>
            {s.aboutLegalHeader.toUpperCase()}
          </Text>
          <SettingPanel
            title={s.privacyPolicyTitle}
            subtitle={s.privacyPolicySubtitle}
            onPress={onOpenPrivacy}
          />
          <SettingPanel
            title={s.licensesSettingTitle}
            subtitle={s.licensesSettingSubtitle}
            onPress={onOpenLicenses}
          />

          <Text style={styles.sectionHeader}>
            {s.aboutFollowHeader.toUpperCase()}
          </Text>
          <View style={styles.socialRow}>
            {SOCIAL_LINKS.map(({ label, url, color, Icon }) => (
              <Pressable
                key={url}
                accessibilityRole="link"
                accessibilityLabel={label}
                hitSlop={6}
                onPress={() => onOpenSocial(url)}
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialButtonPressed,
                ]}
              >
                <Icon color={color} size={20} />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.screen,
  },
  rtl: {
    direction: 'rtl',
  },
  ltr: {
    direction: 'ltr',
  },
  content: {
    gap: 14,
    alignSelf: 'center',
  },
  sectionColumn: {
    gap: 14,
  },
  title: {
    color: palette.terminalGreen,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 6,
  },
  hero: {
    borderRadius: tokens.radiusLg,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.borderDim,
    padding: 16,
    gap: 4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.terminalGreen,
  },
  appMarkText: {
    color: palette.onGreenText,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 12,
  },
  heroWordmark: {
    color: palette.terminalGreen,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 22,
    textShadowColor: tokens.glowSoft,
    textShadowRadius: 10,
  },
  versionPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.borderDim,
    backgroundColor: palette.fabBackground,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  versionText: {
    color: palette.relayLine,
    fontFamily: monoFont,
    fontSize: 11,
  },
  heroTagline: {
    color: palette.dimText,
    fontFamily: monoFont,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  missionLead: {
    marginTop: 10,
    color: palette.bodyText,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  mission: {
    marginTop: 2,
    color: palette.bodyText,
    fontFamily: monoFont,
    fontSize: 12,
    lineHeight: 18,
  },
  // Deliberately louder than SettingPanel rows: terminal-green border + glow
  // and a tinted fill so the donate call-to-action stands out from Legal.
  donateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    backgroundColor: palette.fabBackground,
    borderWidth: 1,
    borderColor: palette.terminalGreen,
    padding: 14,
    shadowColor: tokens.glow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  donateButtonPressed: {
    opacity: 0.7,
  },
  donateHeart: {
    color: palette.terminalGreen,
    fontSize: 20,
    textShadowColor: tokens.glow,
    textShadowRadius: 10,
  },
  donateTextColumn: {
    flex: 1,
    gap: 2,
  },
  donateTitle: {
    color: palette.terminalGreen,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: tokens.glowSoft,
    textShadowRadius: 8,
  },
  donateSubtitle: {
    color: palette.bodyText,
    fontFamily: monoFont,
    fontSize: 12,
    lineHeight: 17,
  },
  donateChevron: {
    color: palette.terminalGreen,
    fontFamily: monoFont,
    fontSize: 20,
    fontWeight: 'bold',
  },
  supportMessage: {
    borderRadius: tokens.radiusSm,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.borderDim,
    padding: 14,
  },
  supportMessageText: {
    color: palette.bodyText,
    fontFamily: monoFont,
    fontSize: 12,
    lineHeight: 19,
  },
  shamCashCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: tokens.radiusSm,
    backgroundColor: palette.fabBackground,
    borderWidth: 1,
    borderColor: palette.terminalGreen,
    padding: 14,
  },
  supportItemText: {
    flex: 1,
    gap: 4,
  },
  supportItemTitle: {
    color: palette.bodyText,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 13,
  },
  supportItemSubtitle: {
    color: palette.dimText,
    fontFamily: monoFont,
    fontSize: 11,
    lineHeight: 16,
  },
  transferId: {
    color: palette.terminalGreen,
    fontFamily: monoFont,
    fontSize: 12,
    lineHeight: 18,
  },
  copyLabel: {
    color: palette.terminalGreen,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 12,
  },
  supportContact: {
    gap: 4,
    borderRadius: tokens.radiusSm,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.borderDim,
    padding: 14,
  },
  supportItemPressed: {
    opacity: 0.7,
  },
  projectInfo: {
    gap: 6,
    borderRadius: tokens.radiusSm,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.borderDim,
    padding: 14,
  },
  projectInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  projectInfoLabel: {
    color: palette.dimText,
    fontFamily: monoFont,
    fontSize: 12,
  },
  projectInfoValue: {
    color: palette.bodyText,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 12,
  },
  copyrightText: {
    color: palette.dimText,
    fontFamily: monoFont,
    fontSize: 11,
  },
  sectionHeader: {
    color: palette.dimText,
    fontFamily: monoFont,
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 1.5,
    marginTop: 8,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radiusSm,
    backgroundColor: palette.panel,
    borderWidth: 1,
    borderColor: palette.borderDim,
  },
  socialButtonPressed: {
    opacity: 0.6,
  },
});
