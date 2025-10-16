import type { TableMeta } from "~/types/meta";
import type { NGFWType } from "~/types/NGFW";

type SessionStatus = 'allowed' | 'ban' | 'waiting';

export interface Session {
  id: string;
  status: SessionStatus;
  url: string;
  ip: string;
  ngfw: NGFWType;
  full_name?: string;
  type: string;
  category: string;
  datetime: string;
}

export interface SessionTable {
  data: Session[];
  meta: TableMeta;
}

export interface SessionControlState {
  sessions: Session[] | null;
}

export interface SessionControlActions {
  fetchSessions(page: number = 1, limit: number = 11, search?: string): Promise<SessionTable>
}
