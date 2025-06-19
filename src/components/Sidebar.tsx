import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Server, 
  Shield, 
  FileText,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vulnerabilidades', href: '/vulnerabilidades', icon: AlertTriangle },
  { name: 'Ativos', href: '/ativos', icon: Server },
  { name: 'Contramedidas', href: '/contramedidas', icon: Shield },
  { name: 'Relatórios', href: '/relatorios', icon: FileText },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary-500" />
          <span className="text-xl font-bold text-white">VulnDB</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
                <ChevronRight 
                  className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                    isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                  }`} 
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          © 2024 VulnDB System
        </div>
      </div>
    </div>
  )
}