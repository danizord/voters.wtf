import { Box, Divider, Show, Stack } from "@chakra-ui/react";
import { DarkModeSwitch } from "src/components/DarkModeSwitch";
import { TopBar } from "./TopBar";

import { MyProfile } from "./MyProfile";
import { TopVoters } from "./TopVoters";

export const Layout = ({ children }) => {
  return (
    <>
      <DarkModeSwitch />

      <Stack spacing={0} maxH="100vh">
        <TopBar />

        <Box display="flex" flex="1" overflowY={"scroll"}>
          <Show above={"lg"}>
            <Stack spacing={4} pt={0} maxH="full" overflowY={"hidden"} p={4} divider={<Divider />}>
              <MyProfile />

              <TopVoters />
            </Stack>
          </Show>

          <Box as="main" display="flex" flex="1" overflowY={"scroll"}>
            {children}
          </Box>
        </Box>
      </Stack>
    </>
  );
};
