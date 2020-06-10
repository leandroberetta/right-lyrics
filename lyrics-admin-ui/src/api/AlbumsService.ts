import axios from "axios";
import Album from "../model/Album";

const AlbumsService = {
  getAll: async (page: number, pageSize: number, query: string) =>
    axios.get(`/albums`),

  get: async (id: number) => axios.get(`/albums/${id}`),

  createOrUpdate: async (entity: Album) => {
    console.log(entity);
    if (entity.id > 0) {
      return axios.put(`/albums/${entity.id}`, entity);
    } else {
      return axios.post(`/albums`, entity);
    }
  },

  load: async () => axios.get(`/albums/load`),
};

export default AlbumsService;
