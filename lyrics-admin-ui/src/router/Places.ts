import history from "./History";

const withParameter = (url: string, id?: number) => {
  if (id) {
    return url + "/" + id;
  } else {
    return url;
  }
};

const Places = {
  gotToAlbums: () => history.push("/albums"),
  goToAlbumsForm: (id?: number) =>
    history.push(withParameter("/albums/form", id)),
};

export default Places;
