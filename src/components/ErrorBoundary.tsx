import { Component } from "react";
import type { ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; message: string; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  handleReset() {
    this.setState({ hasError: false, message: "" });
    window.location.href = "/";
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
          <div className="text-5xl">⚠️</div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="mt-2 max-w-md text-sm text-gray-500">
            {this.state.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.handleReset()}
            className="btn-primary mt-6"
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}