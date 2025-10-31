export interface ReportFormData {
  dateFrom: string
  dateTo: string
  deviceSelection: 'all' | 'specific'
  selectedDevice?: string
}