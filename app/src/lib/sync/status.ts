import { addEventListener as addNetInfoEventListener } from "@react-native-community/netinfo";
import { Signal, useSignal } from "@/lib/util/react/signal";
import { onlineManager } from "@tanstack/query-core";

export type InternetStatus = {
    online: boolean;
};

let currentStatus = new Signal<InternetStatus>({
    online: false,
});

export function getNetworkStatus() {
    return currentStatus.get();
}
export function setNetworkStatus(status: InternetStatus) {
    currentStatus.set(status);
}
export function useInternetStatus(): InternetStatus {
    return useSignal<InternetStatus>(currentStatus);
}

addNetInfoEventListener((s) => {
    currentStatus.set({
        online: s.isInternetReachable ?? false,
    });
});

currentStatus.sub(({ online }) => onlineManager.setOnline(online));
