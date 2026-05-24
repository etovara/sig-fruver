import React from 'react';
import { ShoppingCart, Package, LayoutDashboard, Settings, BarChart3, TrendingUp, AlertTriangle, Menu, X } from 'lucide-react';

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
  const [usuario] = React.useState<Usuario>({ username: 'Administrador', rol: 'Administrador' });
  const [vista, setVista] = React.useState<'Dashboard' | 'Ventas' | 'Inventario'>('Ventas');
  const [carrito, setCarrito] = React.useState<ItemCarrito[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Datos de ejemplo
  const productos: Producto[] = [
    { id: '1', nombre: 'Papa Granola', precioUSD: 1.20, stockKG: 50, categoria: 'Verduras' },
    { id: '2', nombre: 'Tomate Perita', precioUSD: 1.50, stockKG: 4, categoria: 'Verduras' },
    { id: '3', nombre: 'Cambur', precioUSD: 0.80, stockKG: 20, categoria: 'Frutas' },
    { id: '4', nombre: 'Cebolla Blanca', precioUSD: 0.90, stockKG: 15, categoria: 'Verduras' },
  ];

  const totalUSD = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const totalBS = totalUSD * tasaBCV;
  const igtf = totalUSD * 0.03;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const selectVista = (v: 'Dashboard' | 'Ventas' | 'Inventario') => {
    setVista(v);
    setIsSidebarOpen(false);
  };

  // --- Aplicación Principal ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans relative overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-green-800 text-white flex flex-col shadow-xl z-40 transition-transform duration-300 lg:translate-x-0 lg:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 text-2xl font-bold flex items-center justify-between border-b border-green-700">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🥬</span> SIG-FRUVER
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-white/70 hover:text-white">
            <X size={24} />
          </button>
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
              onClick={() => selectVista('Dashboard')}
              className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Dashboard' ? 'bg-green-700 border-r-4 border-white' : ''}`}
            >
              <LayoutDashboard size={20} /> Dashboard
            </button>
          )}
          
          <button 
            onClick={() => selectVista('Ventas')}
            className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Ventas' ? 'bg-green-700 border-r-4 border-white' : ''}`}
          >
            <ShoppingCart size={20} /> Ventas (POS)
          </button>

          {usuario.rol === 'Administrador' && (
            <>
              <button 
                onClick={() => selectVista('Inventario')}
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
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{vista}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg border border-green-200 text-green-800 font-medium text-xs lg:text-base">
              Tasa: <span className="font-bold">{tasaBCV.toFixed(2)} Bs</span>
            </div>
          </div>
        </header>

        {/* Vistas Dinámicas */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-gray-100">
          {vista === 'Dashboard' && usuario.rol === 'Administrador' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2 xl:col-span-1">
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
            <div className="flex flex-col xl:flex-row gap-8 h-full">
              {/* Catálogo */}
              <div className="flex-1 space-y-6 min-w-0">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-full"
                  />
                  <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white w-full sm:w-auto">
                    <option>Todas las categorías</option>
                    <option>Frutas</option>
                    <option>Verduras</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <div className="font-bold text-gray-800 truncate">{p.nombre}</div>
                      <div className="text-lg text-gray-900 mt-2 font-black">$ {p.precioUSD.toFixed(2)}</div>
                      <div className={`text-xs mt-1 ${p.stockKG < 5 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                        Quedan: {p.stockKG} kg
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Factura */}
              <div className="w-full xl:w-96 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col shrink-0 overflow-hidden h-[500px] xl:h-auto">
                <div className="p-6 border-b border-gray-100 font-black text-lg text-gray-800 flex justify-between shrink-0">
                  <span>FACTURA</span>
                  <ShoppingCart className="text-green-600" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {carrito.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 italic">
                      <ShoppingCart size={48} className="mb-2" />
                      Esperando productos...
                    </div>
                  ) : (
                    carrito.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-gray-800 text-sm truncate">{item.nombre}</div>
                          <div className="text-[10px] text-gray-500 uppercase">{item.peso.toFixed(3)} kg x $ {item.precioUSD.toFixed(2)}</div>
                        </div>
                        <div className="font-black text-gray-800 shrink-0">$ {item.subtotal.toFixed(2)}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-6 bg-green-50 border-t border-green-100 space-y-3 shrink-0">
                  <div className="flex justify-between text-xl lg:text-2xl font-black text-gray-900">
                    <span>TOTAL $</span>
                    <span>$ {(totalUSD + igtf).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base lg:text-lg font-bold text-green-700">
                    <span>TOTAL Bs.</span>
                    <span>Bs. {(totalBS + (igtf * tasaBCV)).toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-green-600 text-white font-black py-4 rounded-xl mt-4 shadow-lg shadow-green-200 hover:bg-green-700 transition uppercase tracking-widest text-sm">
                    Procesar Venta
                  </button>
                </div>
              </div>
            </div>
          )}

          {vista === 'Inventario' && usuario.rol === 'Administrador' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-gray-800">Control de Almacén (KG)</h3>
                <button className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition text-sm">
                  + Carga
                </button>
              </div>
              <div className="min-w-[600px]">
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
