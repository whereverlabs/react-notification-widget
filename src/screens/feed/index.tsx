import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { NotificationClickProp } from '../../components/types';
import { useUserContext } from '../../context/UserContext';
import Spinner from '../../components/Spinner';
import { useChannelContext } from '../../context/ChannelContext';
import { Notification } from '../../context/UserContext/types';
import NotificationFeedItem from './components/NotificationFeedItem';
import EmptyState from './components/EmptyState';
import { Screen } from 'components/layout/Screen';
import { Settings } from 'components/icons';
import Flex from 'components/layout/Flex';
import FeedNavigation, { NavigationTabs } from 'screens/feed/components/FeedNavigation';
import { Routes, useRouterContext } from 'context/RouterContext';

const NotificationFeed = styled(Flex)`
  ${({ theme }) => `@media (max-width: ${theme.w.breakpoints.mobile}px) {
    max-height: 100%;
  }`}
  &:not(:last-child) {
    border-bottom: ${({ theme }) => `1px solid ${theme.w.colors.border.main}}`};
  }
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100% + 18px);
  box-sizing: border-box;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SettingsIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  color: ${({ theme }) => theme.w.colors.gray[100]};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.w.colors.gray[200]};
  }
`;

export const Feed = ({ onNotificationClick }: NotificationClickProp) => {
  const { notifications: allNotifications, isLoading } = useUserContext();
  const { channelAddress } = useChannelContext();
  const { setRoute } = useRouterContext();
  const [activeTab, setActiveTab] = useState(NavigationTabs.App);

  const handleViewSettings = () => {
    setRoute(Routes.Settings);
  };

  const [channelNotifs, otherNotifs] = useMemo(() => {
    const channel: Notification[] = [];
    const other: Notification[] = [];

    allNotifications.forEach((notif) =>
      notif.appAddress.toLowerCase() === channelAddress.toLowerCase()
        ? channel.push(notif)
        : other.push(notif)
    );

    return [channel, other];
  }, [allNotifications]);

  const notificationsToShow = activeTab === NavigationTabs.App ? channelNotifs : otherNotifs;

  return (
    <Screen
      title={'Notifications'}
      navbarActionComponent={
        <SettingsIcon onClick={handleViewSettings}>
          <Settings />
        </SettingsIcon>
      }
    >
      {!!otherNotifs?.length && (
        <FeedNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <NotificationFeed width={'100%'} direction={'column'} gap={2}>
        <EmptyState show={!isLoading && !notificationsToShow?.length} />
        {isLoading ? (
          <Flex height={150} justifyContent={'center'} alignItems={'center'} pb={3}>
            <Spinner />
          </Flex>
        ) : (
          notificationsToShow.map((notification, index) => {
            return (
              <NotificationFeedItem
                onNotificationClick={onNotificationClick}
                key={index}
                notification={notification}
                showSenderDetails={activeTab === NavigationTabs.All}
              />
            );
          })
        )}
      </NotificationFeed>
    </Screen>
  );
};
