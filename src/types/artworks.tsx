export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}
 
export interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
}
