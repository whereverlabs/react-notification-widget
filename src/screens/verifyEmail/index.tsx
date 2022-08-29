import React, { useState } from 'react';
import styled from 'styled-components';
import Button from 'components/Button';
import Text from 'components/Text';
import { Bell } from 'components/icons';
import Flex from 'components/layout/Flex';
import EnterVerificationCode from 'screens/verifyEmail/components/EnterVerificationCode';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NextButton = styled(Button)`
  height: 27px;
  width: 44px;
  font-size: 12px;
  padding: 0;
  border-radius: ${({ theme }) => theme.borderRadius.xs};
`;

const HeaderIconContainer = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)}px;
`;

const HeaderIcon = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.primary.dark};
`;

export const VerifyEmail = () => {
  const [code, setCode] = useState('');

  return (
    <Container>
      <Flex justifyContent={'end'} width={'100%'}>
        <NextButton variant={'gray'}>Skip</NextButton>
      </Flex>
      <Flex justifyContent={'center'} alignItems={'center'} direction={'column'} mb={2}>
        <HeaderIconContainer>
          <HeaderIcon>
            <Bell />
          </HeaderIcon>
        </HeaderIconContainer>
        <Text size={'xl'} weight={700} mb={0.5}>
          Enter verification code
        </Text>
        <Text size={'md'} align={'center'}>
          Sent to jhon.doe@gmail.com
        </Text>
      </Flex>
      <EnterVerificationCode onChange={setCode} />
    </Container>
  );
};
