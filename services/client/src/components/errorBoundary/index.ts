import React from "react"

export class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
    public componentDidCatch = (error: unknown): void => {
        console.error(error)
    }

    public render = (): React.ReactNode => this.props.children
}

export default ErrorBoundary
