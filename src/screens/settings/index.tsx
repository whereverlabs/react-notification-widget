import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Screen } from 'components/layout/Screen';
import Button from 'components/Button';
import Text from 'components/Text';
import { Bell } from 'components/icons';
import Flex from 'components/layout/Flex';
import HiddenNotice from 'screens/settings/components/HiddenNotice';
import { Routes, useRouterContext } from 'context/RouterContext';
import { useAuthContext } from 'context/AuthContext';
import { changeColorShade } from 'components/utils';
import { EmailChannel, TelegramChannel } from 'screens/settings/channels';

const Header = styled(Flex)`
  pointer-events: none;
`;

const HeaderIconContainer = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)}px;
`;

const HeaderIcon = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.primary.main};
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => changeColorShade(theme.colors.bg.main, 20)};
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
  width: 100%;
`;

export const Settings = () => {
  const { unsubscribe } = useAuthContext();
  const { setRoute, activeRoute, props } = useRouterContext();
  const theme = useTheme();

  const handleSkip = () => {
    setRoute(Routes.NotificationsFeed);
  };

  return (
    <Screen
      navbarActionComponent={
        <Button variant={'gray'} fontSize={'sm'} p={1} borderRadius={'sm'} onClick={handleSkip}>
          {activeRoute === Routes.Settings ? 'Back' : 'Skip'}
        </Button>
      }
    >
      <Header justifyContent={'center'} alignItems={'center'} direction={'column'} mb={2} mt={-4}>
        <HeaderIconContainer>
          <HeaderIcon>
            <Bell color={theme.colors.button.text} />
          </HeaderIcon>
        </HeaderIconContainer>
        <Text size={'xl'} weight={700} mb={1}>
          Set Up Notifications
        </Text>
        <Text size={'md'} weight={500} mb={0.5} align={'center'}>
          Choose one or more channels to receive alerts when new messages hit your wallet.
        </Text>
      </Header>
      <Flex gap={1} width={'100%'} direction={'column'} mb={2}>
        <EmailChannel />
        <TelegramChannel />
      </Flex>
      <Divider />
      <HiddenNotice />
      {process.env.WHEREVER_ENV === 'development' && (
        <Flex width={'100%'} justifyContent={'center'}>
          <Button variant={'outlined'} onClick={unsubscribe} height={20} p={0} mb={1} width={90}>
            <Text size={'sm'}>Unsubscribe</Text>
          </Button>
        </Flex>
      )}
    </Screen>
  );
};
