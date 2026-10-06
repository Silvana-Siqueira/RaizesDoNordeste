import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { matrizDemo } from '../hooks/useMatrizAuth'

export function MatrizLogin({ onOk }: { onOk: (email: string, password: string) => boolean }) {
  const [email, setEmail] = useState(matrizDemo.email)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  return (
    <section className="login">
      <div className="login-card">
        <header className="page-head">
          <p className="eyebrow live">
            <span className="live-dot" /> Franqueadora
          </p>
          <h1>Acesso da matriz</h1>
          <p>Relatórios consolidados, estoque das lojas e auditoria. Só quem tem perfil da franquia entra.</p>
        </header>
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault()
            const ok = onOk(email, password)
            setError(ok ? '' : 'E-mail ou senha não conferem. Tente de novo.')
          }}
        >
          <label className="field">
            <span className="meta">
              <Mail size={14} /> E-mail corporativo
            </span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span className="meta">
              <Lock size={14} /> Senha
            </span>
            <span className="password-row">
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit">
            <ShieldCheck size={18} />
            Entrar
          </button>
        </form>
        <p className="hint login-hint">
          Protótipo: <strong>{matrizDemo.email}</strong> · senha <strong>{matrizDemo.password}</strong>
        </p>
      </div>
    </section>
  )
}
