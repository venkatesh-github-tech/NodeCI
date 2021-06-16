import axios from "axios";
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG, DELETE_BLOG } from "./types";

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/current_user");

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post("/api/stripe", token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, history) => async (dispatch) => {
  //console.log(file);
  // If no image is uploaded, submit post as usual and return
  if (file == null) {
    const res = await axios.post("/api/blogs", values);
    history.push("/blogs");
    dispatch({ type: FETCH_BLOG, payload: res.data });
    return;
  }
  //otherwise upload image then submit blog
  const uploadObject = await axios.get("/api/upload", {
    params: {
      fileType: file.type,
    },
  });

  await axios.put(uploadObject.data.url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
  const res = await axios.post("/api/blogs", {
    ...values,
    imageUrl: uploadObject.data.key,
  });

  history.push("/blogs");
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const updateBlog = (values, file, history) => async (dispatch) => {
  //console.log(file);
  // If no image is uploaded, submit post as usual and return
  if (file == null) {
    //console.log("no file choosen");
    const res = await axios.put("/api/blogs", values);
    history.push("/blogs");
    dispatch({ type: FETCH_BLOG, payload: res.data });
    return;
  }
  //console.log("you chosen the file");

  //otherwise upload image then submit blog
  const uploadObject = await axios.get("/api/upload", {
    params: {
      fileType: file.type,
    },
  });

  await axios.put(uploadObject.data.url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
  const res = await axios.put("/api/blogs", {
    ...values,
    imageUrl: uploadObject.data.key,
  });

  //delete image from aws at last
  if (values.existingImage) {
    //delete image from AWS cloud
    console.info(values.existingImage + " has to be deleted from AWS");
    const deleteImageResponse = await axios.put("/api/deleteImage", values);
    console.info("deleteImageResponse", deleteImageResponse);
  }
  dispatch({ type: FETCH_BLOG, payload: res.data });
  history.push("/blogs");
};

export const deleteBlog = (values, history) => async (dispatch) => {
  //console.log(values);
  const res = await axios.put("/api/blogDelete", values);

  if (values.existingImage) {
    //delete image from AWS cloud
    //console.info(values.existingImage + " has to be deleted from AWS");
    await axios.put("/api/deleteImage", values);
    //console.info("deleteImageResponse", deleteImageResponse);
  }
  dispatch({ type: DELETE_BLOG, payload: res.data });
  history.push("/blogs");
};
export const fetchBlogs = () => async (dispatch) => {
  const res = await axios.get("/api/blogs");
  //console.info(res.data);
  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = (id) => async (dispatch) => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
