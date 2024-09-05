import { FC } from 'react';
import { Flex, Skeleton, Text } from '@mantine/core';

interface ItemProps {
  title: string;
  token: string;
  value: number;
  loading: boolean;
}

export const InfoItem: FC<ItemProps> = ({ title, value, token, loading }) => {
  return (
    <Flex mb={10} justify="space-between">
      <Text
        sx={{
          textTransform: 'uppercase',
          fontWeight: 700,
          fontFamily: 'Inter',
        }}
      >
        {title}:
      </Text>
      {!loading ? (
        <Text
          sx={{
            textAlign: 'right',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: 'Inter',
          }}
        >
          {`${value} ${token}`}
        </Text>
      ) : (
        <Skeleton height={24} width={120} mt={6} radius="sm" />
      )}
    </Flex>
  );
};
