import { Award, ShieldCheck, ShieldOff } from 'lucide-react'
import { useState } from 'react'
import { usePlatform } from '../context/PlatformContext'
import { loyaltyPitch, loyaltyTiers } from '../data/marketing'

export function Fidelidade() {
  const { loyalty, consentLoyalty, revokeLoyalty } = usePlatform()
  const [name, setName] = useState(loyalty.name)
  const [email, setEmail] = useState(loyalty.email)
  const [accept, setAccept] = useState(false)

  const level = loyalty.points >= 300 ? 'Casa cheia' : loyalty.points >= 120 ? 'Frequentador' : 'Raiz nova'
  const discount = loyalty.points >= 300 ? '12%' : loyalty.points >= 120 ? '8%' : '5%'

  return (
    <section className="stack">
      <header className="page-head">
        <p className="eyebrow">{loyaltyPitch.kicker}</p>
        <h1>Volte. A casa lembra.</h1>
        <p>{loyaltyPitch.text}</p>
      </header>
      <ul className="promises">
        {loyaltyTiers.map((item) => (
          <li key={item.name}>
            <strong>{item.name}</strong>
            <p>
              {item.points} · {item.perk}
            </p>
          </li>
        ))}
      </ul>
      {loyalty.consented ? (
        <div className="panel loyalty">
          <p className="eyebrow meta">
            <ShieldCheck size={14} /> Programa ativo
          </p>
          <h2>{loyalty.name}</h2>
          <p>{loyalty.email}</p>
          <div className="points">
            <Award size={22} />
            <strong>{loyalty.points}</strong>
            <span>pontos · {level} · desconto progressivo de {discount}</span>
          </div>
          <p className="hint">
            Consentimento registrado em{' '}
            {loyalty.consentedAt
              ? new Date(loyalty.consentedAt).toLocaleString('pt-BR')
              : '—'}
            . Nome e e-mail ficam neste canal. A matriz só vê o volume.
          </p>
          <button className="btn ghost" type="button" onClick={revokeLoyalty}>
            <ShieldOff size={16} />
            Revogar consentimento e apagar pontos
          </button>
        </div>
      ) : (
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault()
            if (!accept) return
            consentLoyalty(name, email)
          }}
        >
          <label className="field">
            Nome
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            E-mail
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="radio">
            <input type="checkbox" checked={accept} onChange={(event) => setAccept(event.target.checked)} />
            Autorizo o uso dos meus dados para pontos, descontos e campanhas. Posso revogar a qualquer
            momento. Dados de perfil não entram em relatórios da matriz sem anonimização.
          </label>
          <button className="btn" type="submit" disabled={!accept || !name || !email}>
            <ShieldCheck size={18} />
            Quero os pontos da casa
          </button>
        </form>
      )}
    </section>
  )
}
