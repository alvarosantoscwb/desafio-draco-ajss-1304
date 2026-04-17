export interface Recipient {
  id: number;
  communicationId: number;
  name: string;
  pole: string | null;
  isLawyer: boolean;
  oabNumber: string | null;
  oabState: string | null;
}

export interface Communication {
  id: number;
  hash: string;
  courtAcronym: string;
  organName: string;
  communicationType: string;
  documentType: string | null;
  className: string | null;
  processNumber: string;
  processNumberMask: string;
  content: string;
  medium: string;
  mediumFull: string;
  link: string | null;
  status: string;
  availableAt: string;
  createdAt: string;
  recipients: Recipient[];
}

export interface CommunicationsResponse {
  data: Communication[];
  total: number;
  page: number;
  totalPages: number;
}
