import { getAddress } from "viem";
import { publicClient } from "./blockchain";

export async function getName(_address: string): Promise<string> {
  const address = getAddress(_address);
  const ensName = await publicClient.getEnsName({
    address: address,
  });

  if (!ensName) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return ensName;
}

export async function getAvatar(_address: string): Promise<string | null> {
  const address = getAddress(_address);
  const name = await publicClient.getEnsName({ address });

  if (!name) {
    return null;
  }

  const ensAvatar = await publicClient.getEnsAvatar({ name });

  return ensAvatar;
}

export async function AccountName({ address }: { address: string }) {
  return await getName(address);
}

export async function Avatar({ address }: { address: string }) {
  const name = await getName(address);
  const avatar = await getAvatar(address);

  return avatar ? (
    // ? <Image unoptimized src={avatar} alt={name} height={64} width={64} />
    <img src={avatar} alt={name} height="64px" width="64px" />
  ) : (
    <div className=" h-full w-full bg-green-500" />
  );
}
