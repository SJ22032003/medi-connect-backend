import express from "express";
import {
  getPatientData,
  updatePatientData,
  getDoctorData,
  updateDoctorData,
} from "../controllers/userData.controller";
import {
  getPatientReports,
  updatePatientReports,
  deletePatientReport,
  getDoctorsListForPatient,
  newChatWithDoctor,
  getPatientMessageList,
  acceptAppoinmentRequest,
} from "../controllers/patient.controller";
import {
  getDoctorMessageList,
} from "../controllers/doctor.controller";
import { getAllChats } from "../controllers/chat.controller";

const userRouter = express.Router();

// @route GET|PATCH /api/v1/user/patient/data
userRouter.route("/patient/data").get(getPatientData).patch(updatePatientData);

// @route GET|PATCH|DELETE  /api/v1/patient/reports
userRouter.route("/patient/reports").get(getPatientReports);
userRouter.route("/patient/report").patch(updatePatientReports);
userRouter.route("/patient/report/:id").delete(deletePatientReport);

// @route GET /api/v1/patient/doctors
userRouter.route("/patient/doctors").get(getDoctorsListForPatient);

// @route PATCH /api/v1/patient/new-chat
userRouter.route("/patient/new-chat/:dId").patch(newChatWithDoctor);

// @route GET /api/v1//patient/doctor-message-list
userRouter.route("/patient/doctor-message-list").get(getPatientMessageList);

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

// @route GET|PATCH /api/v1/user/doctor/data
userRouter.route("/doctor/data").get(getDoctorData).patch(updateDoctorData);

// @route GET /api/v1/doctor/patient-message-list
userRouter.route("/doctor/patient-message-list").get(getDoctorMessageList);

// @route PATCH /api/v1/patient/accept-appointment/:dId
userRouter.route("/patient/accept-appointment/:dId").patch(acceptAppoinmentRequest);

// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------

// @route GET /api/v1/user/chat/:roomId
userRouter.route("/chat/:roomId").get(getAllChats);

export default userRouter;
