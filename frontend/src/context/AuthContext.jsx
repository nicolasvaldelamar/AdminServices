import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await api.get('/auth/perfil')
        setUsuario(response.data)
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }
  
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, usuario } = response.data
      
      localStorage.setItem('token', token)
      setUsuario(usuario)
      navigate('/app')
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión' 
      }
    }
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    setUsuario(null)
    navigate('/login')
  }
  
  const value = {
    usuario,
    loading,
    login,
    logout,
    checkAuth
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
