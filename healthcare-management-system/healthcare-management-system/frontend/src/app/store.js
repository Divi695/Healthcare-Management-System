import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import patientsReducer from "../features/patients/patientsSlice";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import prescriptionsReducer from "../features/prescriptions/prescriptionsSlice";
import reportsReducer from "../features/reports/reportsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    appointments: appointmentsReducer,
    prescriptions: prescriptionsReducer,
    reports: reportsReducer,
  },
});
