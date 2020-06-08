import * as Yup from "yup";

const AlbumSchema = Yup.object().shape({
  artist: Yup.string().required("Required"),
  title: Yup.string().required("Required"),
  coverUrl: Yup.string().required("Required"),
  year: Yup.number().min(1800).max(2020).required("Required"),
});

export default AlbumSchema;
