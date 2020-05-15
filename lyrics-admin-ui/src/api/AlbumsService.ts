import request from "superagent";

const baseUrl = "http://localhost:8080";

export default class AlbumsService {
  getAll = async (page: number, pageSize: number, query: string) =>
    await request.get(`${baseUrl}/albums`);
}
