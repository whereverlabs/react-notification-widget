import React from 'react';
import Text from 'components/Text';
import Flex from 'components/layout/Flex';
import NewTag from 'components/NewTag';

const ConnectHeader = () => {
  return (
    <Flex alignItems={'center'} direction={'column'} mb={4}>
      <Flex mb={1}>
        <NewTag />
      </Flex>
      <Text size={'xl'} weight={700} align={'center'}>
        Wallet-to-wallet notifications
      </Text>
    </Flex>
  );
};

export default ConnectHeader;