// result 1
import result_alrp from "@/public/results/1/alrp.png"
import result_aloglrp from "@/public/results/1/aloglrp.png"
import result_a from "@/public/results/1/a.png"
import result_blrp from "@/public/results/1/blrp.png"
import result_bloglrp from "@/public/results/1/bloglrp.png"
import result_b from "@/public/results/1/b.png"

// result 2
import result_alrp2 from "@/public/results/2/result_a_lrp.png"
import result_aloglrp2 from "@/public/results/2/result_a_log_lrp.png"
import result_a2 from "@/public/results/2/result_a.png"
import result_blrp2 from "@/public/results/2/result_b_lrp.png"
import result_bloglrp2 from "@/public/results/2/result_b_log_lrp.png"
import result_b2 from "@/public/results/2/result_b.png"

// result 3
import result_alrp3 from "@/public/results/3/result_a_lrp.png"
import result_aloglrp3 from "@/public/results/3/result_a_log_lrp.png"
import result_a3 from "@/public/results/3/result_a.png"
import result_blrp3 from "@/public/results/3/result_b_lrp.png"
import result_bloglrp3 from "@/public/results/3/result_b_log_lrp.png"
import result_b3 from "@/public/results/3/result_b.png"

// result 4
import result_alrp4 from "@/public/results/4/result_a_lrp.png"
import result_aloglrp4 from "@/public/results/4/result_a_log_lrp.png"
import result_a4 from "@/public/results/4/result_a.png"
import result_blrp4 from "@/public/results/4/result_b_lrp.png"
import result_bloglrp4 from "@/public/results/4/result_b_log_lrp.png"
import result_b4 from "@/public/results/4/result_b.png"

// result 5
import result_alrp5 from "@/public/results/5/result_a_lrp.png"
import result_aloglrp5 from "@/public/results/5/result_a_log_lrp.png"
import result_a5 from "@/public/results/5/result_a.png"
import result_blrp5 from "@/public/results/5/result_b_lrp.png"
import result_bloglrp5 from "@/public/results/5/result_b_log_lrp.png"
import result_b5 from "@/public/results/5/result_b.png"

export enum GenerateState {
    PENDING,
    ERROR,
    SUCCESS
};

