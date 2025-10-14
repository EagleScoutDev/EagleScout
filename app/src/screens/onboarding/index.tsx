import { EntrypointHome } from "./EntrypointHome";
import { LoginForm } from "./Login";
import { ResetPassword } from "./ResetPassword";
import { SetNewPassword } from "./SetNewPassword";
import { Signup } from "./Signup";
import { EnterTeamEmail } from "./steps/EnterTeamEmail";
import { EnterUserInfo } from "./steps/EnterUserInfo";
import { SelectTeam } from "./steps/SelectTeam";
import { useState, useEffect } from "react";
import type { RootStackScreenProps } from "../../App";
import { AccountStatus } from "../../lib/user/account";
import { useAccount } from "../../lib/react/hooks/useAccount";
import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";

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

export interface OnboardingProps extends RootStackScreenProps<"Onboarding"> {}
export const OnboardingFlow = ({ navigation }: OnboardingProps) => {
    const [error, setError] = useState("");
    const { account, login } = useAccount();

    async function doLogin(username: string, password: string) {
        try {
            await login(username, password);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "An error occured");
        }
    }

    useEffect(() => {
        console.log(account)
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
                    "Your account has not been approved yet.\nPlease contact a admin for approval."
                );
                navigation.replace("Onboarding", { screen: "Entrypoint" });
                break;
            case AccountStatus.Approved:
                navigation.replace("App", { state: undefined });
                break;

            default:
                throw new Error("Assertion failed"); // TODO: better handling of this
        }
    }, [account]);

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
};
