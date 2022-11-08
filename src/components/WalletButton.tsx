import { Avatar, Button } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import { useEnsAvatar } from "wagmi";

export function WalletButton() {
  // Todo: check if it loads the connected wallet
  const avatar = useEnsAvatar();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, truncatedAddress }) => {
        return (
          <Button
            {...(isConnected ? { leftIcon: <Avatar size={"xs"} src={avatar.data} /> } : {})}
            colorScheme="purple"
            size={"md"}
            onClick={show}
            flexShrink={0}
            isLoading={isConnecting}
          >
            {isConnected ? ensName ?? truncatedAddress : "Connect"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
