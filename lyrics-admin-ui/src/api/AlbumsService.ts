import axios from "axios";

export default class AlbumsService {
  getAll = async (page: number, pageSize: number, query: string) =>
    axios.get(`/albums`);
}
