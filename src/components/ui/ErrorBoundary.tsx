'use client'

import { Component, ReactNode } from 'react'
import { Button } from "./button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="font-recoleta text-2xl mb-4">
              Oops, something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try again.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 