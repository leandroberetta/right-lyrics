export default interface SearchResponse<T> {
  data: T[];
  status: string;
  length: number;
}
