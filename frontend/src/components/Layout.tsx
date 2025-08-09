import React, { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Vaults', href: '/vaults', icon: CubeIcon },
    { name: 'Categories', href: '/categories', icon: TagIcon },
  ]

  // Add test page link in development
  if ((import.meta as any).env.DEV) {
    navigation.push({ name: 'Test Suite', href: '/test', icon: ChartBarIcon });
  }

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/')
  }

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('/vaults/') && currentPath.includes('/items')) {
      return 'Vault Items';
    }
    return navigation.find(item => isActive(item.href))?.name || 'WarranTree';
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUserMenuOpen(false)
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sidebarWidth = sidebarCollapsed ? '5rem' : '18rem'
  const mainPadding = sidebarCollapsed ? '5rem' : '18rem'

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0, #cbd5e1)',
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Sidebar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: sidebarWidth,
          backgroundColor: 'white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          transition: 'width 0.3s ease-in-out',
          overflow: 'hidden'
        }}
      >
        {/* Logo Section */}
        <div 
          style={{
            height: '5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
            borderBottom: '1px solid #e5e7eb',
            padding: '0 1rem'
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            {!sidebarCollapsed ? (
              <Link 
                to="/dashboard" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div 
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <ChartBarIcon style={{ height: '2rem', width: '2rem', color: '#3b82f6' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                    WarranTree
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Warranty Management
                  </div>
                </div>
              </Link>
            ) : (
              <div 
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <ChartBarIcon style={{ height: '1.5rem', width: '1.5rem', color: '#3b82f6' }} />
              </div>
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'white',
              marginLeft: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            {sidebarCollapsed ? (
              <Bars3Icon style={{ height: '1.25rem', width: '1.25rem' }} />
            ) : (
              <XMarkIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            )}
          </button>

        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: sidebarCollapsed ? '2rem 0.5rem' : '2rem 1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem' 
        }}>
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <div key={item.name} style={{ position: 'relative' }}>
                <Link
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: sidebarCollapsed ? '0' : '0.75rem',
                    padding: sidebarCollapsed ? '0.75rem' : '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    position: 'relative',
                    background: active ? 'linear-gradient(to right, #3b82f6, #1d4ed8)' : 'transparent',
                    color: active ? 'white' : '#374151',
                    transform: active ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: active ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  {active && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '-0.25rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '0.25rem',
                        height: '1.25rem',
                        backgroundColor: 'white',
                        borderRadius: '0.125rem',
                      }}
                    />
                  )}
                  <item.icon style={{ height: '1.5rem', width: '1.5rem', flexShrink: 0 }} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      marginLeft: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#1f2937',
                      color: 'white',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      opacity: 0,
                      visibility: 'hidden',
                      transition: 'all 0.2s',
                      zIndex: 100,
                    }}
                    className="nav-tooltip"
                  >
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ 
          padding: sidebarCollapsed ? '1rem 0.5rem' : '1.5rem', 
          borderTop: '1px solid #e5e7eb', 
          backgroundColor: '#f9fafb' 
        }}>
          <div style={{ textAlign: 'center' }}>
            {!sidebarCollapsed ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ height: '0.5rem', width: '0.5rem', backgroundColor: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                    WarranTree v1.0
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                  Never miss a warranty again! 🌳
                </p>
              </>
            ) : (
              <div style={{ height: '0.5rem', width: '0.5rem', backgroundColor: '#10b981', borderRadius: '50%', margin: '0 auto', animation: 'pulse 2s infinite' }} />
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ paddingLeft: mainPadding, minHeight: '100vh', transition: 'padding-left 0.3s ease-in-out' }}>
        {/* Header */}
        <header 
          style={{
            backgroundColor: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}
              >
                {getPageTitle()}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div 
                  style={{
                    height: '0.25rem',
                    width: '3rem',
                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                    borderRadius: '9999px',
                  }}
                />
                <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {user?.name || 'Demo User'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    {user?.email || 'demo@warrantree.com'}
                  </p>
                </div>
                <div 
                  style={{
                    height: '2.5rem',
                    width: '2.5rem',
                    background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'white' }}>
                    {getInitials(user?.name || 'Demo User')}
                  </span>
                </div>
                <ChevronDownIcon 
                  style={{ 
                    height: '1rem', 
                    width: '1rem', 
                    color: '#6b7280',
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 0.5rem)',
                    width: '16rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #e5e7eb',
                    zIndex: 50,
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <div style={{ padding: '1rem' }}>
                    {/* User Info */}
                    <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          style={{
                            height: '3rem',
                            width: '3rem',
                            background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                            {getInitials(user?.name || 'Demo User')}
                          </span>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                            {user?.name || 'Demo User'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                            {user?.email || 'demo@warrantree.com'}
                          </p>
                          {user?.role && (
                            <span style={{ 
                              fontSize: '0.625rem', 
                              backgroundColor: '#dbeafe', 
                              color: '#1e40af', 
                              padding: '0.125rem 0.5rem', 
                              borderRadius: '9999px',
                              textTransform: 'uppercase',
                              fontWeight: '600'
                            }}>
                              {user.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          width: '100%',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => {
                          setUserMenuOpen(false);
                          window.location.href = '/profile';
                        }}
                      >
                        <UserCircleIcon style={{ height: '1.25rem', width: '1.25rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>View Profile</span>
                      </button>

                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          width: '100%',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => {
                          setUserMenuOpen(false);
                          window.location.href = '/profile';
                        }}
                      >
                        <Cog6ToothIcon style={{ height: '1.25rem', width: '1.25rem', color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>Settings</span>
                      </button>

                      <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0.5rem 0' }} />

                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                          width: '100%',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={handleLogout}
                      >
                        <ArrowRightOnRectangleIcon style={{ height: '1.25rem', width: '1.25rem', color: '#dc2626' }} />
                        <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ minHeight: 'calc(100vh - 5rem)' }}>
          {children}
        </main>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
          }}
          onClick={() => setUserMenuOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .nav-tooltip {
          opacity: 0 !important;
          visibility: hidden !important;
        }
        
        nav > div:hover .nav-tooltip {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
    </div>
  )
} 