import { useState } from 'react';
import { Container, Flex, Input, Paper, Text, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import CountdownTimer from '../components/Countdown/CountdownTimer';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContract } from '../contexts/ContracContext';
import { InfoItem } from '../components/TokenInfo/InfoItem';
import { useContractWrite, useAccount } from 'wagmi';
import { PRESALE_ABI, PRESALE_ADDRESS } from '../config';
import { parseEther } from 'viem';

export default function HomePage() {
  const {
    symbol,
    currentStageMaxAmount,
    isFetching,
    currentStagePrice,
    currentStageSoldAmount,
    refetch,
  } = useContract();

  const [amount, setAmount] = useState(0);
  const { isConnected } = useAccount();

  const tokenSale = useContractWrite({
    address: PRESALE_ADDRESS,
    abi: PRESALE_ABI as any,
    functionName: 'tokenSale',
    onError(error) {
      console.log('Write Error:', error);
    },
    onSettled() {
      showNotification({
        title: 'Success',
        message: `Purchased amount: ${amount}`,
        color: 'teal',
      });
      refetch();
    },
  });

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value as unknown as number);
  };

  const handlePurchase = async () => {
    try {
      if (typeof amount === 'number' && amount > 0) {
        console.log("amount * 10 ** 18 + 'n'", amount * 10 ** 18 + 'n');
        tokenSale.write({
          args: [BigInt(amount * 10 ** 18)],
          value: parseEther((currentStagePrice * amount).toString()),
        });
      } else {
        showNotification({
          title: 'Error',
          message: 'Please enter a valid amount',
          color: 'red',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const amountButtons = [
    { amount: 1000, label: '1000' },
    { amount: 2000, label: '2000' },
    { amount: 5000, label: '5000' },
    { amount: 10000, label: '10K' },
    { amount: 50000, label: '50K' },
  ];

  return (
    <>
      <ColorSchemeToggle />
      <Flex align="center" justify="center" my={20}>
        <ConnectButton />
      </Flex>
      <Container pt={40}>
        <Flex align="center" justify="center">
          <Flex align="center" gap={10} sx={{ flexDirection: 'column' }}>
            <Text size="md" weight={700}>
              TO NEXT SALES
            </Text>

            <CountdownTimer targetTime={new Date('2023-8-15').getTime()} />
          </Flex>
        </Flex>
        <Paper sx={{ maxWidth: 500 }} mx="auto" mt={40}>
          <InfoItem
            title="token price"
            value={currentStagePrice}
            loading={isFetching}
            token="MATIC"
          />
          {isConnected ? (
            <>
              <InfoItem
                title="purchased amount"
                value={currentStageSoldAmount}
                loading={isFetching}
                token={symbol}
              />
              <InfoItem
                title="remaining amount"
                value={currentStageMaxAmount - currentStageSoldAmount}
                loading={isFetching}
                token={symbol}
              />
              <Flex sx={{ width: '100%' }} gap={10}>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  size="md"
                  h={42}
                  value={amount}
                  disabled={tokenSale.isLoading}
                  max={currentStageMaxAmount - currentStageSoldAmount}
                  onChange={handleAmountChange}
                  styles={(theme: any) => ({
                    input: {
                      textAlign: 'right',
                      fontSize: 16,
                      fontFamily: 'Inter',
                      fontWeight: 700,
                    },
                  })}
                  sx={{
                    textAlign: 'right',
                    width: 'calc(100% - 140px)',
                  }}
                  type="number"
                />
                <Flex gap="sm" w={140}>
                  <Button
                    w="50%"
                    onClick={() => setAmount((prev) => prev / 2)}
                    h={42}
                    px={0}
                    disabled={tokenSale.isLoading}
                  >
                    1/2
                  </Button>
                  <Button
                    w="50%"
                    px={0}
                    onClick={() => setAmount((prev) => prev * 2)}
                    h={42}
                    disabled={tokenSale.isLoading}
                  >
                    2x
                  </Button>
                </Flex>
              </Flex>
              <Flex my={10} gap="sm">
                {amountButtons.map((item, key) => (
                  <Button
                    w="20%"
                    onClick={() => setAmount(item.amount)}
                    disabled={tokenSale.isLoading}
                    px={0}
                  >
                    {item.label}
                  </Button>
                ))}
              </Flex>
              <Flex align="center" justify="center" direction="column">
                {amount > 0 && (
                  <Text my="sm" weight={700} size="sm">
                    You will pay {currentStagePrice * amount} MATIC
                  </Text>
                )}
                <Button
                  uppercase
                  gradient={{ from: '#8d1de2', to: '#2f819e' }}
                  variant="gradient"
                  size="md"
                  loading={tokenSale.isLoading}
                  mt={20}
                  sx={{
                    width: 200,
                  }}
                  onClick={handlePurchase}
                >
                  purchase
                </Button>
              </Flex>
            </>
          ) : (
            <Paper withBorder mt={40}>
              <Text align="center" weight={600} my={20}>
                Please connect wallet
              </Text>
            </Paper>
          )}
        </Paper>
      </Container>
    </>
  );
}
