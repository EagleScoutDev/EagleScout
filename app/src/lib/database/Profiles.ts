import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/user/profile";

export class ProfilesDB {
    static async getProfile(id: string): Promise<Profile> {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", id);
        if (error) {
            throw error;
        } else {
            if (data.length === 0) {
                throw new Error("Profile not found");
            } else {
                return {
                    id: data[0].id,
                    name: data[0].name,
                    firstName: data[0].first_name,
                    lastName: data[0].last_name,
                    emoji: data[0].emoji,
                };
            }
        }
    }

    static async getAllProfiles(): Promise<Profile[]> {
        const { data, error } = await supabase.from("profiles").select("*");
        if (error) {
            throw error;
        } else {
            return data.map((profile) => {
                return {
                    id: profile.id,
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    name: profile.name,
                    emoji: profile.emoji,
                    scoutcoins: profile.scoutcoins,
                };
            });
        }
    }

    static async getCurrentUserProfile(): Promise<Profile> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user == null) {
            throw new Error("User not logged in");
        }
        return this.getProfile(user.id);
    }

    static async setName(firstName: string, lastName: string): Promise<void> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user == null) {
            throw new Error("User not logged in");
        }
        const { data, error } = await supabase
            .from("profiles")
            .update({
                first_name: firstName,
                last_name: lastName,
            })
            .eq("id", user.id);
        if (error) {
            throw error;
        }
    }
}
