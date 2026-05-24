import React from 'react';
import { ShoppingCart, Package, LayoutDashboard, Settings, BarChart3, TrendingUp, AlertTriangle, Menu, X, Plus, RefreshCw, Trash2, CheckCircle2, Download, Search } from 'lucide-react';

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

interface Venta {
  id: string;
  fecha: Date;
  items: ItemCarrito[];
  totalUSD: number;
  totalBS: number;
}

// --- Componente Principal ---
const App: React.FC = () => {
  const [tasaBCV] = React.useState(36.50);
  const [usuario] = React.useState<Usuario>({ username: 'Administrador', rol: 'Administrador' });
  const [vista, setVista] = React.useState<'Dashboard' | 'Ventas' | 'Inventario' | 'Reportes'>('Ventas');
  const [carrito, setCarrito] = React.useState<ItemCarrito[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  // Estado Dinámico
  const [productos, setProductos] = React.useState<Producto[]>([
    { id: '1', nombre: 'Papa Granola', precioUSD: 1.20, stockKG: 50, categoria: 'Verduras' },
    { id: '2', nombre: 'Tomate Perita', precioUSD: 1.50, stockKG: 4, categoria: 'Verduras' },
    { id: '3', nombre: 'Cambur', precioUSD: 0.80, stockKG: 20, categoria: 'Frutas' },
    { id: '4', nombre: 'Cebolla Blanca', precioUSD: 0.90, stockKG: 15, categoria: 'Verduras' },
    { id: '5', nombre: 'Manzana Roja', precioUSD: 2.50, stockKG: 12, categoria: 'Frutas' },
    { id: '6', nombre: 'Zanahoria', precioUSD: 0.75, stockKG: 30, categoria: 'Verduras' },
    { id: '7', nombre: 'Pimentón', precioUSD: 1.80, stockKG: 8, categoria: 'Verduras' },
    { id: '8', nombre: 'Limón', precioUSD: 1.10, stockKG: 25, categoria: 'Frutas' },
    { id: '9', nombre: 'Aguacate', precioUSD: 3.20, stockKG: 10, categoria: 'Verduras' },
    { id: '10', nombre: 'Piña', precioUSD: 1.50, stockKG: 15, categoria: 'Frutas' },
    { id: '11', nombre: 'Ajo', precioUSD: 4.50, stockKG: 5, categoria: 'Verduras' },
    { id: '12', nombre: 'Patilla', precioUSD: 0.40, stockKG: 100, categoria: 'Frutas' },
    { id: '13', nombre: 'Cebollín', precioUSD: 0.60, stockKG: 20, categoria: 'Verduras' },
    { id: '14', nombre: 'Lechosa', precioUSD: 0.95, stockKG: 40, categoria: 'Frutas' },
  ]);
  const [ventas, setVentas] = React.useState<Venta[]>([]);
  const [busqueda, setBusqueda] = React.useState('');
  const [notificacion, setNotificacion] = React.useState<{tipo: 'success' | 'error', msg: string} | null>(null);
  
  // Modales
  const [showModalProd, setShowModalProd] = React.useState(false);
  const [nuevoProd, setNuevoProd] = React.useState({ nombre: '', precio: '', stock: '', cat: 'Verduras' as const });

  // Derivados de Carrito
  const totalUSD = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const igtf = totalUSD * 0.03;
  const totalFinalUSD = totalUSD + igtf;
  const totalBS = totalFinalUSD * tasaBCV;

  // --- Lógica de Negocio ---
  
  const showNotif = (tipo: 'success' | 'error', msg: string) => {
    setNotificacion({ tipo, msg });
    setTimeout(() => setNotificacion(null), 3000);
  };

  const handleProcesarVenta = () => {
    if (carrito.length === 0) return;
    
    for (const item of carrito) {
      const prod = productos.find(p => p.id === item.id);
      if (!prod || prod.stockKG < item.peso) {
        showNotif('error', `Stock insuficiente para ${item.nombre}`);
        return;
      }
    }

    const nuevaVenta: Venta = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      fecha: new Date(),
      items: [...carrito],
      totalUSD: totalFinalUSD,
      totalBS: totalBS
    };

    const nuevosProductos = productos.map(p => {
      const itemVendido = carrito.find(item => item.id === p.id);
      return itemVendido ? { ...p, stockKG: p.stockKG - itemVendido.peso } : p;
    });

    setVentas([nuevaVenta, ...ventas]);
    setProductos(nuevosProductos);
    setCarrito([]);
    showNotif('success', 'Venta procesada con éxito');
  };

  const handleReponerStock = (id: string, cantidad: number) => {
    setProductos(productos.map(p => p.id === id ? { ...p, stockKG: p.stockKG + cantidad } : p));
    showNotif('success', 'Stock actualizado');
  };

  const saveNuevoProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoProd.nombre || !nuevoProd.precio || !nuevoProd.stock) return;
    
    const nuevo: Producto = {
      id: Date.now().toString(),
      nombre: nuevoProd.nombre,
      precioUSD: parseFloat(nuevoProd.precio),
      stockKG: parseFloat(nuevoProd.stock),
      categoria: nuevoProd.cat as any
    };
    
    setProductos([...productos, nuevo]);
    setShowModalProd(false);
    setNuevoProd({ nombre: '', precio: '', stock: '', cat: 'Verduras' });
    showNotif('success', 'Producto registrado');
  };

  const handleGenerarReporte = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ticket,Fecha,Total USD,Total BS,Items\n"
      + ventas.map(v => `${v.id},${v.fecha.toLocaleString()},${v.totalUSD.toFixed(2)},${v.totalBS.toFixed(2)},"${v.items.map(i => i.nombre).join(' | ')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_ventas_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    showNotif('success', 'Reporte generado y descargado');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const selectVista = (v: any) => {
    setVista(v);
    setIsSidebarOpen(false);
  };

  // Métricas Dashboard
  const ventasHoy = ventas.reduce((sum, v) => sum + v.totalUSD, 0);
  const alertasStock = productos.filter(p => p.stockKG < 10);

  // --- Aplicación Principal ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans relative overflow-hidden">
      {/* Notificaciones */}
      {notificacion && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-pulse ${notificacion.tipo === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {notificacion.tipo === 'success' ? <CheckCircle2 /> : <AlertTriangle />}
          <span className="font-bold">{notificacion.msg}</span>
        </div>
      )}

      {/* Modal Nuevo Producto */}
      {showModalProd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-green-800 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Registrar Producto</h3>
              <button onClick={() => setShowModalProd(false)}><X /></button>
            </div>
            <form onSubmit={saveNuevoProducto} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600">Nombre del Producto</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" 
                  value={nuevoProd.nombre} onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-600">Precio USD</label>
                  <input required type="number" step="0.01" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    value={nuevoProd.precio} onChange={e => setNuevoProd({...nuevoProd, precio: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-600">Stock Inicial (KG)</label>
                  <input required type="number" step="0.1" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                    value={nuevoProd.stock} onChange={e => setNuevoProd({...nuevoProd, stock: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-600">Categoría</label>
                <select className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  value={nuevoProd.cat} onChange={e => setNuevoProd({...nuevoProd, cat: e.target.value as any})}>
                  <option value="Verduras">Verduras</option>
                  <option value="Frutas">Frutas</option>
                  <option value="Viveres">Viveres</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition mt-4">
                Guardar Producto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleSidebar} />
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
        <nav className="flex-1 mt-4">
          <button onClick={() => selectVista('Dashboard')} className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Dashboard' ? 'bg-green-700 border-r-4 border-white' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          <button onClick={() => selectVista('Ventas')} className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Ventas' ? 'bg-green-700 border-r-4 border-white' : ''}`}>
            <ShoppingCart size={20} /> Ventas (POS)
          </button>

          <button onClick={() => selectVista('Inventario')} className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Inventario' ? 'bg-green-700 border-r-4 border-white' : ''}`}>
            <Package size={20} /> Inventario
          </button>

          <button onClick={() => selectVista('Reportes')} className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-green-700 transition ${vista === 'Reportes' ? 'bg-green-700 border-r-4 border-white' : ''}`}>
            <BarChart3 size={20} /> Reportes
          </button>
        </nav>
        <div className="p-4 border-t border-green-700">
          <div className="text-xs text-green-300 mb-2">Usuario: {usuario.username}</div>
          <button className="flex items-center gap-3 text-green-300 hover:text-white transition w-full py-2 text-sm">
            <Settings size={18} /> Configuración
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 uppercase tracking-tight">{vista}</h1>
          </div>
          <div className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 text-green-800 font-bold text-xs lg:text-sm">
            Tasa BCV: {tasaBCV.toFixed(2)} Bs/$
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-gray-100">
          {/* VISTA DASHBOARD */}
          {vista === 'Dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 font-medium">Ventas Hoy</span>
                    <TrendingUp className="text-green-500" />
                  </div>
                  <div className="text-3xl font-black text-gray-800">$ {ventasHoy.toFixed(2)}</div>
                  <div className="text-sm text-gray-400 mt-1">Total acumulado en 24h</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 font-medium">Alertas de Stock</span>
                    <AlertTriangle className="text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-gray-800">{alertasStock.length}</div>
                  <div className="text-sm text-amber-600 font-bold mt-1">Productos con stock bajo</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 font-medium">Operaciones</span>
                    <ShoppingCart className="text-blue-500" />
                  </div>
                  <div className="text-3xl font-black text-gray-800">{ventas.length}</div>
                  <div className="text-sm text-gray-400 mt-1">Facturas emitidas hoy</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Productos Críticos</h3>
                <div className="space-y-3">
                  {alertasStock.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <span className="font-bold text-red-800">{p.nombre}</span>
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black">{p.stockKG.toFixed(2)} KG</span>
                    </div>
                  ))}
                  {alertasStock.length === 0 && <div className="text-gray-400 italic text-center">Todo el inventario está en niveles óptimos.</div>}
                </div>
              </div>
            </div>
          )}

          {/* VISTA VENTAS (POS) */}
          {vista === 'Ventas' && (
            <div className="flex flex-col xl:flex-row gap-8 h-full">
              <div className="flex-1 space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Buscar producto..." 
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                  </div>
                  <button onClick={() => setCarrito([])} className="w-full md:w-auto px-6 py-2 bg-red-50 text-red-600 font-black rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2 border border-red-100">
                    <Trash2 size={18} /> Nueva Venta
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
                    <button 
                      key={p.id}
                      disabled={p.stockKG <= 0}
                      onClick={() => {
                        const itemExistente = carrito.find(item => item.id === p.id);
                        if (itemExistente) {
                          setCarrito(carrito.map(item => item.id === p.id ? {...item, peso: item.peso + 1, subtotal: (item.peso + 1) * p.precioUSD} : item));
                        } else {
                          setCarrito([...carrito, {...p, peso: 1, subtotal: p.precioUSD}]);
                        }
                      }}
                      className={`p-4 rounded-xl shadow-sm border transition text-left relative group ${p.stockKG <= 0 ? 'bg-gray-50 opacity-50 cursor-not-allowed' : 'bg-white hover:border-green-500 hover:shadow-md'}`}
                    >
                      <div className="text-[10px] font-bold text-green-600 mb-1 uppercase">{p.categoria}</div>
                      <div className="font-bold text-gray-800 truncate">{p.nombre}</div>
                      <div className="text-xl font-black text-gray-900 mt-2">$ {p.precioUSD.toFixed(2)}</div>
                      <div className={`text-xs mt-1 font-bold ${p.stockKG < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                        Disp: {p.stockKG.toFixed(2)} kg
                      </div>
                      {p.stockKG <= 0 && <div className="absolute inset-0 flex items-center justify-center bg-white/80 font-black text-red-600 rotate-12">AGOTADO</div>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full xl:w-96 bg-white rounded-xl shadow-xl border flex flex-col shrink-0 overflow-hidden min-h-[500px]">
                <div className="p-6 bg-gray-50 border-b font-black text-lg text-gray-800 flex justify-between items-center">
                  <span>CARRITO DE VENTA</span>
                  <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">{carrito.length} items</div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {carrito.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                      <ShoppingCart size={48} className="mb-2 opacity-20" />
                      Carrito vacío
                    </div>
                  ) : (
                    carrito.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-sm truncate">{item.nombre}</div>
                          <div className="text-[10px] text-gray-400 uppercase">{item.peso.toFixed(3)} kg x $ {item.precioUSD.toFixed(2)}</div>
                        </div>
                        <div className="font-black text-gray-800">$ {item.subtotal.toFixed(2)}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-6 bg-green-800 text-white space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs opacity-80">
                      <span>Subtotal</span>
                      <span>$ {totalUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>IGTF (3%)</span>
                      <span>$ {igtf.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black pt-2 border-t border-green-700">
                      <span>TOTAL $</span>
                      <span>$ {totalFinalUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-amber-300 font-bold">
                      <span>TOTAL Bs.</span>
                      <span>Bs. {totalBS.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleProcesarVenta}
                    disabled={carrito.length === 0}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-green-900 font-black py-4 rounded-xl transition shadow-lg uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Procesar Venta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VISTA INVENTARIO */}
          {vista === 'Inventario' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-xl text-gray-800">Control de Existencias</h3>
                <button 
                  onClick={() => setShowModalProd(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg"
                >
                  <Plus size={20} /> Nuevo Producto
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Producto</th>
                      <th className="px-6 py-4">Categoría</th>
                      <th className="px-6 py-4 text-center">Precio USD</th>
                      <th className="px-6 py-4 text-center">Stock</th>
                      <th className="px-6 py-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {productos.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-bold text-gray-700">{p.nombre}</td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-500">{p.categoria}</td>
                        <td className="px-6 py-4 text-center font-black">$ {p.precioUSD.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${p.stockKG < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {p.stockKG.toFixed(2)} kg
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleReponerStock(p.id, 10)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Reponer 10kg"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA REPORTES */}
          {vista === 'Reportes' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h3 className="font-bold text-xl text-gray-800">Historial de Ventas</h3>
                  <button 
                    onClick={handleGenerarReporte}
                    disabled={ventas.length === 0}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Download size={20} /> Generar Reporte CSV
                  </button>
                </div>
                <div className="space-y-4">
                  {ventas.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 italic">No hay ventas registradas para el reporte.</div>
                  ) : (
                    ventas.map(v => (
                      <div key={v.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition">
                        <div>
                          <div className="font-black text-gray-800 text-sm flex items-center gap-2">
                            <span className="text-green-600">TICKET #{v.id}</span>
                          </div>
                          <div className="text-xs text-gray-400 font-bold">{v.fecha.toLocaleString()}</div>
                          <div className="text-xs mt-2 text-gray-600 bg-white p-2 rounded border inline-block">
                            <span className="font-bold">Items:</span> {v.items.map(i => i.nombre).join(', ')}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xl font-black text-green-700">$ {v.totalUSD.toFixed(2)}</div>
                          <div className="text-xs text-gray-500 font-bold uppercase">Bs. {v.totalBS.toFixed(2)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;