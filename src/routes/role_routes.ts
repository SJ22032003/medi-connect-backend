import { user } from "../constant/user.constant";

const { ADMIN, PATIENT, DOCTOR } = user;

const roleRoutes = {
  "GET::/user/patient/data": [PATIENT],
  "PATCH::/user/patient/data": [PATIENT],

  "GET::/user/patient/reports": [PATIENT],
  "PATCH::/user/patient/report": [PATIENT],
  "DELETE::/user/patient/report/*": [PATIENT],

  "GET::/user/patient/doctors": [PATIENT],

  "PATCH::/user/patient/new-chat/*": [PATIENT],

  "GET::/user/patient/doctor-message-list": [PATIENT],

  "PATCH::/user/patient/accept-appointment/*": [PATIENT],

  "GET::/user/patient/doctors-available-on-emergency": [PATIENT],

  // ----------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------

  "GET::/user/doctor/data": [DOCTOR],
  "PATCH::/user/doctor/data": [DOCTOR],

  "GET::/user/doctor/patient-message-list": [DOCTOR],

  // ----------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------

  "GET::/user/chat/*": [PATIENT, DOCTOR, ADMIN],

};

export default roleRoutes;
