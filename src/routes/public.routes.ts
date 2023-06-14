import express from "express";
import { loginAsPatient, registerAsPatient } from "../controllers/patient.controller";
import { registerAsDoctor, loginAsDoctor } from "../controllers/doctor.controller";

const publicRouter = express.Router();

// @desc login a patient
// @route POST /api/v1/public/patient/login
publicRouter.post("/patient/login", loginAsPatient);

// @desc Register as a patient
// @route POST /api/v1/public/patient/register
publicRouter.post("/patient/register", registerAsPatient);

// @desc Register as a doctor
// @route POST /api/v1/public/doctor/register
publicRouter.post("/doctor/register", registerAsDoctor);

// @desc login a doctor
// @route POST /api/v1/public/doctor/login
publicRouter.post("/doctor/login", loginAsDoctor);

export default publicRouter;
