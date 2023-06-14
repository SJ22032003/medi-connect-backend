import bycrypt from "bcrypt";
import { IRequestWithRole, IStatusResponse } from "../types/request.type";
import {
  getOnePatientDetails,
  updatePatientDetailsService,
} from "../service/patient.service";
import {
  getOneDoctorDetails,
  updateDoctorDetailsService,
} from "../service/doctor.service";
import tryCatch from "../utils/try_catch.util";

// @desc send patient data to frontend
// @route GET /api/v1/patient/data
// @access Private
const getPatientData = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { id } = req;
    const patient = await getOnePatientDetails(
      { _id: id },
      { password: 0, _id: 0, createdAt: 0, updatedAt: 0 },
    );
    if (patient instanceof Error) {
      res.statusCode = 404;
      throw patient;
    }

    return res.status(200).json({
      status: "success",
      message: "Patient data fetched successfully",
      data: patient,
    });
  },
);

// @desc update patient data
// @route PATCH /api/v1/patient/data
// @access Private
const updatePatientData = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { id } = req;

    if (req.body.newPassword && req.body.oldPassword) {
      const { newPassword, oldPassword } = req.body;
      const patientPwd = await getOnePatientDetails({ _id: id }, { password: 1 });
      if (patientPwd instanceof Error) {
        res.statusCode = 404;
        throw patientPwd;
      }

      const passwordMatch = await bycrypt.compare(
        oldPassword,
        patientPwd.password,
      );
      if (!passwordMatch) {
        res.statusCode = 400;
        throw new Error("Invalid password");
      }

      const hashedPassword = await bycrypt.hash(newPassword, 10);
      req.body.password = hashedPassword;
    }

    const patient = await updatePatientDetailsService({ _id: id }, req.body);
    if (patient instanceof Error) {
      res.statusCode = 404;
      throw patient;
    }

    delete patient.password;
    delete patient.id;

    return res.status(200).json({
      status: "success",
      message: "Patient data updated successfully",
      data: patient,
    });
  },
);

// ----------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------

// @desc send doctor data to frontend
// @route GET /api/v1/doctor/data
// @access Private
const getDoctorData = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { id } = req;
    const doctor = await getOneDoctorDetails(
      { _id: id },
      { password: 0, _id: 0, createdAt: 0, updatedAt: 0 },
    );
    if (doctor instanceof Error) {
      res.statusCode = 404;
      throw doctor;
    }

    return res.status(200).json({
      status: "success",
      message: "Patient data fetched successfully",
      data: doctor,
    });
  },
);

// @desc update doctor data
// @route PATCH /api/v1/doctor/data
// @access Private
const updateDoctorData = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { id } = req;

    if (req.body.newPassword && req.body.oldPassword) {
      const { newPassword, oldPassword } = req.body;
      const doctorPwd = await getOneDoctorDetails({ _id: id }, { password: 1 });
      if (doctorPwd instanceof Error) {
        res.statusCode = 404;
        throw doctorPwd;
      }

      const passwordMatch = await bycrypt.compare(
        oldPassword,
        doctorPwd.password,
      );
      if (!passwordMatch) {
        res.statusCode = 400;
        throw new Error("Invalid password");
      }

      const hashedPassword = await bycrypt.hash(newPassword, 10);
      req.body.password = hashedPassword;
    }

    const doctor = await updateDoctorDetailsService({ _id: id }, req.body);
    if (doctor instanceof Error) {
      res.statusCode = 404;
      throw doctor;
    }

    delete doctor.password;
    delete doctor.id;

    return res.status(200).json({
      status: "success",
      message: "Doctor data updated successfully",
      data: doctor,
    });
  },
);

export { getPatientData, updatePatientData, getDoctorData, updateDoctorData };
