export interface StatItem {
  name: string
  stat: string
  previousStat: string
  change: string
  changeType: 'increase' | 'decrease'
}

export type ResourceCategory = 'Экстремизм' | 'Наркотики' | 'Другое';

export type BadgeType = 'ngfw-1' | 'ngfw-2';

export type StatusType = 'blocking' | 'verification' | 'blocked'

export interface Resource {
  id: number
  name: string
  category: ResourceCategory
  date: string
  description: string
  country: string
  location: string
  ipAddress: string
  badge: BadgeType
  requestCount: number
  status: StatusType
  isBlocked?: boolean
}
