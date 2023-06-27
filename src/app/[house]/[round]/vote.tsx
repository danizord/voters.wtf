'use client'

import { useSelectedVote } from "./timeline";

export const VoteView = () => {
  const vote = useSelectedVote();

  return <div>
    {vote}
  </div>
}