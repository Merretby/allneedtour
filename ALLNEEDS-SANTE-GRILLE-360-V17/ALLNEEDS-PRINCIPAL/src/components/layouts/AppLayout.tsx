import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { 
  LayoutDashboard, LineChart, Bell, 
  ShoppingCart, ListOrdered, Utensils, CalendarDays, ChefHat, Menu as MenuIcon,
  Package, Receipt, Truck, ShoppingBag, CreditCard, Wallet, Users,
  UserCircle, Star, Smartphone, Globe,
  TrendingUp, BarChart3, TrendingDown, Trash2, Link as LinkIcon,
  Settings, CreditCard as SubIcon, Settings2, LogOut, ChevronDown, Check
} from 'lucide-react'

const navigation = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/app/dashboard', icon: <LayoutDashboard size={16} /> },
      { label: 'Business Insights', to: '/app/insights', icon: <LineChart size={16} /> },
      { label: 'Notifications', to: '/app/notifications', icon: <Bell size={16} /> },
    ]
  },
  {
    title: 'Operations',
    mode: 'A', // Only relevant for Mode A (Complete Management)
    items: [
      { label: 'POS and Sales', to: '/app/operations/pos', icon: <ShoppingCart size={16} /> },
      { label: 'Orders', to: '/app/operations/orders', icon: <ListOrdered size={16} /> },
      { label: 'Tables & Floor', to: '/app/operations/tables', icon: <Utensils size={16} /> },
      { label: 'Reservations', to: '/app/operations/reservations', icon: <CalendarDays size={16} /> },
      { label: 'Kitchen Display', to: '/app/operations/kitchen', icon: <ChefHat size={16} /> },
      { label: 'Menu & Products', to: '/app/operations/menu', icon: <MenuIcon size={16} /> },
    ]
  },
  {
    title: 'Management',
    mode: 'A', // Mostly Mode A
    items: [
      { label: 'Inventory', to: '/app/management/inventory', icon: <Package size={16} /> },
      { label: 'Recipes & Costing', to: '/app/management/recipes', icon: <Receipt size={16} /> },
      { label: 'Suppliers', to: '/app/management/suppliers', icon: <Truck size={16} /> },
      { label: 'Purchasing', to: '/app/management/purchasing', icon: <ShoppingBag size={16} /> },
      { label: 'Expenses', to: '/app/management/expenses', icon: <CreditCard size={16} /> },
      { label: 'Cash Register', to: '/app/management/cash-register', icon: <Wallet size={16} /> },
      { label: 'Employees', to: '/app/management/employees', icon: <Users size={16} /> },
    ]
  },
  {
    title: 'Growth',
    items: [
      { label: 'Customers', to: '/app/growth/customers', icon: <UserCircle size={16} /> },
      { label: 'Loyalty Program', to: '/app/growth/loyalty', icon: <Star size={16} /> },
      { label: 'Digital Menu', to: '/app/growth/digital-menu', icon: <Smartphone size={16} /> },
      { label: 'Online Ordering', to: '/app/growth/online-ordering', icon: <Globe size={16} /> },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Profitability', to: '/app/intelligence/profitability', icon: <TrendingUp size={16} /> },
      { label: 'Sales Reports', to: '/app/intelligence/sales-reports', icon: <BarChart3 size={16} /> },
      { label: 'Product Performance', to: '/app/intelligence/product-performance', icon: <TrendingDown size={16} /> },
      { label: 'Waste Analysis', to: '/app/intelligence/waste-analysis', icon: <Trash2 size={16} /> },
      { label: 'Integrations', to: '/app/intelligence/integrations', icon: <LinkIcon size={16} /> },
    ]
  },
  {
    title: 'Administration',
    items: [
      { label: 'Settings', to: '/app/admin/settings', icon: <Settings size={16} /> },
      { label: 'Subscription', to: '/app/admin/subscription', icon: <SubIcon size={16} /> },
      { label: 'Platform Admin', to: '/app/admin/platform', icon: <Settings2 size={16} /> },
    ]
  }
]

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<'A' | 'B'>('A')
  const [showModeDropdown, setShowModeDropdown] = useState(false)
  
  const filteredNav = navigation.filter(group => {
    if (mode === 'B' && group.mode === 'A') return false;
    return true;
  })

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-brand-700">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">R</div>
            <span className="font-semibold text-lg tracking-tight">RestoOS</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar space-y-6">
          {filteredNav.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.to)
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-green-50 text-green-700' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <span className={isActive ? 'text-green-600' : 'text-slate-400'}>{item.icon}</span>
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold">
              SB
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Sofia Benali</p>
              <p className="text-xs text-slate-500 truncate">Owner</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600" title="Log out" onClick={() => navigate({ to: '/' })}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 relative">
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
            >
              {mode === 'A' ? 'Mode A: Complete Management' : 'Mode B: Connected Intelligence'}
              <ChevronDown size={14} />
            </button>

            {showModeDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                <button 
                  onClick={() => { setMode('A'); setShowModeDropdown(false); navigate({ to: '/app/dashboard' }); }}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Mode A: Complete</div>
                    <div className="text-xs text-slate-500">For restaurants without software</div>
                  </div>
                  {mode === 'A' && <Check size={16} className="text-green-600" />}
                </button>
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  onClick={() => { setMode('B'); setShowModeDropdown(false); navigate({ to: '/app/dashboard' }); }}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-sm hover:bg-slate-50"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Mode B: Connected</div>
                    <div className="text-xs text-slate-500">For restaurants with existing POS</div>
                  </div>
                  {mode === 'B' && <Check size={16} className="text-green-600" />}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Marrakech Branch</span>
            <span>12:42 PM</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-[#F9FAFB]">
          <Outlet />
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
      `}} />
    </div>
  )
}
