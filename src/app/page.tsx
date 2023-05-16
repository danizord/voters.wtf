import { getRounds } from "src/propHouse";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/ui/card";

export default async function HomePage() {
  const rounds = await getRounds();

  return (
    <div className="container pt-4">
      <ul className="space-y-4">
        {rounds.map((round) => {
          return (
            <li key={round.id}>
              <a href={round.url}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {round.title}
                    </CardTitle>
                    <CardDescription>
                      {round.house.name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p>
                      {round.fundingAmount} {round.currencyType} x {round.numWinners}
                    </p>
                  </CardContent>
                </Card>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
