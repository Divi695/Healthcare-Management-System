import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchPatients = createAsyncThunk("patients/fetchAll", async () => {
  const { data } = await axiosClient.get("/patients/");
  return data.results || data;
});

export const createPatient = createAsyncThunk("patients/create", async (payload) => {
  const { data } = await axiosClient.post("/patients/", payload);
  return data;
});

export const updatePatient = createAsyncThunk("patients/update", async ({ id, payload }) => {
  const { data } = await axiosClient.patch(`/patients/${id}/`, payload);
  return data;
});

export const deletePatient = createAsyncThunk("patients/delete", async (id) => {
  await axiosClient.delete(`/patients/${id}/`);
  return id;
});

const patientsSlice = createSlice({
  name: "patients",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default patientsSlice.reducer;
