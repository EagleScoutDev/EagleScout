import React, { type ComponentType, type ErrorInfo, type PropsWithChildren } from "react";
import { View } from "react-native";

export interface FallbackProps {
    error: any;
    reset: () => void;
}

interface ErrorBoundaryState {
    error: Error | null;
}
export interface ErrorBoundaryProps extends PropsWithChildren {
    FallbackComponent: ComponentType<FallbackProps>;
    onError?: (error: Error, info: ErrorInfo) => void;
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static defaultProps: ErrorBoundaryProps = {
        FallbackComponent: () => <View></View>,
    };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        if (typeof this.props.onError === "function") {
            this.props.onError(error, info);
        }
    }

    reset() {
        this.setState({ error: null });
    }

    render() {
        return this.state.error ? (
            <this.props.FallbackComponent error={this.state.error} reset={this.reset} />
        ) : (
            this.props.children
        );
    }
}
