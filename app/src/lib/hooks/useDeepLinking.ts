import { useEffect, useState } from "react";
import { Linking } from "react-native";

export function useDeepLinking() {
    const [url, setUrl] = useState<string | null>(null);
    useEffect(() => {
        const eventListener = Linking.addEventListener("url", ({ url }) => {
            setUrl(url);
        });
        Linking.getInitialURL().then((url) => {
            if (url) {
                setUrl(url);
            }
        });
        return () => {
            eventListener.remove();
        };
    }, []);
    return { url };
}
