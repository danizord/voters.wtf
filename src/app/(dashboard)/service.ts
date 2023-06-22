import * as propHouse from "src/propHouse";
import { slugify } from "src/propHouse";

export async function getRounds() {
  const houses = await propHouse.getCommunities();
  const housesById = houses.reduce((acc, house) => {
    acc[house.id] = house;
    return acc;
  }, {} as Record<number, (typeof houses)[0]>);

  const data = await propHouse.getRounds();

  // Add details
  const rounds = data.map((r) => ({
    ...r,
    house: housesById[r.community]!,
    url: `/${slugify(housesById[r.community]!.name)!}/${slugify(r.title)}`,
  }));

  // Sort by recently started voting
  return rounds.sort(
    (a, b) => b.proposalEndTime.getTime() - a.proposalEndTime.getTime()
  );
}
