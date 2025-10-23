import type { NGFWType } from "~/types/NGFW";


export interface StatItem {
  name: string
  stat: string
  previousStat: string
  change: string
  changeType: 'increase' | 'decrease'
}

export type ResourceCategory = 'Экстремизм' | 'Наркотики' | 'Другое';

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
  ngfw: NGFWType
  requestCount: number
  status: StatusType
  isBlocked?: boolean
}
