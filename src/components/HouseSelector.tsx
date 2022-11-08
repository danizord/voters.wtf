import { Avatar, HStack, Tab, TabList, Tabs, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useHouse, useHouses } from "src/propHouse";

export const HouseSelector = () => {
  const houses = useHouses();
  const selectedHouse = useHouse();
  const voterSlug = useRouter().query["voterSlug"] as string | undefined;
  const index = houses.findIndex((h) => h.id === selectedHouse.id);

  return (
    <Tabs
      as={HStack}
      flexShrink={0}
      spacing={0}
      variant="solid-rounded"
      size="lg"
      index={index}
      p={4}
      colorScheme={useColorModeValue("pink", "purple")}
    >
      <TabList>
        {houses.map((house) => {
          const isDisabled = ![1, 2].includes(house.id);
          return (
            <Tooltip key={house.id} label={isDisabled ? "Coming soon..." : ""}>
              <Tab px={4} as={Link} isDisabled={isDisabled} href={`/${house.slug}${voterSlug ? `/${voterSlug}` : ""}`}>
                <Avatar src={house.profileImageUrl} ml={-1} mr={2} size="md" />
                {house.name}
              </Tab>
            </Tooltip>
          );
        })}
      </TabList>
    </Tabs>
  );
};
