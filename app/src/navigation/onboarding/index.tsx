import { useEffect, useState } from "react";
import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useUserStore } from "@/lib/stores/user";
import type { RootStackParamList, RootStackScreenProps } from "@/navigation";

import { EntrypointHome } from "./EntrypointHome";
import { LoginForm } from "./Login";
import { ResetPassword } from "./ResetPassword";
import { SetNewPassword } from "./SetNewPassword";
import { Signup } from "./Signup";
import { EnterTeamEmail } from "./steps/EnterTeamEmail";
import { EnterUserInfo } from "./steps/EnterUserInfo";
import { SelectTeam } from "./steps/SelectTeam";
import { getFocusedRouteNameFromRoute, type RouteProp, useRoute } from "@react-navigation/core";

const Stack = createNativeStackNavigator<OnboardingParamList>();
export type OnboardingScreenProps<K extends keyof OnboardingParamList> = NativeStackScreenProps<
    OnboardingParamList,
    K
>;
export type OnboardingParamList = {
    Entrypoint: undefined;

    Login: undefined;
    ResetPassword: undefined;
    SetNewPassword: undefined;

    Signup: undefined;
    SelectTeam: undefined;
    EnterUserInfo: undefined;
    EnterTeamEmail: undefined;
};

export interface OnboardingFlowProps extends RootStackScreenProps<"Onboarding"> {}
export function OnboardingFlow({ navigation }: OnboardingFlowProps) {
    const [error, setError] = useState<string | null>(null);
    const route = useRoute<RouteProp<RootStackParamList>>();

    const login = useUserStore((state) => state.signInWithPassword);
    const account = useUserStore((state) => state.account);

    async function doLogin(username: string, password: string) {
        try {
            await login({ username, password });
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "An error occurred");
        }
    }

    useEffect(() => {
        const currentOnboardingScreen = getFocusedRouteNameFromRoute(route) ?? "Entrypoint";
        if (account === null) {
            if (currentOnboardingScreen !== "Entrypoint") {
                navigation.navigate("Onboarding", { screen: "Entrypoint" });
            }
        } else if (account.deleted) {
            setError("Your account has been marked for deletion.");
            if (currentOnboardingScreen !== "Entrypoint") {
                navigation.replace("Onboarding", { screen: "Entrypoint" });
            }
        } else if (!account.onboarded) {
            setError("");
            if (currentOnboardingScreen !== "EnterUserInfo") {
                navigation.navigate("Onboarding", { screen: "EnterUserInfo" });
            }
        } else if (!account.approved) {
            setError(
                "Your account has not been approved yet.\nPlease contact a admin for approval.",
            );
            if (currentOnboardingScreen !== "Entrypoint") {
                navigation.replace("Onboarding", { screen: "Entrypoint" });
            }
        } else {
            navigation.replace("HomeTabs", { state: undefined });
        }
    }, [account, navigation]);

    return (
        <Stack.Navigator
            initialRouteName="Entrypoint"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Entrypoint" component={EntrypointHome} />
            <Stack.Screen
                name="Login"
                children={(props) => <LoginForm {...props} onSubmit={doLogin} error={error} />}
            />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
            <Stack.Screen name="EnterTeamEmail" component={EnterTeamEmail} />
            <Stack.Screen name="EnterUserInfo" component={EnterUserInfo} />
            <Stack.Screen name="SelectTeam" component={SelectTeam} />
        </Stack.Navigator>
    );
}
