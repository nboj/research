export enum GenerateState {
    PENDING,
    ERROR,
    SUCCESS
}

export type GenerateActionState = Readonly<{
    state: GenerateState;
}>
