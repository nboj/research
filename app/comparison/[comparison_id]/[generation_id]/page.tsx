import { pool } from '@/app/_lib/db';
import { runWithAmplifyServerContext } from '@/app/_utils/amplifyServerUtils';
import { cookies } from 'next/headers';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import PromptSection from '../_components/PromptSelection';
import { Generation } from '@/app/types';

type GenerationPageProps = Readonly<{
    params: Promise<{ generation_id: string }>
}>
export default async function GenerationPage({ params }: GenerationPageProps) {
    const { generation_id } = await params;

    const user_id: any = await runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: async (contextSpec) => {
            try {
                const session = await fetchAuthSession(contextSpec);
                return session.tokens?.idToken?.payload.sub;
            } catch (e: any) {
                return null
            }
        }
    })
    if (!user_id) {
        return (
            <div className="flex w-full justify-between items-center">
                Error, no user id
            </div>
        )
    }
    const res = await pool.query(`
        SELECT * from generation
        WHERE id = $1
    `, [generation_id]);

    const generation: Generation = {
        ...res.rows[0],
        options: {
            ...res.rows[0]?.options
        }
    };
    return (
        <div className="flex h-full w-full gap-[1rem] relative m-auto">
            <div className="flex flex-col gap-[1rem] max-w-[800px] m-auto w-full justify-center items-center">
                <PromptSection id={generation.id as string} generation={generation} seed={generation.seed} />
            </div>
        </div>
    )
}
