import type { TableMeta } from "~/types/meta";
import type { NGFWType } from "~/types/NGFW";

export type ResourceCategory = 'Экстремизм' | 'Наркотики' | 'Другое';

export type StatusType = 'blocking' | 'verification' | 'blocked'

export interface Detection {
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

export interface DetectionTable {
  data: Detection[];
  meta: TableMeta;
}

export interface DetectionControlState {
  detections: Detection[] | null;
}

export interface DetectionControlActions {
  fetchDetections(page: number = 1, limit: number = 11): Promise<DetectionTable>
}