export type GenerateActionState = Readonly<{
    state: GenerateState;
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

export const comparisons: Comparison[] = [
    {
        seed: "2378983724324789",
        generation_a: {
            output: result_a,
            output_log_lrp: result_aloglrp,
            output_lrp: result_alrp,
            prompt: "An image of Thai models wearing futuristic Thai clotes, pink and gold tones, radiant light, by Andrey Yakavlev, standing in a forest setting, on a Photograph medium, with a Surreal, Photorealistic, Fantasy, Thai-Kadi",
            seed: "2378983724324789",
            options: {
                medium: ["Photograph"],
                genre: ["Surreal", "Photorealistic", "Fantasy"],
                physical_attributes: {
                    race: "Tai Kadi"
                }
            },
        },
        generation_b: {
            output: result_b,
            output_log_lrp: result_bloglrp,
            output_lrp: result_blrp,
            prompt: "An image of Thai models wearing futuristic Thai clotes, pink and gold tones, radiant light, by Andrey Yakavlev, standing in a desert setting, on a Photograph medium, with a Surreal, Photorealistic, Fantasy, Thai-Kadi",
            seed: "2378983724324789",
            options: {
                medium: ["Photograph"],
                genre: ["Surreal", "Photorealistic", "Fantasy"],
                physical_attributes: {
                    race: "Tai Kadi"
                }
            },
        }
    },
    //{                                                                                                                                          
    //  seed: 'tneyriasntoeiarsnoy',                                                                                                                                                                                                                                                         
    //  options: {                            
    //    medium: [ 'Photograph' ],                                                                                                                                                                                                                                                          
    //    genre: [ 'Surreal', 'Fantasy' ],                                                                                                       
    //    physical_attributes: { age: 2 },       
    //    mood: [ 'Sci-Fi' ],                                                                                                                    
    //    technique: [ 'Pincusion Lens' ],                                                                                                       
    //    lighting: [ 'Unreal Engine' ],                                                                                                         
    //    resolution: [ 'Blender' ]                                                                                                              
    //  },                                                                                                                                       
    //  prompt: 'A photo of a dachshund dog'                                                                                                     
    //}         
    {
        seed: "139619310252288045",
        generation_a: {
            output: result_a2,
            output_log_lrp: result_aloglrp2,
            output_lrp: result_alrp2,
            prompt: "A photo of a dachshund dog",
            seed: "139619310252288045",
            options: {
                medium: ["Photograph"],
                genre: ['Surreal', 'Fantasy', "Sci-Fi"],
                physical_attributes: { age: 2 },
                technique: ['Pincushion Lens', "Unreal Engine", "Blender"],
            },
        },
        generation_b: {
            output: result_b2,
            output_log_lrp: result_bloglrp2,
            output_lrp: result_blrp2,
            prompt: "A photo of a bull dog",
            seed: "139619310252288045",
            options: {
                medium: ["Photograph"],
                genre: ['Surreal', 'Fantasy', "Sci-Fi"],
                physical_attributes: { age: 2 },
                technique: ['Pincushion Lens', "Unreal Engine", "Blender"],
            },
        }
    },
    {
        seed: "8923489238942389239",
        generation_a: {
            output: result_a3,
            output_log_lrp: result_aloglrp3,
            output_lrp: result_alrp3,
            prompt: "A cat sitting on a window sill",
            seed: "139619310252288045",
            options: {
                medium: ['Photograph'],
                genre: ['Black & White', 'Photorealistic'],
                physical_attributes: { age: 2 },
                mood: ['Calm'],
                technique: ['Pincushion Lens'],
                lighting: ['Realistic Shaded Lighting'],
                resolution: ['100 mm']
            },
        },
        generation_b: {
            output: result_b3,
            output_log_lrp: result_bloglrp3,
            output_lrp: result_blrp3,
            prompt: "A dog sitting on a window sill",
            seed: "139619310252288045",
            options: {
                medium: ['Photograph'],
                genre: ['Black & White', 'Photorealistic'],
                physical_attributes: { age: 2 },
                mood: ['Calm'],
                technique: ['Pincushion Lens'],
                lighting: ['Realistic Shaded Lighting'],
                resolution: ['100 mm']
            },
        },
    },
    {
        seed: "7423874892379432",
        generation_a: {
            output: result_a4,
            output_log_lrp: result_aloglrp4,
            output_lrp: result_alrp4,
            prompt: "A green goblin with sharp teeth",
            seed: "139619310252288045",
            options: {
                medium: ['3D Render'],
                genre: ['Photorealistic', 'Fantasy'],
                mood: ['Ugly'],
                technique: ['Blender', 'Unreal Engine'],
                lighting: ['Cinematic Lighting', 'Dark'],
                resolution: ['100 mm', 'Sharp Focus', '8K']
            },
        },
        generation_b: {
            output: result_b4,
            output_log_lrp: result_bloglrp4,
            output_lrp: result_blrp4,
            prompt: "A red goblin with sharp teeth",
            seed: "139619310252288045",
            options: {
                medium: ['3D Render'],
                genre: ['Photorealistic', 'Fantasy'],
                mood: ['Ugly'],
                technique: ['Blender', 'Unreal Engine'],
                lighting: ['Cinematic Lighting', 'Dark'],
                resolution: ['100 mm', 'Sharp Focus', '8K']
            },
        },
    },
    {
        seed: "139619310252288a42342345",
        generation_a: {
            output: result_a5,
            output_log_lrp: result_aloglrp5,
            output_lrp: result_alrp5,
            prompt: "A butterfly in a forest",
            seed: "139619310252288045",
            options: {
                medium: ['Photograph'],
                genre: ['Film Noir', 'Surreal'],
                mood: ['Beautiful'],
                technique: ['Pincushion Lens'],
                lighting: ['Cinematic Lighting'],
                resolution: ['Highly-Detailed', '100 mm', 'Sharp Focus', '16K']
            },
        },
        generation_b: {
            output: result_b5,
            output_log_lrp: result_bloglrp5,
            output_lrp: result_blrp5,
            prompt: "A butterfly in a desert",
            seed: "139619310252288045",
            options: {
                medium: ['Photograph'],
                genre: ['Film Noir', 'Surreal'],
                mood: ['Beautiful'],
                technique: ['Pincushion Lens'],
                lighting: ['Cinematic Lighting'],
                resolution: ['Highly-Detailed', '100 mm', 'Sharp Focus', '16K']
            },
        },
    }
]

export type Generation = {
    seed: string;
    output: any;
    output_log_lrp: any;
    output_lrp: any;
    prompt: string;
    options: {
        medium?: Medium[];
        genre?: Genre[];
        physical_attributes?: PhysicalAttribute;
        mood?: Mood[];
        technique?: Technique[];
        lighting?: Lighting[];
        resolution?: Resolution[];
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
