import type { ReactNode } from 'react'
import {
  Award,
  Building2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Laptop,
  LayoutGrid,
  LogOut,
  MapPin,
  ShoppingBag,
  Store,
  UtensilsCrossed,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { getUnit } from '../data/catalog'
import { channelPath, useChannel } from '../hooks/useChannel'
import { useMatrizAuth } from '../hooks/useMatrizAuth'
import { Logo } from './Logo'

export function Layout({ children }: { children: ReactNode }) {
  const channel = useChannel()
  const { cartCount, unitId } = usePlatform()
  const unit = unitId ? getUnit(unitId) : undefined
  const matriz = useMatrizAuth()

  if (channel === 'balcao' || channel === 'matriz') {
    return (
      <div className={`shell shell-${channel}`}>
        <header className="desk-top">
          <Logo light />
          <p className="desk-meta">
            {channel === 'balcao' ? (
              <>
                <ChefHat size={16} /> Operação de loja
              </>
            ) : (
              <>
                <Building2 size={16} /> {matriz.isIn ? matriz.email : 'Acesso restrito'}
              </>
            )}
            {channel === 'balcao' && unit ? ` · ${unit.city} · ${unit.name}` : ''}
          </p>
          <div className="totem-actions">
            <BackButton variant="ghost-link" />
            {channel === 'matriz' && matriz.isIn && (
              <button type="button" className="ghost-link" onClick={matriz.logout}>
                <LogOut size={16} />
                Sair
              </button>
            )}
            <Link className="ghost-link" to="/">
              <LayoutGrid size={16} />
              Canais
            </Link>
          </div>
        </header>
        {children}
      </div>
    )
  }

  if (channel === 'totem') {
    return (
      <div className="shell shell-totem">
        <header className="totem-top">
          <Logo light />
          <div className="totem-unit">
            <strong>
              <Store size={16} />
              {unit ? `${unit.city} · ${unit.name}` : 'Toque para começar'}
            </strong>
            <span>Autoatendimento · retirada na loja</span>
          </div>
          <div className="totem-actions">
            <BackButton variant="ghost-link" />
            {cartCount > 0 && (
              <Link className="btn" to="/totem/carrinho">
                <ShoppingBag size={18} />
                Sacola
                <em className="badge">{cartCount}</em>
              </Link>
            )}
            <Link className="ghost-link" to="/">
              <LayoutGrid size={16} />
              Canais
            </Link>
          </div>
        </header>
        {children}
      </div>
    )
  }

  if (channel === 'site') {
    return (
      <div className="shell shell-site">
        <header className="site-top">
          <Logo light />
          <nav className="site-nav" aria-label="Navegação do site">
            <Tab to="/site" label="Início" icon={<Laptop size={16} strokeWidth={1.75} />} variant="site-link" />
            <Tab to="/site/unidades" label="Unidades" icon={<MapPin size={16} strokeWidth={1.75} />} variant="site-link" />
            <Tab to="/site/cardapio" label="Cardápio" icon={<UtensilsCrossed size={16} strokeWidth={1.75} />} variant="site-link" />
            <Tab to="/site/pedidos" label="Pedidos" icon={<ClipboardList size={16} strokeWidth={1.75} />} variant="site-link" />
            <Tab to="/site/fidelidade" label="Fidelidade" icon={<Award size={16} strokeWidth={1.75} />} variant="site-link" />
          </nav>
          <div className="totem-actions">
            <BackButton variant="ghost-link" />
            <Link className="btn" to="/site/carrinho">
              <ShoppingBag size={18} />
              Sacola
              {cartCount > 0 && <em className="badge">{cartCount}</em>}
            </Link>
            <Link className="ghost-link" to="/">
              <LayoutGrid size={16} />
              Canais
            </Link>
          </div>
        </header>
        <main className="site-main">{children}</main>
      </div>
    )
  }

  return (
    <div className="shell shell-app">
      <div className="phone">
        <header className="app-top">
          <Logo compact />
          <div className="header-actions">
            <BackButton />
            <Link className="chip" to="/">
              <LayoutGrid size={15} />
              Canais
            </Link>
          </div>
        </header>
        <main className="app-main">{children}</main>
        <nav className="tabbar" aria-label="Navegação do aplicativo">
          <Tab to="/app" label="Início" icon={<Store size={20} strokeWidth={1.75} />} />
          <Tab to="/app/cardapio" label="Cardápio" icon={<UtensilsCrossed size={20} strokeWidth={1.75} />} />
          <Tab to="/app/pedidos" label="Pedidos" icon={<ClipboardList size={20} strokeWidth={1.75} />} />
          <Tab to="/app/fidelidade" label="Fidelidade" icon={<Award size={20} strokeWidth={1.75} />} />
          <Tab
            to="/app/carrinho"
            label="Sacola"
            icon={<ShoppingBag size={20} strokeWidth={1.75} />}
            badge={cartCount}
          />
        </nav>
      </div>
    </div>
  )
}

const channelRoots = new Set(['/app', '/site', '/totem', '/balcao', '/matriz'])

function fallbackPath(pathname: string) {
  const [channel, section] = pathname.split('/').filter(Boolean)
  if (!channel || !section) return '/'
  const base = `/${channel}`
  if (section === 'produto') return `${base}/cardapio`
  if (section === 'pedido') return `${base}/pedidos`
  if (section === 'checkout') return `${base}/carrinho`
  if (section === 'carrinho') return `${base}/cardapio`
  return base
}

function BackButton({ variant = 'chip' }: { variant?: 'chip' | 'ghost-link' }) {
  const navigate = useNavigate()
  const { pathname, key } = useLocation()

  function onBack() {
    if (channelRoots.has(pathname)) {
      navigate('/')
      return
    }
    if (key !== 'default') {
      navigate(-1)
      return
    }
    navigate(fallbackPath(pathname))
  }

  return (
    <button type="button" className={variant} onClick={onBack}>
      <ChevronLeft size={16} />
      Voltar
    </button>
  )
}

function Tab({
  to,
  label,
  icon,
  badge = 0,
  variant = 'tab',
}: {
  to: string
  label: string
  icon: ReactNode
  badge?: number
  variant?: 'tab' | 'site-link'
}) {
  return (
    <NavLink
      to={to}
      end={to === '/app' || to === '/site'}
      className={({ isActive }) => (isActive ? `${variant} on` : variant)}
    >
      {icon}
      <span>{label}</span>
      {badge > 0 && <em>{badge}</em>}
    </NavLink>
  )
}

export function NeedUnit({ children }: { children: ReactNode }) {
  const { unitId } = usePlatform()
  const channel = useChannel()
  const navigate = useNavigate()

  if (!unitId) {
    return (
      <section className="empty">
        <MapPin size={28} strokeWidth={1.6} />
        <h1>Escolha a unidade</h1>
        <p>O cardápio, o estoque e o horário mudam de loja para loja.</p>
        <button className="btn" type="button" onClick={() => navigate(channelPath(channel, '/unidades'))}>
          Ver unidades
          <ChevronRight size={18} />
        </button>
      </section>
    )
  }

  return children
}
