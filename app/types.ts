export enum GenerateState {
    PENDING,
    ERROR,
    SUCCESS
};

export type GenerateActionState = Readonly<{
    state: GenerateState;
    data?: {tokens: string[], images: string[]};
    prompt?: string;
}>


export type Comparison = {
    id?: string;
    seed: string;
    generation_a?: Generation;
    generation_b?: Generation;
}

export type Medium = "Digital Illustration" | "Photograph" | "3D Render" | "Concept Art" | "Poster";
export type Genre = "Anime" | "Surreal" | "Baroque" | "Photorealistic" | "Sci-Fi" | "Black & White" | "Fantasy" | "Film Noir";
export type Race = "Tai Kadi" | "Caucasion" | "African American" | "Asian" | "Hispanic" | "Korean";
export type PhysicalAttribute = {
    age?: number;
    race?: Race;
};
export type Mood = "Beautiful" | "Eerie" | "Bleak" | "Ugly" | "Calm";
export type Technique = "Blender" | "Pincushion Lens" | "Unreal Engine" | "Octane";
export type Lighting = "Cinematic Lighting" | "Dark" | "Realistic Shaded Lighting" | "Studio Lighting" | "Radiant Light";
export type Resolution = "Highly-Detailed" | "Photorealistic" | "100 mm" | "8K" | "16K" | "HQ" | "Sharp Focus";
export type Setting = "Desert" | "Forest" | "City" | "Suburban" | "Antarctica" | "Caribean" | "Mars";
export type angle = "Ultra Wide"| "Zenith View"| "Cinematic View"| "Close Up";

export type Generation = {
    id?: string;
    seed: string;
    output: any;
    output_log_lrp?: any;
    output_lrp: any;
    prompt: string;
    images: string[];
    tokens: string[];
    options: {
        medium?: Medium[];
        genre?: Genre[];
        physical_attributes?: PhysicalAttribute;
        mood?: Mood[];
        technique?: Technique[];
        lighting?: Lighting[];
        resolution?: Resolution[];
        setting?: Setting[];
        angle?: angle[];
    }
};
export type GenerationOld = {
    seed: string;
    output: any;
    output_log_lrp: any;
    output_lrp: any;
    prompt: string;
    options: {
        medium?: {
            digital_illustration?: boolean;
            photograph?: boolean;
            three_dimensional_render?: boolean;
            concept_art?: boolean;
            poster?: boolean;
        };
        genre?: {
            anime?: boolean;
            surreal?: boolean;
            baroque?: boolean;
            photorealistic?: boolean;
            sci_fi?: boolean;
            black_and_white?: boolean;
            fantasy?: boolean;
            film_noir?: boolean;
        };
        physical_attributes?: {
            race?: Race
            age?: number;
        };
        mood?: {
            beautiful?: boolean;
            eerie?: boolean;
            bleak?: boolean;
            ugly?: boolean;
            calm?: boolean;
        };
        technique?: {
            blender?: boolean;
            pincushion_lens?: boolean;
            unreal_engine?: boolean;
            octane?: boolean;
        };
        lighting?: {
            cinematic_lighting?: boolean;
            dark?: boolean;
            realistic_shaded_lighting?: boolean;
            studio_lighting?: boolean;
            radiant_light?: boolean;
        };
        resolution?: {
            highly_detailed?: boolean;
            photorealistic?: boolean;
            one_hundred_mm?: boolean;
            eight_k?: boolean;
            sixteen_k?: boolean;
            hq?: boolean;
            sharp_focus?: boolean;
        };
    }
};
