import { ConfigPlugin, withAppDelegate, withInfoPlist, withMainApplication, withStringsXml } from "expo/config-plugins";

interface StallionPluginOptions {
    projectId: string;
    appToken: string;
}

const withStallion: ConfigPlugin<StallionPluginOptions> = (config, options) => {
    config = withInfoPlist(config, (config) => {
        config.modResults["StallionProjectId"] = options.projectId;
        config.modResults["StallionAppToken"] = options.appToken;
        return config;
    });
    config = withAppDelegate(config, (config) => {
        if (config.modResults.language !== "swift") {
            throw new Error(`Expected ${config.modResults.path} language to be swift`);
        }

        config.modResults.contents =
            "import react_native_stallion\n" +
            config.modResults.contents.replace(
                'Bundle.main.url(forResource: "main", withExtension: "jsbundle")',
                "StallionModule.getBundleURL()",
            );
        return config;
    });

    config = withStringsXml(config, (config) => {
        config.modResults.resources.string?.push(
            {
                $: { name: "StallionProjectId", translatable: "false" },
                _: options.projectId,
            },
            {
                $: { name: "StallionAppToken", translatable: "false" },
                _: options.appToken,
            },
        );
        return config;
    });
    config = withMainApplication(config, (config) => {
        if (config.modResults.language !== "kt") {
            throw new Error(`Expected ${config.modResults.path} language to be kotlin`);
        }

        config.modResults.contents = config.modResults.contents
            .replace(/(?<=package.*\n)/, "\nimport com.stallion.Stallion")
            .replace(
                /(?<=override val isNewArchEnabled: Boolean = BuildConfig\.IS_NEW_ARCHITECTURE_ENABLED)/,
                "\n\n          override fun getJSBundleFile(): String? = Stallion.getJSBundleFile(applicationContext)",
            );
        return config;
    });

    return config;
};

export default withStallion;
