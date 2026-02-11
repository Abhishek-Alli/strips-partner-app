/**
 * Centralized Icon Component (Mobile)
 * 
 * Wraps Material Icons for React Native
 */

import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { iconMap, IconName } from '../../../shared/icons/iconMap';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

const iconNameMap: Record<string, string> = {
  DashboardOutlined: 'dashboard',
  HomeOutlined: 'home',
  PersonOutlined: 'person',
  NotificationsOutlined: 'notifications',
  SearchOutlined: 'search',
  SettingsOutlined: 'settings',
  AddOutlined: 'add',
  EditOutlined: 'edit',
  DeleteOutlined: 'delete',
  SaveOutlined: 'save',
  CancelOutlined: 'cancel',
  CloseOutlined: 'close',
  CheckOutlined: 'check',
  SendOutlined: 'send',
  ReplyOutlined: 'reply',
  VisibilityOutlined: 'visibility',
  VisibilityOffOutlined: 'visibility-off',
  DownloadOutlined: 'download',
  UploadOutlined: 'upload',
  RefreshOutlined: 'refresh',
  FilterListOutlined: 'filter-list',
  SortOutlined: 'sort',
  MoreVertOutlined: 'more-vert',
  BusinessOutlined: 'business',
  StoreOutlined: 'store',
  InventoryOutlined: 'inventory',
  WorkOutlined: 'work',
  QuestionAnswerOutlined: 'question-answer',
  RateReviewOutlined: 'rate-review',
  LocalOfferOutlined: 'local-offer',
  EventOutlined: 'event',
  DescriptionOutlined: 'description',
  ConstructionOutlined: 'construction',
  ChecklistOutlined: 'checklist',
  VideoLibraryOutlined: 'video-library',
  ImageOutlined: 'image',
  LinkOutlined: 'link',
  CalculateOutlined: 'calculate',
  BarChartOutlined: 'bar-chart',
  AssessmentOutlined: 'assessment',
  VerifiedOutlined: 'verified',
  ScheduleOutlined: 'schedule',
  CheckCircleOutlined: 'check-circle',
  CancelOutlined: 'cancel',
  RadioButtonCheckedOutlined: 'radio-button-checked',
  RadioButtonUncheckedOutlined: 'radio-button-unchecked',
  ErrorOutlined: 'error',
  WarningOutlined: 'warning',
  InfoOutlined: 'info',
  MessageOutlined: 'message',
  EmailOutlined: 'email',
  PhoneOutlined: 'phone',
  ChatOutlined: 'chat',
  LocationOnOutlined: 'location-on',
  MapOutlined: 'map',
  NavigationOutlined: 'navigation',
  PeopleOutlined: 'people',
  AccountCircleOutlined: 'account-circle',
  LogoutOutlined: 'logout',
  LoginOutlined: 'login',
  PaymentOutlined: 'payment',
  ReceiptOutlined: 'receipt',
  AccountBalanceWalletOutlined: 'account-balance-wallet',
  BuildOutlined: 'build',
  StarOutlined: 'star',
  FavoriteOutlined: 'favorite',
  FavoriteBorderOutlined: 'favorite-border',
  BookmarkOutlined: 'bookmark',
  InboxOutlined: 'inbox',
  SearchOffOutlined: 'search-off',
  DataObjectOutlined: 'data-object',
  AdminPanelSettingsOutlined: 'admin-panel-settings',
  SecurityOutlined: 'security',
  AnalyticsOutlined: 'analytics',
  ArticleOutlined: 'article',
  GavelOutlined: 'gavel',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color,
  ...props
}) => {
  const iconName = iconMap[name];
  const materialIconName = iconNameMap[iconName] || iconName.toLowerCase().replace('Outlined', '');

  return (
    <MaterialIcons
      name={materialIconName as any}
      size={size}
      color={color}
      {...props}
    />
  );
};






