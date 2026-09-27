import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchReports = createAsyncThunk("reports/fetchAll", async (params = {}) => {
  const { data } = await axiosClient.get("/reports/", { params });
  return data.results || data;
});

// payload: { patient, report_type, title, notes, file } — file is a File object
export const uploadReport = createAsyncThunk("reports/upload", async (payload) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
  const { data } = await axiosClient.post("/reports/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
});

const reportsSlice = createSlice({
  name: "reports",
  initialState: { items: [], status: "idle", uploadStatus: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(uploadReport.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default reportsSlice.reducer;
