import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchAppointments = createAsyncThunk("appointments/fetchAll", async (params = {}) => {
  const { data } = await axiosClient.get("/appointments/", { params });
  return data.results || data;
});

export const createAppointment = createAsyncThunk("appointments/create", async (payload) => {
  const { data } = await axiosClient.post("/appointments/", payload);
  return data;
});

export const updateAppointment = createAsyncThunk("appointments/update", async ({ id, payload }) => {
  const { data } = await axiosClient.patch(`/appointments/${id}/`, payload);
  return data;
});

export const cancelAppointment = createAsyncThunk("appointments/cancel", async (id) => {
  const { data } = await axiosClient.patch(`/appointments/${id}/`, { status: "cancelled" });
  return data;
});

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addMatcher(
        (action) => [updateAppointment.fulfilled.type, cancelAppointment.fulfilled.type].includes(action.type),
        (state, action) => {
          const idx = state.items.findIndex((a) => a.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
        }
      );
  },
});

export default appointmentsSlice.reducer;
