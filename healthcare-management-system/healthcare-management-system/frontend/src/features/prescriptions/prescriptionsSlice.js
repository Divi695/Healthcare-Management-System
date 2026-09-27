import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchPrescriptions = createAsyncThunk("prescriptions/fetchAll", async (params = {}) => {
  const { data } = await axiosClient.get("/prescriptions/", { params });
  return data.results || data;
});

export const createPrescription = createAsyncThunk("prescriptions/create", async (payload) => {
  const { data } = await axiosClient.post("/prescriptions/", payload);
  return data;
});

const prescriptionsSlice = createSlice({
  name: "prescriptions",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default prescriptionsSlice.reducer;
