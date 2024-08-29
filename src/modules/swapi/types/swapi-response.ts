export type SwapiMovie = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  created: string;
  edited: string | null;
  url: string;
};

export type SwapiMoviesResponse = {
  results: SwapiMovie[];
  count: number;
};
