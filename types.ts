
export enum ItemType {
  SIGHTSEEING = '景點',
  FOOD = '美食',
  TRANSPORT = '交通',
  FLIGHT = '航班',
  SHOPPING = '購物',
  HOTEL = '住宿',
  OTHER = '其他'
}

export enum Currency {
  TWD = '台幣',
  JPY = '日幣'
}

export interface FlightInfo {
  id: string;
  type: '去程' | '回程';
  flightNo: string;
  time: string;
  airport: string;
}

export interface Accommodation {
  id: string;
  name: string;
  address: string;
  mapsUrl: string;
}

export interface ItineraryItem {
  id: string;
  date: string;
  startTime: string;
  type: ItemType;
  location: string;
  note: string;
  mapsUrl: string;
}

export interface Expense {
  id: string;
  payer: string;
  amount: number;
  currency: Currency;
  description: string;
  date: string;
  isShared: boolean;
  participants: string[];
}

export interface DebtSummary {
  from: string;
  to: string;
  amount: number;
  currency: Currency;
}

export enum ListType {
  SHOPPING = 'SHOPPING',
  TODO = 'TODO'
}

export interface TodoItem {
  id: string;
  date: string;
  content: string;
  isCompleted: boolean;
  type: ListType;
  location?: string;
  mapsUrl?: string;
}

export interface NoteItem {
  id: string;
  content: string;
  date: string;
}

export interface TranslationRecord {
  id: string;
  original: string;
  translated: string;
  timestamp: number;
}

export interface TripSettings {
  startDate: string;
  endDate: string;
  members: string[];
}
