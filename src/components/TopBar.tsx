import { Divider, Heading, HStack, Image, Show, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useHouse } from "src/propHouse";
import { HouseSelector as HouseSelector2 } from "./HouseSelector2";
import { WalletButton } from "./WalletButton";

export function TopBar() {
  const house = useHouse();

  return (
    <Stack spacing={0}>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        py={4}
        pr={{ base: 0, md: 20 }}
        position={"relative"}
        align={{ base: "start", md: "center" }}
      >
        <HStack as={Link} href={`/${house.slug}`} spacing={1} flexShrink={"0"} ml={4}>
          <Image height={"16"} src={"https://prop.house/bulb.png"} alt="Prop House" />

          <Text fontSize={"lg"}>Prop House |</Text>
          <Heading fontSize={"lg"} fontWeight={700}>
            voters.wtf
          </Heading>
        </HStack>
        {/* <HouseSelector /> */}

        <HouseSelector2 />

        <Show above="md">
          <WalletButton />
        </Show>
      </Stack>

      <Divider />
    </Stack>
  );
}
