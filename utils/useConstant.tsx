import { useBlockNumber } from 'wagmi';

export function getBlockNumber() {
  const { data, isLoading } = useBlockNumber();
  console.log(data, isLoading);
}
