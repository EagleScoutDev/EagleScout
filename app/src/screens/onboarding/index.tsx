import { createStackNavigator, type StackScreenProps } from "@react-navigation/stack";
import { EntrypointHome } from "./EntrypointHome";
import { LoginForm } from "./Login";
import { ResetPassword } from "./ResetPassword";
import { SetNewPassword } from "./SetNewPassword";
import { Signup } from "./Signup";
import { EnterTeamEmail } from "./steps/EnterTeamEmail";
import { EnterUserInfo } from "./steps/EnterUserInfo";
import { SelectTeam } from "./steps/SelectTeam";
import { useState, useContext, useEffect } from "react";
import { AccountStatus, login, saveAccount } from "../../lib/account";
import { AccountContext } from "../../lib/contexts/AccountContext";
import type { RootStackScreenProps } from "../../App";

const Stack = createStackNavigator<OnboardingParamList>();
export type OnboardingScreenProps<K extends keyof OnboardingParamList> = StackScreenProps<OnboardingParamList, K>
export type OnboardingParamList = {
    Entrypoint: undefined

    Login: undefined
    ResetPassword: undefined
    SetNewPassword: undefined

    Signup: undefined
    SelectTeam: undefined
    EnterUserInfo: undefined
    EnterTeamEmail: undefined

};

export interface OnboardingProps extends RootStackScreenProps<"Onboarding"> {

}
export const OnboardingFlow = ({ navigation }: OnboardingProps) => {
    const { account, setAccount } = useContext(AccountContext)
    const [error, setError] = useState("")

    async function doLogin(username: string, password: string) {
        try {
            const account = await login(username, password)
            if (account === null) {
                setError("Account does not exist.")
                return
            }
            setAccount(account)
        }
        catch (e) {
            console.error(e)
            setError(e instanceof Error ? e.message : "An error occured");
        }
    }

    useEffect(() => {
        console.debug("check account status:", account?.status)
        switch (account?.status) {
            case undefined:
                navigation.navigate("Onboarding", { screen: "Entrypoint" })
                break
            case AccountStatus.Deleted:
                setError("Your account has been marked for deletion.")
                navigation.replace("Onboarding", { screen: "Entrypoint" })
                break
            case AccountStatus.Onboarding:
                setError("");
                navigation.navigate("Onboarding", { screen: "EnterUserInfo" });
                break
            case AccountStatus.Approval:
                setError("Your account has not been approved yet.\nPlease contact a captain for approval.");
                navigation.replace("Onboarding", { screen: "Entrypoint" })
                break
            case AccountStatus.Approved:
                saveAccount(account);
                setAccount(account);
                navigation.replace("App", { state: undefined })
                break

            default:
                throw new Error("Assertion failed") // TODO: better handling of this
        }
    }, [account])

    return <Stack.Navigator
        initialRouteName="Entrypoint"
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Entrypoint" component={EntrypointHome} />
        <Stack.Screen name="Login" children={(props) => <LoginForm {...props} onSubmit={doLogin} error={error} />} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
        <Stack.Screen name="EnterTeamEmail" component={EnterTeamEmail} />
        <Stack.Screen name="EnterUserInfo" component={EnterUserInfo} />
        <Stack.Screen name="SelectTeam" component={SelectTeam} />
    </Stack.Navigator>
}
