import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import analytics from '../../services/analytics';
import Spinner from 'components/Spinner';
import { Screen } from 'components/layout/Screen';
import Button from 'components/Button';
import Text from 'components/Text';
import { Bell } from 'components/icons';
import Flex from 'components/layout/Flex';
import EmailHiddenNotice from 'screens/settings/components/EmailHiddenNotice';
import EmailInput from 'screens/settings/components/EmailInput';
import isEmailValid from 'helpers/functions/isEmailValid';
import { Routes, useRouterContext } from 'context/RouterContext';
import {
  useDeleteUserEmailMutation,
  useGetTelegramVerificationLinkMutation,
  useSaveUserEmailMutation,
} from 'screens/settings/operations.generated';
import { useNotificationsContext } from 'context/NotificationsContext';
import { useUserContext } from 'context/UserContext';

const EmailHiddenContainer = styled(Flex)`
  align-self: start;
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

export const Settings = () => {
  const { telegramId, telegramUsername, handleGetUserInfo } = useUserContext();
  const { setRoute, activeRoute, unsubscribe, login, isLoggedIn } = useRouterContext();
  const { refetchCommsChannel } = useNotificationsContext();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [telegramUrl, setTelegramUrl] = useState('');
  console.log(telegramId, telegramUsername, 'telegramUrl');
  const [getTelegramLink, { loading: telegramLoading }] = useGetTelegramVerificationLinkMutation();
  const [saveEmail, { loading }] = useSaveUserEmailMutation({
    variables: {
      input: { email },
    },
  });
  //
  // useEffect(() => {
  //   handleGetUserInfo();
  // }, []);

  const [deleteEmail, { loading: deleteLoading }] = useDeleteUserEmailMutation();

  const handleSave = async () => {
    if (isLoggedIn) {
      await saveEmail();

      analytics.track('email saved');

      return setRoute(Routes.EmailVerify, { email });
    }

    login(async () => {
      await saveEmail();

      analytics.track('email saved');

      setRoute(Routes.EmailVerify, { email });
    });
  };

  const handleRemove = async () => {
    const removeEmail = async () => {
      const response = await deleteEmail();

      if (response?.data?.userEmailDelete?.success) {
        await refetchCommsChannel();

        analytics.track('email deleted');

        return setRoute(Routes.Settings);
      }
    };

    if (isLoggedIn) {
      removeEmail();
    } else {
      login(async () => {
        removeEmail();
      });
    }
  };

  const handleGetTelegramLink = async () => {
    if (isLoggedIn) {
      const response = await getTelegramLink();
      console.log(
        response?.data?.telegramVerificationLink?.link || '',
        'response?.data?.telegramVerificationLink?.link'
      );
      setTelegramUrl(response?.data?.telegramVerificationLink?.link || '');
    } else {
      login(async () => {
        const response = await getTelegramLink();
        console.log(
          response?.data?.telegramVerificationLink?.link || '',
          'response?.data?.telegramVerificationLink?.link'
        );
        setTelegramUrl(response?.data?.telegramVerificationLink?.link || '');
      });
    }
  };

  const handleConnectTelegram = async () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSkip = () => {
    setRoute(Routes.NotificationsFeed);
  };

  return (
    <Screen
      navbarActionComponent={
        <Button
          variant={'gray'}
          width={'44px'}
          height={'27px'}
          fontSize={'sm'}
          p={0}
          borderRadius={'sm'}
          onClick={handleSkip}
        >
          {activeRoute === Routes.Settings ? 'Back' : 'Skip'}
        </Button>
      }
    >
      <Flex justifyContent={'center'} alignItems={'center'} direction={'column'} mb={2}>
        <HeaderIconContainer>
          <HeaderIcon>
            <Bell color={theme.colors.button.text} />
          </HeaderIcon>
        </HeaderIconContainer>
        <Text size={'xl'} weight={700} mb={0.5}>
          Connect your email
        </Text>
        <Text size={'md'} align={'center'}>
          Get alerts when new messages are received in your wallet.
        </Text>
      </Flex>
      <EmailInput
        onChange={setEmail}
        value={email}
        isValid={isEmailValid(email)}
        isLoading={loading || deleteLoading}
        handleSave={handleSave}
        handleRemove={handleRemove}
      />
      <EmailHiddenContainer>
        <EmailHiddenNotice />
      </EmailHiddenContainer>
      {process.env.WHEREVER_ENV === 'development' && (
        <Flex width={'100%'} justifyContent={'center'}>
          <Button variant={'outlined'} onClick={unsubscribe} height={20} p={0} mb={2} width={90}>
            <Text size={'sm'}>Unsubscribe</Text>
          </Button>
        </Flex>
      )}
      {telegramUrl ? (
        <Button variant={'primary'} onClick={handleConnectTelegram} disabled={telegramLoading}>
          Connect Telegram
        </Button>
      ) : (
        <Button variant={'primary'} onClick={handleGetTelegramLink} disabled={telegramLoading}>
          Get Telegram Link
        </Button>
      )}
    </Screen>
  );
};
