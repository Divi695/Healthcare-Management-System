import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const login = createAsyncThunk("auth/login", async ({ username, password }) => {
  const { data } = await axiosClient.post("/auth/login/", { username, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const { data } = await axiosClient.get("/auth/me/");
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: !!localStorage.getItem("access_token"),
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
