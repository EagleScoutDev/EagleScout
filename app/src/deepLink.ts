import { useNavigation } from "@react-navigation/native";
import { supabase } from "./lib/supabase";

export async function handleDeepLink({ url }: { url: string | null }) {
    if(url === null) return

    const nav = useNavigation()

    const route = url.split("://")[1].split("#")[0];
    const params = Object.fromEntries(url.split("#")[1].split("&").map(kv => kv.split("=")));

    switch(route) {
        case "forgot-password": {
            // for the Reset Password email template
            const {access_token, refresh_token} = params;
            if (!access_token || !refresh_token) return;

            const {error} = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });
            if (error) console.error(error);

            console.log("navigating to set new password");
            nav.navigate("App", {
                screen: "Accounts",
                params: { screen: "SetNewPassword" }
            });
            break
        }

        case "confirm-signup": {
            // for the Confirm Signup email template
            const {access_token, refresh_token} = params;
            if (!access_token || !refresh_token) return;

            const {error} = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });
            if (error) console.error(error);

            console.log("navigating to complete sign up");
            nav.navigate("App", {
                screen: "Accounts",
                params: { screen: "EnterUserInfo" }
            });
            break
        }
    }
}
