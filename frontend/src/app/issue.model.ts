import { Comment } from './comment.model';

export interface Issue {
  id: String;
  title: String;
  responsible: String;
  severity: String;
  status: String;
  comments: Comment[];
}