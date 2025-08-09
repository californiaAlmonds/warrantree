import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface LoginFormProps {
  onToggleMode: () => void
  onSuccess?: () => void
}

export function LoginForm({ onToggleMode, onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await login(formData.email, formData.password)
      toast.success('Welcome back!')
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        backgroundColor: 'white',
        borderRadius: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '3rem',
        animation: 'fadeInUp 0.6s ease-out',
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}>
              <ChartBarIcon style={{ height: '3rem', width: '3rem', color: 'white' }} />
            </div>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            marginBottom: '0.5rem',
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0,
          }}>
            Sign in to your WarranTree account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Field */}
          <div className="material-form-group">
            <label className="material-form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: errors.email ? '2px solid #ef4444' : '1px solid #e5e7eb',
                fontSize: '1rem',
                transition: 'all 0.2s',
                backgroundColor: 'white',
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = '#e5e7eb'
                  e.target.style.boxShadow = 'none'
                }
              }}
            />
            {errors.email && (
              <p className="material-form-error">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="material-form-group">
            <label className="material-form-label" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingRight: '3rem',
                  borderRadius: '0.75rem',
                  border: errors.password ? '2px solid #ef4444' : '1px solid #e5e7eb',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  backgroundColor: 'white',
                }}
                onFocus={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = '#3b82f6'
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  if (!errors.password) {
                    e.target.style.borderColor = '#e5e7eb'
                    e.target.style.boxShadow = 'none'
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0.25rem',
                }}
              >
                {showPassword ? (
                  <EyeSlashIcon style={{ height: '1.25rem', width: '1.25rem' }} />
                ) : (
                  <EyeIcon style={{ height: '1.25rem', width: '1.25rem' }} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="material-form-error">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="material-btn material-btn-primary"
            style={{
              width: '100%',
              padding: '0.875rem',
              fontSize: '1rem',
              fontWeight: '600',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div className="material-spinner" style={{ width: '1.25rem', height: '1.25rem' }} />
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 0.5rem 0',
          }}>
            Demo Credentials:
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: 0,
          }}>
            Email: demo@warrantree.com<br />
            Password: password123
          </p>
        </div>

        {/* Toggle to Register */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#3b82f6'}
            >
              Create one here
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
} 