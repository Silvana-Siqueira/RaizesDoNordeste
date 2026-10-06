import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Campaign } from '../data/marketing'
import { channelPath, useChannel } from '../hooks/useChannel'

export function CampaignBanner({ campaign }: { campaign: Campaign }) {
  const channel = useChannel()

  return (
    <Link className="campaign" to={channelPath(channel, campaign.path)}>
      <p className="eyebrow">{campaign.kicker}</p>
      <h2>{campaign.title}</h2>
      <p>{campaign.text}</p>
      <em>
        {campaign.cta} <ChevronRight size={16} />
      </em>
    </Link>
  )
}
