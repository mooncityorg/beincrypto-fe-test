'use client';
import React, { useEffect, useState } from 'react';
import { Paper, Text } from '@mantine/core';
import { useContract } from '../../contexts/ContracContext';
import { usePublicClient } from 'wagmi';
import { ethers } from 'ethers';
import { RPC_URL } from '../../config';

interface CountdownTimerProps {
  targetTime: number;
}

const formatTimeSegment = (segment: number): string => {
  return segment < 10 ? `0${segment}` : `${segment}`;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTime }) => {
  const publicClient = usePublicClient();

  const [remainingTime, setRemainingTime] = useState<number>(0);
  const { STAGE_BLOCKS_DURATION, currentStageBlockStart } = useContract();
  const STAGE_BLOCKS_DURATIONx2 = STAGE_BLOCKS_DURATION * 2;

  const getBlockInfo = async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    let nowTimestamp = 1692287616000;
    if (currentStageBlockStart && currentStageBlockStart !== 0) {
      const blockInfo = await provider.getBlock(currentStageBlockStart);
      await publicClient
        .getBlock()
        .then((data) => {
          if (data) {
            nowTimestamp = Number(data.timestamp);
          }
        })
        .catch((error) => console.log(error));
      if (blockInfo) {
        const remain = blockInfo.timestamp + STAGE_BLOCKS_DURATIONx2 - nowTimestamp;
        setRemainingTime(remain);
      }
    }
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getBlockInfo();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentStageBlockStart]);

  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = Math.floor((remainingTime % 60) / 1);
  const isReady = hours !== 0 && minutes !== 0 && seconds !== 0;

  const formattedTimeSegments = [
    { value: hours, label: 'H' },
    { value: minutes, label: 'M' },
    { value: seconds, label: 'S' },
  ];

  return (
    <Paper>
      <Text
        align="center"
        sx={{ fontSize: 60, fontWeight: 700, fontFamily: 'Inter', lineHeight: 1 }}
      >
        {formattedTimeSegments.map(({ value, label }) => (
          <React.Fragment key={label}>
            {isReady ? formatTimeSegment(value) : '--'}
            <Text component="span" size="md">
              {label}
            </Text>
          </React.Fragment>
        ))}
      </Text>
    </Paper>
  );
};

export default CountdownTimer;
