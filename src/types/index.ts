export type Status = 'new' | 'reviewed' | 'flagged';
export type Priority = 'low' | 'medium' | 'high';

export interface Signal {
  id: string;
  title: string;
  summary: string;
  status: Status;
  priority: Priority;
  source: string;
  owner: string | null;
  tags: string[];
  createdAt: string; // ISO format
  score: number;
}
