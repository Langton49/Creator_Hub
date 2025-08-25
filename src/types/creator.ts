export interface Creator {
  id: number;
  created_at: string;
  creator_name: string | null;
  creator_desc: string | null;
  creator_channel: string | null;
  creator_image: string | null;
}

// Frontend interface with renamed fields for easier use
export interface CreatorDisplay {
  id: number;
  name: string;
  url: string;
  description: string;
  imageUrl?: string;
  platform: string;
  created_at: string;
}