/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'bakery' | 'breakfast';
  image: string;
}

export type OrderStatus = 'received' | 'brewing' | 'ready' | 'delivered';

export type UserRole = 'cliente' | 'barista' | 'admin';

export interface User {
  id: string;
  nombre_usuario: string;
  tipo_usuario: UserRole;
  correo_electronico: string;
  contrasena: string; // En una app real esto nunca se guardaría en plano
}

export interface Order {
  id: string;
  items: { productId: string; quantity: number }[];
  total: number;
  status: OrderStatus;
  timestamp: number;
}

export const MENU_DATA: Product[] = [
  {
    id: 'c1',
    name: 'Espresso Artesanal',
    description: 'Doble carga de grano de altura con notas de chocolate.',
    price: 45,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'c2',
    name: 'Cappuccino de Seda',
    description: 'Leche texturizada con microespuma y un toque de canela.',
    price: 65,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'b1',
    name: 'Croissant de Mantequilla',
    description: 'Hojaldre tradicional francés, crujiente y dorado.',
    price: 55,
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'b2',
    name: 'Danish de Frutos Rojos',
    description: 'Base de hojaldre con crema pastelera y bayas frescas.',
    price: 60,
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'br1',
    name: 'Toast de Avocat',
    description: 'Pan de masa madre, aguacate hass, huevo pochado y semillas.',
    price: 125,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'br2',
    name: 'Bowl de Acai Real',
    description: 'Mezcla de acai orgánico, granola artesanal y frutas de temporada.',
    price: 110,
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400'
  }
];
