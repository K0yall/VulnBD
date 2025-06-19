import { Shield, Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-white">VulnDB</h1>
          </div>
          <div className="hidden md:block">
            <p className="text-gray-400 text-sm">Sistema de Gerenciamento de Vulnerabilidades</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-300 text-sm hidden md:block">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  )
}