import type { ConfigPlugin } from "expo/config-plugins";
import { withAppDelegate, withInfoPlist, withMainApplication, withStringsXml } from "expo/config-plugins";

interface StallionPluginOptions {
    projectId?: string;
    appToken?: string;
}

const withStallion: ConfigPlugin<StallionPluginOptions> = (config, options) => {
    const projectId = options?.projectId?.trim();
    const appToken = options?.appToken?.trim();

    // PR CI often runs without secrets; skip Stallion wiring in that case.
    if (!projectId || !appToken) {
        return config;
    }

    config = withInfoPlist(config, (config) => {
        config.modResults["StallionProjectId"] = projectId;
        config.modResults["StallionAppToken"] = appToken;
        return config;
    });
    config = withAppDelegate(config, (config) => {
        if (config.modResults.language !== "swift") {
            throw new Error(`Expected ${config.modResults.path} language to be swift`);
        }

        let contents = config.modResults.contents;
        if (!contents.includes("import react_native_stallion")) {
            contents = `import react_native_stallion\n${contents}`;
        }
        contents = contents.replace(
            'Bundle.main.url(forResource: "main", withExtension: "jsbundle")',
            "StallionModule.getBundleURL()",
        );

        config.modResults.contents = contents;
        return config;
    });

    config = withStringsXml(config, (config) => {
        const strings = config.modResults.resources.string ?? [];
        config.modResults.resources.string = strings.filter(
            (entry) => entry.$.name !== "StallionProjectId" && entry.$.name !== "StallionAppToken",
        );

        config.modResults.resources.string.push(
            {
                $: { name: "StallionProjectId", translatable: "false" },
                _: projectId,
            },
            {
                $: { name: "StallionAppToken", translatable: "false" },
                _: appToken,
            },
        );
        return config;
    });
    config = withMainApplication(config, (config) => {
        if (config.modResults.language !== "kt") {
            throw new Error(`Expected ${config.modResults.path} language to be kotlin`);
        }

        const stallionImport = "import com.stallion.Stallion";
        const stallionBundleLine =
            "override fun getJSBundleFile(): String? = Stallion.getJSBundleFile(applicationContext)";

        let contents = config.modResults.contents;
        if (!contents.includes(stallionImport)) {
            contents = contents.replace(/(?<=package.*\n)/, `\n${stallionImport}`);
        }
        if (!contents.includes(stallionBundleLine)) {
            contents = contents.replace(
                /(?<=override val isNewArchEnabled: Boolean = BuildConfig\.IS_NEW_ARCHITECTURE_ENABLED)/,
                `\n\n          ${stallionBundleLine}`,
            );
        }

        config.modResults.contents = contents;
        return config;
    });

    return config;
};

export default withStallion;
