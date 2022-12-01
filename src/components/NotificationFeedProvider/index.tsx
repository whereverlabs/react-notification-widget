import React, { PropsWithChildren, useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import { ThemeProvider } from 'styled-components';
import { providers } from 'ethers';
import { CustomTheme, makeTheme } from '../../theme';
import useWagmiClient from './useWagmiClient';
import { Reset } from 'theme/ResetCss';
import { RouterProvider } from 'context/RouterContext';
import { NotificationsProvider, useNotificationsContext } from 'context/NotificationsContext';
import { ChannelProvider } from 'context/ChannelContext';
import { ApolloProvider } from 'components/ApolloProvider';
import { EnvironmentProvider } from 'context/EnvironmentContext';
import analytics from 'services/analytics';
import { AuthProvider } from 'context/AuthContext';
import useDiscordActions from 'screens/settings/channels/discord/useDiscordActions';

export type ExternalProvider =
  | providers.BaseProvider
  | providers.ExternalProvider
  | providers.JsonRpcFetchFunc;

export type RpcUrls = { ethereum: string };

export type NotificationFeedProviderProps = PropsWithChildren<{
  partnerKey: string;
  discordToken?: string;
  provider?: ExternalProvider;
  theme?: CustomTheme;
  disableAnalytics?: boolean;
  mode?: 'default' | 'subscribeOnly';
  isOpen?: boolean;
}>;

const NotificationFeedProvider = ({
  partnerKey,
  discordToken,
  provider,
  theme,
  children,
  disableAnalytics,
  isOpen,
  mode,
}: NotificationFeedProviderProps) => {
  const wagmiClient = useWagmiClient(provider);

  useEffect(() => {
    if (!disableAnalytics) {
      analytics.initialize();
    }
  }, [disableAnalytics]);

  return (
    <EnvironmentProvider mode={mode}>
      <ThemeProvider theme={makeTheme(theme)}>
        <WagmiConfig client={wagmiClient}>
          <ApolloProvider>
            <ChannelProvider partnerKey={partnerKey}>
              <NotificationsProvider isOpen={isOpen}>
                <Reset />
                <RouterProvider>
                  <AuthProvider discordToken={discordToken}>{children}</AuthProvider>
                </RouterProvider>
              </NotificationsProvider>
            </ChannelProvider>
          </ApolloProvider>
        </WagmiConfig>
      </ThemeProvider>
    </EnvironmentProvider>
  );
};

export default NotificationFeedProvider;
