/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, ShoppingCart, Clock, CheckCircle2, LayoutDashboard, ChevronRight, Plus, Minus, ArrowRight, UserPlus, Users, Key, Mail, User as UserIcon, Shield, ArrowLeft } from 'lucide-react';
import { MENU_DATA, Product, Order, OrderStatus, User, UserRole } from './types';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'coffee' | 'bakery' | 'breakfast'>('all');
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [view, setView] = useState<'home' | 'menu' | 'kanban' | 'users' | 'auth'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(MENU_DATA);

  // Access Control Redirection
  React.useEffect(() => {
    if (currentUser?.tipo_usuario === 'cliente' && (view === 'users' || view === 'kanban')) {
      setView('menu');
    }
  }, [view, currentUser]);

  const [users, setUsers] = useState<User[]>([
    { id: '1', nombre_usuario: 'Admin_Mon', tipo_usuario: 'admin', correo_electronico: 'admin@moncafe.com', contrasena: '****' }
  ]);
  
  // Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'coffee' as Product['category'],
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=400'
  });

  // Registration Form State
  const [regForm, setRegForm] = useState({
    nombre_usuario: '',
    tipo_usuario: 'cliente' as UserRole,
    correo_electronico: '',
    contrasena: ''
  });

  const filteredProducts = useMemo(() => {
    return activeCategory === 'all' 
      ? products 
      : products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || productForm.price <= 0) return;

    const newProduct: Product = {
      id: `P-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...productForm
    };

    setProducts([...products, newProduct]);
    setShowAddProduct(false);
    setProductForm({
      name: '',
      description: '',
      price: 0,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=400'
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.nombre_usuario || !regForm.correo_electronico || !regForm.contrasena) return;
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      ...regForm
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setView('menu');
    setRegForm({
      nombre_usuario: '',
      tipo_usuario: 'cliente',
      correo_electronico: '',
      contrasena: ''
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
    setCart([]);
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing?.quantity === 1) return prev.filter(i => i.productId !== productId);
      return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  }, [cart, products]);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      items: [...cart],
      total: cartTotal,
      status: 'received',
      timestamp: Date.now()
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('kanban');
  };

  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  return (
    <div className="min-h-screen bg-coffee-50 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] overflow-x-hidden">
      {/* Navigation (Only shown when not on Home) */}
      {view !== 'home' && view !== 'auth' && (
        <nav className="sticky top-0 z-50 glass-panel px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-coffee-900 rounded-full flex items-center justify-center text-white">
              <Coffee size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Mon café</h1>
              <p className="text-[10px] uppercase tracking-widest text-coffee-600 opacity-70">L'art du café</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {currentUser && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-coffee-100 rounded-full">
                <div className="w-6 h-6 bg-coffee-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {currentUser.nombre_usuario.charAt(0)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter">{currentUser.nombre_usuario}</span>
              </div>
            )}
            <button 
              onClick={() => setView('menu')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${view === 'menu' ? 'text-coffee-900' : 'text-coffee-600 opacity-60'}`}
            >
              Menú
            </button>
            {currentUser?.tipo_usuario !== 'cliente' && (
              <>
                <button 
                  onClick={() => setView('kanban')}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${view === 'kanban' ? 'text-coffee-900' : 'text-coffee-600 opacity-60'}`}
                >
                  Sistema
                </button>
                <button 
                  onClick={() => setView('users')}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${view === 'users' ? 'text-coffee-900' : 'text-coffee-600 opacity-60'}`}
                >
                  Usuarios
                </button>
              </>
            )}
            <div className="w-px h-4 bg-coffee-200" />
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black text-red-500 uppercase hover:underline"
            >
              Salir
            </button>
            <button className="relative p-2 text-coffee-900">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-coffee-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </nav>
      )}

      <main className={`${view === 'home' ? '' : 'max-w-7xl mx-auto p-6'}`}>
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative min-h-screen flex items-center justify-center bg-coffee-900"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1442557870500-f925fac90954?auto=format&fit=crop&q=80&w=1600" 
                  alt="Background" 
                  className="w-full h-full object-cover opacity-30 grayscale saturate-50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/40 via-transparent to-coffee-900" />
              </div>
              
              <div className="relative z-10 text-center space-y-8 px-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white mb-8 border border-white/20">
                    <Coffee size={48} />
                  </div>
                  <h1 className="text-8xl md:text-9xl font-serif text-white tracking-tight mb-2">Mon café</h1>
                  <div className="h-px w-32 bg-coffee-600 my-4" />
                  <p className="text-coffee-200 text-lg md:text-xl font-light tracking-[0.2em] uppercase">Especialidad & Sistemas</p>
                </motion.div>

                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setView(currentUser ? 'menu' : 'auth')}
                  className="group relative bg-white text-coffee-900 px-12 py-5 rounded-full text-xl font-bold transition-all hover:bg-coffee-100 hover:pr-16 active:scale-95 shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10">IR AL MENÚ</span>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight size={24} />
                  </div>
                </motion.button>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-12 left-12 flex gap-4">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
                <div className="w-4 h-1 bg-white/20 rounded-full" />
                <div className="w-4 h-1 bg-white/20 rounded-full" />
              </div>
            </motion.div>
          ) : view === 'auth' ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center p-6 bg-coffee-50"
            >
              <div className="max-w-md w-full relative">
                {/* Botón Atrás */}
                <button 
                  onClick={() => setView('home')}
                  className="absolute -top-16 left-0 flex items-center gap-2 text-coffee-600 font-bold text-xs uppercase tracking-widest hover:text-coffee-900 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <ArrowLeft size={16} />
                  </div>
                  Atrás
                </button>

                <div className="bg-white p-12 rounded-[48px] card-shadow border-2 border-coffee-200/20">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-16 h-16 bg-coffee-900 rounded-full flex items-center justify-center text-white mb-6">
                    <Coffee size={32} />
                  </div>
                  <h2 className="text-4xl font-serif mb-2">Bienvenido</h2>
                  <p className="text-coffee-400 font-light text-sm">Regístrate para entrar a la experiencia Mon café</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-coffee-600 ml-1">Nombre de Usuario</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                        <input 
                          required
                          type="text" 
                          placeholder="Tu nombre o apodo"
                          className="w-full pl-12 pr-4 py-4 bg-coffee-50/50 border-2 border-transparent focus:border-coffee-900 rounded-2xl outline-none transition-all text-sm font-medium"
                          value={regForm.nombre_usuario}
                          onChange={(e) => setRegForm({...regForm, nombre_usuario: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-coffee-600 ml-1">Correo Electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                        <input 
                          required
                          type="email" 
                          placeholder="email@ejemplo.com"
                          className="w-full pl-12 pr-4 py-4 bg-coffee-50/50 border-2 border-transparent focus:border-coffee-900 rounded-2xl outline-none transition-all text-sm font-medium"
                          value={regForm.correo_electronico}
                          onChange={(e) => setRegForm({...regForm, correo_electronico: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-coffee-600 ml-1">Contraseña</label>
                      <div className="relative">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                        <input 
                          required
                          type="password" 
                          placeholder="••••••••"
                          className="w-full pl-12 pr-4 py-4 bg-coffee-50/50 border-2 border-transparent focus:border-coffee-900 rounded-2xl outline-none transition-all text-sm font-medium"
                          value={regForm.contrasena}
                          onChange={(e) => setRegForm({...regForm, contrasena: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-coffee-600 ml-1">¿Cómo entras?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['cliente', 'barista', 'admin'] as UserRole[]).map(role => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setRegForm({...regForm, tipo_usuario: role})}
                            className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                              regForm.tipo_usuario === role 
                                ? 'bg-coffee-900 text-white border-coffee-900 shadow-lg' 
                                : 'bg-white text-coffee-400 border-coffee-100 hover:border-coffee-200'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-coffee-900 text-white py-5 rounded-3xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-coffee-900/30 mt-6"
                    >
                      COMENZAR
                    </button>
                    
                    <p className="text-center text-[10px] text-coffee-400 font-medium">
                      Al continuar aceptas los términos de Mon café Co.
                    </p>
                </form>
              </div>
              </div>
            </motion.div>
          ) : view === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 mt-8"
            >
              {/* Hero (Reduced) */}
              <section className="relative h-[200px] rounded-[32px] overflow-hidden card-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200" 
                  alt="Coffee ambiance" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-coffee-900/80 to-transparent flex flex-col justify-center px-12 text-white">
                  <h2 className="text-4xl font-serif mb-2">Nuestro Menú</h2>
                  <p className="max-w-md text-sm opacity-80 leading-relaxed font-light">
                    Selección artesanal curada por nuestros baristas.
                  </p>
                </div>
              </section>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-8">
                  <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
                    <div className="flex items-center gap-4">
                      {(['all', 'coffee', 'bakery', 'breakfast'] as const).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
                            activeCategory === cat 
                              ? 'bg-coffee-900 text-white shadow-lg' 
                              : 'bg-white text-coffee-600 hover:bg-coffee-100'
                          }`}
                        >
                          {cat === 'all' ? 'Todos' : cat}
                        </button>
                      ))}
                    </div>

                    {currentUser?.tipo_usuario === 'admin' && (
                      <button 
                        onClick={() => setShowAddProduct(true)}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Plus size={16} />
                        Nuevo Producto
                      </button>
                    )}
                  </div>

                  {/* Add Product Modal Overlay */}
                  <AnimatePresence>
                    {showAddProduct && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-coffee-900/40 backdrop-blur-sm"
                      >
                        <motion.div 
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 20 }}
                          className="bg-white w-full max-w-lg rounded-[40px] p-8 card-shadow border border-coffee-100"
                        >
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold">Añadir al Menú</h3>
                            <button onClick={() => setShowAddProduct(false)} className="text-coffee-300 hover:text-coffee-900">
                              <Plus className="rotate-45" size={24} />
                            </button>
                          </div>

                          <form onSubmit={handleAddProduct} className="space-y-5">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-coffee-400">Nombre del Producto</label>
                              <input 
                                required
                                type="text"
                                className="w-full bg-coffee-50 px-4 py-3 rounded-xl outline-none focus:ring-2 ring-coffee-900/10"
                                value={productForm.name}
                                onChange={e => setProductForm({...productForm, name: e.target.value})}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-coffee-400">Precio ($)</label>
                                <input 
                                  required
                                  type="number"
                                  className="w-full bg-coffee-50 px-4 py-3 rounded-xl outline-none focus:ring-2 ring-coffee-900/10"
                                  value={productForm.price}
                                  onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-coffee-400">Categoría</label>
                                <select 
                                  className="w-full bg-coffee-50 px-4 py-3 rounded-xl outline-none focus:ring-2 ring-coffee-900/10 text-sm"
                                  value={productForm.category}
                                  onChange={e => setProductForm({...productForm, category: e.target.value as Product['category']})}
                                >
                                  <option value="coffee">Café</option>
                                  <option value="bakery">Panadería</option>
                                  <option value="breakfast">Desayuno</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-coffee-400">Descripción Corta</label>
                              <textarea 
                                className="w-full bg-coffee-50 px-4 py-3 rounded-xl outline-none focus:ring-2 ring-coffee-900/10 h-20 resize-none text-sm"
                                value={productForm.description}
                                onChange={e => setProductForm({...productForm, description: e.target.value})}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase tracking-widest text-coffee-400">URL de Imagen</label>
                              <input 
                                type="text"
                                className="w-full bg-coffee-50 px-4 py-3 rounded-xl outline-none focus:ring-2 ring-coffee-900/10 text-xs"
                                value={productForm.image}
                                onChange={e => setProductForm({...productForm, image: e.target.value})}
                              />
                            </div>
                            <button className="w-full bg-coffee-900 text-white py-4 rounded-2xl font-black mt-4 shadow-xl shadow-coffee-900/20 active:scale-95 transition-all">
                              GUARDAR PRODUCTO
                            </button>
                          </form>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredProducts.map(product => (
                      <motion.div
                        layout
                        key={product.id}
                        className="bg-white rounded-[32px] overflow-hidden card-shadow group flex flex-col sm:flex-row h-full"
                      >
                        <div className="relative w-full sm:w-40 h-40 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="text-lg font-bold">{product.name}</h3>
                              <span className="text-sm font-bold text-coffee-900 bg-coffee-50 px-2 py-0.5 rounded-lg">${product.price}</span>
                            </div>
                            <p className="text-xs text-coffee-600 font-light line-clamp-2">{product.description}</p>
                          </div>
                          <button 
                            onClick={() => addToCart(product.id)}
                            className="mt-4 flex items-center justify-center gap-2 bg-coffee-100 text-coffee-900 py-2.5 rounded-xl text-xs font-bold transition-colors hover:bg-coffee-900 hover:text-white"
                          >
                            <Plus size={14} />
                            Agregar
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <aside className="w-full lg:w-96">
                  <div className="glass-panel rounded-[32px] p-8 card-shadow sticky top-28 border-2 border-coffee-200/30">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                      <div className="p-2 bg-coffee-900 text-white rounded-xl">
                        <ShoppingCart size={20} />
                      </div>
                      Tu Selección
                    </h3>
                    
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {cart.length === 0 ? (
                        <div className="py-12 text-center space-y-4">
                          <div className="w-16 h-16 bg-coffee-50 rounded-full flex items-center justify-center mx-auto text-coffee-200">
                            <ShoppingCart size={32} />
                          </div>
                          <p className="text-sm text-coffee-400 font-medium">Empieza a añadir deliciosas opciones</p>
                        </div>
                      ) : (
                        cart.map(item => {
                          const p = products.find(product => product.id === item.productId);
                          return (
                            <div key={item.productId} className="flex items-center justify-between gap-4 group">
                              <div className="flex-1">
                                <p className="text-sm font-bold group-hover:text-coffee-600 transition-colors uppercase tracking-tight">{p?.name}</p>
                                <p className="text-xs text-coffee-500">${p?.price} c/u</p>
                              </div>
                              <div className="flex items-center gap-3 bg-coffee-50 p-2 rounded-xl">
                                <button onClick={() => removeFromCart(item.productId)} className="text-coffee-400 hover:text-coffee-900 transition-colors"><Minus size={14} /></button>
                                <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                <button onClick={() => addToCart(item.productId)} className="text-coffee-400 hover:text-coffee-900 transition-colors"><Plus size={14} /></button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="mt-10 pt-8 border-t-2 border-coffee-100 space-y-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-coffee-400 font-bold mb-1">Total a Pagar</p>
                          <span className="text-3xl font-serif font-black text-coffee-900">${cartTotal}</span>
                        </div>
                      </div>
                      <button 
                        disabled={cart.length === 0}
                        onClick={placeOrder}
                        className="w-full bg-coffee-900 text-white py-5 rounded-[22px] font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 shadow-2xl shadow-coffee-900/40"
                      >
                        PEDIR AHORA
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          ) : (view === 'users' && currentUser?.tipo_usuario !== 'cliente') ? (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 mt-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h2 className="text-4xl">Gestión de Usuarios</h2>
                  <p className="text-coffee-600 font-light italic">Registro y control de acceso al sistema Mon café</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white px-6 py-3 rounded-2xl card-shadow border border-coffee-100 flex items-center gap-3">
                    <Users className="text-coffee-600" size={20} />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-coffee-400">Total Usuarios</p>
                      <p className="text-xl font-bold leading-none">{users.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Registration Form */}
                <div className="lg:col-span-1">
                  <div className="glass-panel p-8 rounded-[40px] card-shadow border-2 border-coffee-200/20">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-coffee-900 text-white rounded-xl">
                        <UserPlus size={24} />
                      </div>
                      <h3 className="text-2xl font-bold">Nuevo Registro</h3>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-coffee-600 ml-1">Nombre de Usuario</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                          <input 
                            type="text" 
                            placeholder="Ej. barista_zero"
                            className="w-full pl-12 pr-4 py-4 bg-coffee-50 border-2 border-transparent focus:border-coffee-900 rounded-2xl outline-none transition-all text-sm font-medium"
                            value={regForm.nombre_usuario}
                            onChange={(e) => setRegForm({...regForm, nombre_usuario: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-coffee-600 ml-1">Correo Electrónico</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                          <input 
                            type="email" 
                            placeholder="correo@ejemplo.com"
                            className="w-full pl-12 pr-4 py-4 bg-coffee-50 border-2 border-transparent focus:border-coffee-900 rounded-2xl outline-none transition-all text-sm font-medium"
                            value={regForm.correo_electronico}
                            onChange={(e) => setRegForm({...regForm, correo_electronico: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-coffee-600 ml-1">Contraseña</label>
                        <div className="relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-300" size={18} />
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-coffee-50 border-2 border-transparent focus:border-coffee-900 rounded-2xl outline-none transition-all text-sm font-medium"
                            value={regForm.contrasena}
                            onChange={(e) => setRegForm({...regForm, contrasena: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-coffee-600 ml-1">Tipo de Usuario</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['cliente', 'barista', 'admin'] as UserRole[]).map(role => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setRegForm({...regForm, tipo_usuario: role})}
                              className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2 ${
                                regForm.tipo_usuario === role 
                                  ? 'bg-coffee-900 text-white border-coffee-900' 
                                  : 'bg-white text-coffee-400 border-coffee-100 hover:border-coffee-200'
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-coffee-900 text-white py-5 rounded-[22px] font-black text-lg shadow-xl shadow-coffee-900/20 active:scale-95 transition-all mt-4"
                      >
                        REGISTRAR AHORA
                      </button>
                    </form>
                  </div>
                </div>

                {/* User Table */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-[40px] card-shadow overflow-hidden border border-coffee-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-coffee-900 text-white">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Usuario</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Tipo</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Contacto</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-coffee-50">
                          {users.map(user => (
                            <motion.tr 
                              key={user.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-coffee-50 transition-colors"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-coffee-100 rounded-full flex items-center justify-center text-coffee-600 font-bold uppercase">
                                    {user.nombre_usuario.charAt(0)}
                                  </div>
                                  <span className="font-bold text-coffee-900">{user.nombre_usuario}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <Shield size={14} className={user.tipo_usuario === 'admin' ? 'text-red-500' : user.tipo_usuario === 'barista' ? 'text-amber-500' : 'text-coffee-400'} />
                                  <span className="text-[10px] font-black uppercase bg-coffee-50 px-2 py-1 rounded text-coffee-600 tracking-tighter">
                                    {user.tipo_usuario}
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-xs text-coffee-500 font-medium">{user.correo_electronico}</span>
                              </td>
                              <td className="px-8 py-6">
                                <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                  ACTIVO
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (view === 'kanban' && currentUser?.tipo_usuario !== 'cliente') ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 mt-8"
            >
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-4xl">Sistema Logístico</h2>
                  <p className="text-coffee-600 font-light">Monitoreo de órdenes en tiempo real</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest bg-coffee-900 text-white px-4 py-2 rounded-full font-bold shadow-lg">LIVE MONITOR</span>
                </div>
              </div>

              {/* Kanban Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
                {(['received', 'brewing', 'ready', 'delivered'] as OrderStatus[]).map(status => (
                  <div key={status} className="bg-coffee-100/30 rounded-[40px] p-5 flex flex-col gap-4 border-2 border-coffee-200/20 backdrop-blur-sm">
                    <header className="px-4 py-3 flex items-center justify-between bg-white rounded-2xl shadow-sm">
                      <h4 className="capitalize font-black text-xs tracking-widest flex items-center gap-2">
                        {status === 'received' && <Clock size={16} className="text-orange-500" />}
                        {status === 'brewing' && <Coffee size={16} className="text-amber-600" />}
                        {status === 'ready' && <CheckCircle2 size={16} className="text-emerald-600" />}
                        {status === 'delivered' && <LayoutDashboard size={16} className="text-coffee-300" />}
                        {status === 'received' ? 'COLA' : status === 'brewing' ? 'BARRA' : status === 'ready' ? 'PICKUP' : 'FINAL'}
                      </h4>
                      <span className="text-[10px] font-black bg-coffee-900 text-white w-6 h-6 flex items-center justify-center rounded-full">
                        {orders.filter(o => o.status === status).length}
                      </span>
                    </header>

                    <div className="flex-1 space-y-4">
                      <AnimatePresence>
                        {orders.filter(o => o.status === status).map(order => (
                          <motion.div
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            key={order.id}
                            className="bg-white p-5 rounded-[28px] card-shadow border border-coffee-100 cursor-pointer hover:border-coffee-400 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] font-mono font-bold text-coffee-400 bg-coffee-50 px-2 py-0.5 rounded uppercase tracking-tighter">{order.id}</span>
                              <span className="text-[10px] font-bold text-coffee-300">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="space-y-2 mb-6">
                              {order.items.map(item => {
                                const p = products.find(prod => prod.id === item.productId);
                                return (
                                  <div key={item.productId} className="flex justify-between text-xs">
                                    <p className="font-bold">
                                      <span className="text-coffee-900/40 font-black mr-2">{item.quantity}x</span> {p?.name}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                            {status !== 'delivered' && (
                              <button 
                                onClick={() => {
                                  const next: Record<OrderStatus, OrderStatus> = {
                                    received: 'brewing',
                                    brewing: 'ready',
                                    ready: 'delivered',
                                    delivered: 'delivered'
                                  };
                                  updateOrderStatus(order.id, next[status]);
                                }}
                                className="w-full py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-coffee-50 text-coffee-600 hover:bg-coffee-900 hover:text-white rounded-xl transition-all"
                              >
                                {status === 'ready' ? 'Entregar' : 'Siguiente Paso'}
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer (Simplified for Home/Auth) */}
      {view !== 'home' && view !== 'auth' && (
        <footer className="mt-20 py-12 px-6 border-t-4 border-coffee-900 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Coffee className="text-coffee-900" />
                <h2 className="text-3xl font-serif font-black">Mon café</h2>
              </div>
              <p className="text-sm text-coffee-500 font-light max-w-xs leading-loose">
                Donde la precisión milimétrica del análisis de sistemas se encuentra con la pasión orgánica del café de especialidad.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-6 text-[10px] font-black uppercase tracking-widest text-coffee-400">
              <a href="#" className="hover:text-coffee-900 transition-colors">Barra</a>
              <a href="#" className="hover:text-coffee-900 transition-colors">Entrenamientos</a>
              <a href="#" className="hover:text-coffee-900 transition-colors">Sostenibilidad</a>
              <a href="#" className="hover:text-coffee-900 transition-colors">Dashboard</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-coffee-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-coffee-300 font-bold">
            <p>© 2026 MON CAFÉ CO. - SISTEMAS DE CAFÉ</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> SERVER STATUS: OPTIMAL</span>
              <span className="bg-coffee-900 text-white px-3 py-1 rounded-sm">BUILD 4.15</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

