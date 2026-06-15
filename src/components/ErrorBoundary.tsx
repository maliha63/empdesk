import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-4xl">⚠</p>
          <p className="text-gray-900 dark:text-white font-medium">
            Something went wrong.
          </p>
          <p className="text-sm text-gray-500 dark:text-[#4b5e7a]">
            {this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="text-sm text-brand-500 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
