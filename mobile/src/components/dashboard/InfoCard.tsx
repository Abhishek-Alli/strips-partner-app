/**
 * Info Card Component
 * 
 * Platform-aware card component following Material Design and HIG
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme';
import { spacing, typography } from '../../theme';

export interface InfoCardProps {
  title: string;
  content: string | React.ReactNode;
  onPress?: () => void;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;
  style?: any;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  onPress,
  subtitle,
  value,
  icon,
  style,
}) => {
  const theme = useTheme();

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        Platform.OS === 'android' && styles.androidCard,
        Platform.OS === 'ios' && styles.iosCard,
        style,
      ]}
    >
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text.primary },
            typography.styles.h3,
          ]}
        >
          {title}
        </Text>
        
        {value !== undefined && (
          <Text
            style={[
              styles.value,
              { color: theme.colors.primary },
              typography.styles.h2,
            ]}
          >
            {value}
          </Text>
        )}
        
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.text.secondary },
              typography.styles.caption,
            ]}
          >
            {subtitle}
          </Text>
        )}
        
        {typeof content === 'string' ? (
          <Text
            style={[
              styles.contentText,
              { color: theme.colors.text.secondary },
              typography.styles.body,
            ]}
          >
            {content}
          </Text>
        ) : (
          <View style={styles.contentView}>{content}</View>
        )}
      </View>
    </View>
  );

  if (!onPress) {
    return cardContent;
  }

  // Android: Use ripple effect
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          theme.colors.overlay,
          false
        )}
      >
        {cardContent}
      </TouchableNativeFeedback>
    );
  }

  // iOS: Use opacity feedback
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {cardContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  androidCard: {
    elevation: 2,
  },
  iosCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: spacing.xs,
  },
  value: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  contentText: {
    marginTop: spacing.xs,
  },
  contentView: {
    marginTop: spacing.xs,
  },
});
