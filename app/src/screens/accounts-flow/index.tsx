import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
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
import { ThemeContext } from "../../lib/contexts/ThemeContext";
import { AccountContext } from "../../lib/contexts/AccountContext";
import { AppTabsScreenProps } from "../../AppTabs";

const Stack = createStackNavigator<AccountsParamList>();
export type AccountsScreenProps<K extends keyof AccountsParamList> = StackScreenProps<AccountsParamList, K>
export type AccountsParamList = {
    Entrypoint: undefined;
    Login: undefined;
    Signup: undefined;
    ResetPassword: undefined;
    SetNewPassword: undefined;
    EnterTeamEmail: undefined;
    EnterUserInfo: undefined;
    SelectTeam: undefined;
};

export interface AccountsProps extends AppTabsScreenProps<"Accounts"> {

}
export const AccountsFlow = ({ route, navigation }: AccountsProps) => {
    const { setOnboardingActive } = useContext(ThemeContext);
    const { account, setAccount } = useContext(AccountContext);

    const [error, setError] = useState('');

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
    async function checkAccount() {
        if (account === null) {
            navigation.navigate("Accounts", { screen: "Entrypoint" })
            return
        }

        switch (account.status) {
            case AccountStatus.Deleted:
                setError("Your account has been marked for deletion.");
                navigation.navigate("Accounts", { screen: "Entrypoint" })
                break;
            case AccountStatus.Onboarding:
                setError("");
                navigation.navigate("Accounts", { screen: "EnterUserInfo" });
                break;
            case AccountStatus.Approval:
                setError("Your account has not been approved yet.\nPlease contact a captain for approval.");
                navigation.navigate("Accounts", { screen: "Entrypoint" })
                break;
            case AccountStatus.Approved:
                console.log("account saved:", account)
                saveAccount(account);

                setAccount(account);
                setOnboardingActive(false);
                navigation.navigate("Home", { state: undefined });
                break;

            default:
                throw new Error("Assertion failed") // TODO: better handling of this
        }
    }

    useEffect(() => {
        checkAccount()
    }, [account])

    return <Stack.Navigator
        initialRouteName="Entrypoint"
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name='Entrypoint' component={EntrypointHome} />
        <Stack.Screen name="Login" children={(props) => <LoginForm {...props} onSubmit={doLogin} error={error} />} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
        <Stack.Screen name="EnterTeamEmail" component={EnterTeamEmail} />
        <Stack.Screen name="EnterUserInfo" component={EnterUserInfo} />
        <Stack.Screen name="SelectTeam" component={SelectTeam} />
    </Stack.Navigator>
}
