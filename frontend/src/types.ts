export interface Member {
  id: string;
  name: string;
  tag: string;
  phone?: string;
  address?: string;
  type: "individual" | "organization" | "project";
  connections: string[];
  is_trusted: boolean;
  invited_by?: string;
  is_dark: boolean;
  public_fields: string[];
}

export interface GraphNode {
  id: string;
  name: string;
  tag: string;
  type: "individual" | "organization" | "project";
  is_trusted: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface TrustGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ResourceResult {
  name: string;
  category: string;
  description: string;
  contact: string;
  relevance_score: number;
}

export interface ResourceSearchResponse {
  query: string;
  results: ResourceResult[];
}

export interface Invitation {
  code: string;
  created_by: string;
  invitee_name: string;
  invitee_tag: string;
  status: "pending" | "accepted" | "revoked";
  accepted_by?: string;
}

export interface HelpRequest {
  id: string;
  member_id: string;
  member_name: string;
  need: string;
  when_needed: string;
  description?: string;
  created_at: string;
}
