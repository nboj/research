import Compare from "./_components/Compare";
import { comparisons } from "../types";

export const dynamic = "force-dynamic"

type ComparisonPageProps = Readonly<{
    params: Promise<{ comparison_seed: string }>
}>
export default async function ComparisonPage({ params }: ComparisonPageProps) {
    const seed = (await params).comparison_seed;
    const comparison = comparisons.find(v => v.seed == seed);
    if (comparison) {
        return (
            <Compare comparison={comparison} />
        )
    } else {
        return (
            <h1>Could not find comparison result for seed: {seed}</h1>
        );
    }

}
