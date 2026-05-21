import React from 'react';
import { ShoppingCart, Package, LayoutDashboard, Settings, BarChart3, TrendingUp, AlertTriangle, LogOut, User, Lock } from 'lucide-react';

// --- Tipos de Datos ---
type Rol = 'Administrador' | 'Operador';

interface Usuario {
  username: string;
  rol: Rol;
}

interface Producto {
  id: string;
  nombre: string;
  precioUSD: number;
  stockKG: number;
  categoria: 'Frutas' | 'Verduras' | 'Viveres';
}

interface ItemCarrito extends Producto {
  peso: number;
  subtotal: number;
}

// --- Componente Principal ---
const App: React.FC = () => {
  const [tasaBCV] = React.useState(36.50);
  const [usuario, setUsuario] = React.useState<Usuario | null>(null);
  const [credentials, setCredentials] = React.useState({ username: '', password: '' });
  const [error, setError] = React.useState('');
  const [vista, setVista] = React.useState<'Dashboard' | 'Ventas' | 'Inventario'>('Ventas');
  const [carrito, setCarrito] = React.useState<ItemCarrito[]>([]);

  // Datos de ejemplo
  const productos: Producto[] = [
    { id: '1', nombre: 'Papa Granola', precioUSD: 1.20, stockKG: 50, categoria: 'Verduras' },
    { id: '2', nombre: 'Tomate Perita', precioUSD: 1.50, stockKG: 4, categoria: 'Verduras' },
    { id: '3', nombre: 'Cambur', precioUSD: 0.80, stockKG: 20, categoria: 'Frutas' },
    { id: '4', nombre: 'Cebolla Blanca', precioUSD: 0.90, stockKG: 15, categoria: 'Verduras' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setUsuario({ username: 'Administrador', rol: 'Administrador' });
      setVista('Dashboard');
      setError('');
    } else if (credentials.username === 'operador' && credentials.password === 'operador123') {
      setUsuario({ username: 'Operador de Caja', rol: 'Operador' });
      setVista('Ventas');
      setError('');
    } else {
      setError('Credenciales incorrectas. Intente de nuevo.');
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setCredentials({ username: '', password: '' });
    setCarrito([]);
  };

  const totalUSD = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const totalBS = totalUSD * tasaBCV;
  const igtf = totalUSD * 0.03;

  // --- Pantalla de Login ---
  if (!usuario) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-green-800 p-8 text-center text-white">
            <div className="text-5xl mb-2">🥬</div>
            <h1 className="text-2xl font-bold">SIG-FRUVER</h1>
            <p className="text-green-100 text-sm mt-1">Sistema de Gestión de Fruterías</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <User size={16} /> Usuario
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                placeholder="Ingrese su usuario"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Lock size={16} /> Contraseña
              </label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none transition"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-100"
            >
              Iniciar Sesión
            </button>
            <div className="text-center text-xs text-gray-400 mt-4">
              Demo: admin/admin123 | operador/operador123
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- Aplicación Principal (Después del Login) ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white flex flex-col shadow-xl z-20">
        <div className="p-6 text-2xl font-bold flex items-center gap-2 border-b border-green-700">
          <span className="text-3xl">🥬</span> SIG-FRUVER
        </div>
        <div className="p-4 border-b border-green-700 bg-green-900/30">
          <div className="text-xs text-green-300 uppercase font-bold mb-1">Sesión activa</div>
          <div className="font-medium truncate">{usuario.username}</div>
          <div className="text-[10px] bg-green-700 inline-block px-2 py-0.5 rounded mt-1 uppercase tracking-tighter font-black">
            {usuario.rol}
          </div>
        </div>
        <nav className="flex-1 mt-4">
          {usuario.rol === 'Administrador' && (
            <button 
              onClick={() => setVista('Dashboard')}
              className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Dashboard' ? 'bg-green-700' : ''}`}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
          )}
          
          <button 
            onClick={() => setVista('Ventas')}
            className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Ventas' ? 'bg-green-700 border-r-4 border-white' : ''}`}
          >
            <ShoppingCart size={20} /> Ventas (POS)
          </button>

          {usuario.rol === 'Administrador' && (
            <>
              <button 
                onClick={() => setVista('Inventario')}
                className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Inventario' ? 'bg-green-700 border-r-4 border-white' : ''}`}
              >
                <Package size={20} /> Inventario (KG)
              </button>
              <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition text-green-300/50 cursor-not-allowed">
                <BarChart3 size={20} /> Reportes
              </button>
            </>
          )}
        </nav>
        <div className="p-4 border-t border-green-700 space-y-2">
          {usuario.rol === 'Administrador' && (
            <button className="flex items-center gap-3 text-green-300 hover:text-white transition w-full px-2 py-2 text-sm">
              <Settings size={18} /> Configuración
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-300 hover:text-red-100 transition w-full px-2 py-2 text-sm font-bold"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">{vista}</h1>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200 text-green-800 font-medium">
              Tasa BCV: <span className="font-bold">{tasaBCV.toFixed(2)} Bs/$</span>
            </div>
            <div className="text-gray-400 text-sm italic hidden md:block">
              Caracas, 21 de mayo de 2026
            </div>
          </div>
        </header>

        {/* Vistas Dinámicas */}
        <main className="p-8 overflow-y-auto">
          {vista === 'Dashboard' && usuario.rol === 'Administrador' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 font-medium">Ventas Hoy (Neto)</span>
                    <TrendingUp className="text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800">$ 450.00</div>
                  <div className="text-lg text-gray-500">Bs. 16,425.00</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 font-medium">Alertas de Stock</span>
                    <AlertTriangle className="text-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tomate Perita</span>
                      <span className="text-red-500 font-bold">4.00 kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cebolla Blanca</span>
                      <span className="text-amber-500 font-bold">15.00 kg</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 font-medium">Rentabilidad</span>
                    <BarChart3 className="text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800">32.4 %</div>
                  <div className="text-sm text-green-600 mt-2">↑ 2.1% vs ayer</div>
                </div>
              </div>
            </div>
          )}

          {vista === 'Ventas' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Catálogo */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Buscar producto por nombre..." 
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none">
                    <option>Todas las categorías</option>
                    <option>Frutas</option>
                    <option>Verduras</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {productos.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => {
                        const itemExistente = carrito.find(item => item.id === p.id);
                        if (itemExistente) {
                          setCarrito(carrito.map(item => item.id === p.id ? {...item, peso: item.peso + 1, subtotal: (item.peso + 1) * p.precioUSD} : item));
                        } else {
                          setCarrito([...carrito, {...p, peso: 1, subtotal: p.precioUSD}]);
                        }
                      }}
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-green-500 transition text-left group hover:shadow-md"
                    >
                      <div className="text-[10px] font-bold text-green-600 mb-1 uppercase tracking-widest">{p.categoria}</div>
                      <div className="font-bold text-gray-800">{p.nombre}</div>
                      <div className="text-lg text-gray-900 mt-2 font-black">$ {p.precioUSD.toFixed(2)}</div>
                      <div className={`text-xs mt-1 ${p.stockKG < 5 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                        Quedan: {p.stockKG} kg
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Factura */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-[calc(100vh-12rem)] relative">
                <div className="p-6 border-b border-gray-100 font-black text-lg text-gray-800 flex justify-between">
                  <span>FACTURA</span>
                  <ShoppingCart className="text-green-600" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {carrito.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 italic">
                      <ShoppingCart size={48} className="mb-2" />
                      Espere por productos...
                    </div>
                  ) : (
                    carrito.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{item.nombre}</div>
                          <div className="text-[10px] text-gray-500 uppercase">{item.peso.toFixed(3)} kg x $ {item.precioUSD.toFixed(2)}</div>
                        </div>
                        <div className="font-black text-gray-800">$ {item.subtotal.toFixed(2)}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-6 bg-green-50 border-t border-green-100 rounded-b-xl space-y-3">
                  <div className="flex justify-between text-2xl font-black text-gray-900">
                    <span>TOTAL $</span>
                    <span>$ {(totalUSD + igtf).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-700">
                    <span>TOTAL Bs.</span>
                    <span>Bs. {(totalBS + (igtf * tasaBCV)).toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-green-600 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-green-200 hover:bg-green-700 transition uppercase tracking-widest">
                    Procesar Venta
                  </button>
                </div>
              </div>
            </div>
          )}

          {vista === 'Inventario' && usuario.rol === 'Administrador' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Control de Almacén (Kilogramos)</h3>
                <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition text-sm">
                  + Registrar Carga
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-tighter">
                  <tr>
                    <th className="px-6 py-4">Producto</th>
                    <th className="px-6 py-4 text-center">Stock Actual</th>
                    <th className="px-6 py-4 text-center">Merma Est.</th>
                    <th className="px-6 py-4">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productos.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-bold text-gray-700">{p.nombre}</td>
                      <td className="px-6 py-4 text-center font-black">{p.stockKG.toFixed(2)} kg</td>
                      <td className="px-6 py-4 text-center text-red-500 font-medium">{(p.stockKG * 0.05).toFixed(2)} kg</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${p.stockKG < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {p.stockKG < 5 ? 'Escaso' : 'Disponible'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
