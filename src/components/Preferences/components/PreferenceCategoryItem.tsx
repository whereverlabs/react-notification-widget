import React from 'react';
import styled from 'styled-components';
import { PREFERENCES_WIDTH } from '../consts';
import { MessagingAppConfig } from '../index';
import useUpdatePreference from '../useUpdatePreference';
import analytics from '../../../services/analytics';
import { Web2ChannelLower } from 'context/UserContext/const';
import { GetUserQuery } from 'context/UserContext/operations.generated';
import { PartnerInfoQuery } from 'context/ChannelContext/operations.generated';
import Flex from 'components/layout/Flex';
import Text from 'components/Text';
import Switch from 'components/Switch';
import PreferenceBell from 'components/Preferences/components/PreferenceBell';

type PropsT = {
  userPref?: GetUserQuery['user']['preferences'][0];
  category: PartnerInfoQuery['partnerInfo']['messageCategories'][0];
  hideDescriptions?: boolean;
  hideToggles?: boolean;
  appConfig: MessagingAppConfig[];
};

const CategoryContainer = styled(Flex)`
  width: 100%;
  display: flex;
  height: 36px;
  align-items: center;
  ${Text} {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TitleContainer = styled(Flex)<{ grow: boolean }>`
  flex-direction: column;
  ${({ grow }) => ({ flexGrow: grow ? 1 : undefined, width: !grow ? 105 : undefined })}
`;

const PreferenceCategoryItem = ({
  hideDescriptions,
  hideToggles,
  userPref,
  category,
  appConfig,
}: PropsT) => {
  const updatePreference = useUpdatePreference();

  const handlePrefClick = (pref: Web2ChannelLower | 'enabled') => {
    updatePreference(category.id, pref, userPref);

    const analyticsData = { category: category.name, categoryId: category.id };
    pref === 'enabled'
      ? analytics.track('preference toggled', {
          ...analyticsData,
          newState: userPref?.enabled ? 'disabled' : 'enabled',
        })
      : analytics.track('preference destination updated', {
          ...analyticsData,
          app: pref,
          enabled: !userPref?.[pref],
        });
  };

  const prefEnabled = !!userPref?.enabled;
  const noApps = !appConfig.length;

  return (
    <Flex alignItems={'center'} width={'100%'} mb={1}>
      <CategoryContainer justifyContent={!appConfig.length ? 'space-between' : undefined}>
        <TitleContainer grow={noApps}>
          <Text size={'sm'}>{category.name}</Text>
          {!hideDescriptions && (
            <Text size={'sm'} color={'secondary'}>
              {category.description}
            </Text>
          )}
        </TitleContainer>

        {!hideToggles && (
          <Flex width={32} alignItems={'center'} pl={1} pr={1}>
            <Switch checked={prefEnabled} onChange={() => handlePrefClick('enabled')} />
          </Flex>
        )}
      </CategoryContainer>

      {prefEnabled && !noApps && (
        <Flex width={PREFERENCES_WIDTH} gap={1} justifyContent={'end'}>
          {appConfig.map(({ app, enabled }) => (
            <Flex
              key={`${app}${category.id}`}
              width={PREFERENCES_WIDTH / 3}
              justifyContent={'center'}
            >
              <PreferenceBell
                disabled={!enabled}
                selected={userPref?.[app.toLowerCase() as Web2ChannelLower] || false}
                onClick={() => handlePrefClick(app.toLowerCase() as Web2ChannelLower)}
              />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default PreferenceCategoryItem;
