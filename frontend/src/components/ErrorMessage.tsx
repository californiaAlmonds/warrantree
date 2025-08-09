import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-danger-400" />
        <h3 className="mt-2 text-sm font-medium text-secondary-900">Error</h3>
        <p className="mt-1 text-sm text-secondary-500">{message}</p>
      </div>
    </div>
  )
} 