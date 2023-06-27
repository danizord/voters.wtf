import type { Meta, StoryObj } from "@storybook/react";
import { VotesCard } from "./VotesCard";

export default {
  component: VotesCard,
} satisfies Meta<typeof VotesCard>;

export const Default: StoryObj<typeof VotesCard> = {
  args: {},
};
