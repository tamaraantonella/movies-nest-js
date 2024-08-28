export type SwapiMovie = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  created: string;
  edited: string;
  url: string;
}

export type SwapiMoviesResponse = {
  results: SwapiMovie[] ;
  count: number;
}