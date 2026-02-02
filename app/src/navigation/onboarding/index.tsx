import { useEffect, useState } from "react";
import {
    createNativeStackNavigator,
    type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { AccountStatus } from "@/lib/user/account";
import { useUserStore } from "@/lib/stores/user";
import type { RootStackScreenProps } from "@/navigation";

import { EntrypointHome } from "./EntrypointHome";
import { LoginForm } from "./Login";
import { ResetPassword } from "./ResetPassword";
import { SetNewPassword } from "./SetNewPassword";
import { Signup } from "./Signup";
import { EnterTeamEmail } from "./steps/EnterTeamEmail";
import { EnterUserInfo } from "./steps/EnterUserInfo";
import { SelectTeam } from "./steps/SelectTeam";

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

    const login = useUserStore((state) => state.login);
    const account = useUserStore((state) => state.account);

    async function doLogin(username: string, password: string) {
        try {
            await login(username, password);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "An error occurred");
        }
    }

    useEffect(() => {
        switch (account?.status) {
            case undefined:
                navigation.navigate("Onboarding", { screen: "Entrypoint" });
                break;
            case AccountStatus.Deleted:
                setError("Your account has been marked for deletion.");
                navigation.replace("Onboarding", { screen: "Entrypoint" });
                break;
            case AccountStatus.Onboarding:
                setError("");
                navigation.navigate("Onboarding", { screen: "EnterUserInfo" });
                break;
            case AccountStatus.Approval:
                setError(
                    "Your account has not been approved yet.\nPlease contact a admin for approval.",
                );
                navigation.replace("Onboarding", { screen: "Entrypoint" });
                break;
            case AccountStatus.Approved:
                navigation.replace("HomeTabs", { state: undefined });
                break;

            default:
                throw new Error("Assertion failed"); // TODO: better handling of this
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
