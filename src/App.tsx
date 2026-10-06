import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Balcao } from './pages/Balcao'
import { Cardapio } from './pages/Cardapio'
import { Carrinho } from './pages/Carrinho'
import { Checkout } from './pages/Checkout'
import { Fidelidade } from './pages/Fidelidade'
import { Home } from './pages/Home'
import { HomeApp } from './pages/HomeApp'
import { Matriz } from './pages/Matriz'
import { Pedido } from './pages/Pedido'
import { Pedidos } from './pages/Pedidos'
import { Produto } from './pages/Produto'
import { TotemAttract } from './pages/TotemAttract'
import { Unidades } from './pages/Unidades'

function Channel({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<Channel><HomeApp /></Channel>} />
      <Route path="/app/unidades" element={<Channel><Unidades /></Channel>} />
      <Route path="/app/cardapio" element={<Channel><Cardapio /></Channel>} />
      <Route path="/app/produto/:id" element={<Channel><Produto /></Channel>} />
      <Route path="/app/carrinho" element={<Channel><Carrinho /></Channel>} />
      <Route path="/app/checkout" element={<Channel><Checkout /></Channel>} />
      <Route path="/app/pedidos" element={<Channel><Pedidos /></Channel>} />
      <Route path="/app/pedido/:id" element={<Channel><Pedido /></Channel>} />
      <Route path="/app/fidelidade" element={<Channel><Fidelidade /></Channel>} />
      <Route path="/site" element={<Channel><HomeApp /></Channel>} />
      <Route path="/site/unidades" element={<Channel><Unidades /></Channel>} />
      <Route path="/site/cardapio" element={<Channel><Cardapio /></Channel>} />
      <Route path="/site/produto/:id" element={<Channel><Produto /></Channel>} />
      <Route path="/site/carrinho" element={<Channel><Carrinho /></Channel>} />
      <Route path="/site/checkout" element={<Channel><Checkout /></Channel>} />
      <Route path="/site/pedidos" element={<Channel><Pedidos /></Channel>} />
      <Route path="/site/pedido/:id" element={<Channel><Pedido /></Channel>} />
      <Route path="/site/fidelidade" element={<Channel><Fidelidade /></Channel>} />
      <Route path="/totem" element={<Channel><TotemAttract /></Channel>} />
      <Route path="/totem/unidades" element={<Channel><Unidades /></Channel>} />
      <Route path="/totem/cardapio" element={<Channel><Cardapio /></Channel>} />
      <Route path="/totem/produto/:id" element={<Channel><Produto /></Channel>} />
      <Route path="/totem/carrinho" element={<Channel><Carrinho /></Channel>} />
      <Route path="/totem/checkout" element={<Channel><Checkout /></Channel>} />
      <Route path="/totem/pedido/:id" element={<Channel><Pedido /></Channel>} />
      <Route path="/totem/pedidos" element={<Channel><Pedidos /></Channel>} />
      <Route path="/balcao" element={<Channel><Balcao /></Channel>} />
      <Route path="/matriz" element={<Channel><Matriz /></Channel>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
