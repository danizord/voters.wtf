import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, IconButton, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { useHouse, useHouses } from "src/propHouse";

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <IconButton
      aria-label="left"
      icon={<ArrowBackIcon />}
      variant={"ghost"}
      colorScheme={"purple"}
      borderRadius={"full"}
      py={8}
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
    >
      Left
    </IconButton>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <IconButton
      aria-label="right"
      icon={<ArrowForwardIcon />}
      variant={"ghost"}
      colorScheme={"purple"}
      borderRadius={"full"}
      py={8}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      Right
    </IconButton>
  );
}

export const HouseSelector = () => {
  const accentColor = useColorModeValue("pink", "purple");
  const houses = useHouses();
  const selectedHouse = useHouse();
  const voterSlug = useRouter().query["voterSlug"] as string | undefined;

  // Todo: set default position
  // const index = houses.findIndex((h) => h.id === selectedHouse.id);

  return (
    <Box minW={0} maxW="100vw">
      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {houses.map((house) => {
          const isDisabled = ![1, 2].includes(house.id);
          const isActive = house.id === selectedHouse.id;
          return (
            <Tooltip key={house.id} label={isDisabled ? "Coming soon..." : ""}>
              <Button
                as={Link}
                href={isDisabled ? "#" : `/${house.slug}${voterSlug ? `/${voterSlug}` : ""}`}
                variant={isActive ? "solid" : "ghost"}
                colorScheme={isActive ? accentColor : "gray"}
                borderRadius={"full"}
                px={4}
                py={8}
                isDisabled={isDisabled}
              >
                <Avatar src={house.profileImageUrl} ml={-1} mr={2} size="md" loading="lazy" />
                {house.name}
              </Button>
            </Tooltip>
          );
        })}
      </ScrollMenu>
    </Box>
  );
};
