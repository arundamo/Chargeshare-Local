export const CONNECTOR_TYPES = [
  { value: 'Type 1 (J1772)', label: 'Type 1 (J1772)' },
  { value: 'Type 2 (Mennekes)', label: 'Type 2 (Mennekes)' },
  { value: 'CCS1', label: 'CCS1' },
  { value: 'CCS2', label: 'CCS2' },
  { value: 'CHAdeMO', label: 'CHAdeMO' },
  { value: 'Tesla NACS', label: 'Tesla NACS' },
  { value: 'NEMA 5-15', label: 'NEMA 5-15 (Standard US)' },
  { value: 'NEMA 14-50', label: 'NEMA 14-50' },
  { value: 'NEMA 6-20', label: 'NEMA 6-20' },
]

export const CHARGING_LEVELS = [
  { value: 'Level 1', label: 'Level 1 (~1.4 kW)' },
  { value: 'Level 2', label: 'Level 2 (~7–22 kW)' },
  { value: 'DC Fast', label: 'DC Fast Charging (50+ kW)' },
]

export const AVAILABILITY_TYPES = [
  { value: 'always', label: 'Always available' },
  { value: 'scheduled', label: 'By schedule' },
  { value: 'on_request', label: 'On request' },
]

export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

export const CHARGER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
}
