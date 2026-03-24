export interface FinanceRecord {
  id?: string;
  dueDate?: string;
  date?: string;
  value?: number | string;
  valor?: number | string;
  type?: 'Receita' | 'Despesa';
  status?: 'Pago' | 'Pendente';
  description?: string;
  category?: string;
}

export interface AppointmentRecord {
  id: string;
  date: string;
  time?: string;
  patient: string;
  service: string;
  serviceIds?: string[];
  status?: string;
  professional?: string;
  [key: string]: any;
}

export interface PatientRecord {
  id: string;
  name?: string;
  nome?: string;
  birthDate?: string;
  nascimento?: string;
  phone?: string;
  email?: string;
  [key: string]: any;
}

export interface ServiceRecord {
  id: string;
  name: string;
  nome?: string;
  price?: number | string;
  valor?: number | string;
  value?: number | string;
  duration?: number;
}
