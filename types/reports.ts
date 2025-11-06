import type { Categories } from "./categories"
import type { DashboardTraffic } from "./dashboard"

export interface ReportFormData {
  dateFrom: string
  dateTo: string
  deviceSelection: 'all' | 'specific'
  selectedDevice?: string
}

export interface GraphLegendItem {
  name: string,
  color: string
}

export type GraphLegend = GraphLegendItem[]

export interface NGFWReportItem {
  name: string;
  input: number;
  output: number;
  requests: number;
  all: number;
  anomalies: number
  blocks: number;
  detections: {
    all: number
    allowed: number
    blocked: number
    unresolved: number;
  };
}

export interface AnomalyReportItem {
  name: string;
  url: string;
  status: string;
  live_count: string
  traffic: {
    input: number;
    output: number;
  };
  requests: number;
  before_block: number;
  waiting: number;
  after_block: number;
}

export interface ReportCategoryItem {
  name: Categories,
  before_block: number,
  after_block: number,
  waiting: number
}

export interface ReportResourceItem {
  name: string,
  categories: Categories[],
  before_block: number,
  after_block: number,
  waiting: number
}

export interface ReportData {
  category_top: ReportCategoryItem[],
  resource_top: ReportResourceItem[],
  traffic: DashboardTraffic,
  all_ngfw: NGFWReportItem[];
  anomalies: AnomalyReportItem[];
}

export interface ReportsState {
  report: ReportData | null
}
