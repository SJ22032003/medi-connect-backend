import bcrypt from "bcrypt";
import { IRequestWithRole, IStatusResponse } from "../types/request.type";
import {
  getOnePatientDetails,
  registerAsPatientService,
  updatePatientDetailsService,
  getPatientMessageListService,
} from "../service/patient.service";
import {
  getDoctorsService,
  updateDoctorDetailsService,
} from "../service/doctor.service";
import tryCatch from "../utils/try_catch.util";
import generateToken from "../utils/generate_token";
import getSanitizedParam from "../utils/sanitized_param";

// @desc get details of a patient by id
// @route GET /api/v1/patient/:id
// @access Private
const getPatientDetails = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const patient = await getOnePatientDetails(
      { _id: req.params.id },
      { password: 0, _id: 0 },
    );
    if (patient instanceof Error) {
      res.statusCode = 404;
      throw patient;
    }

    return res.status(200).json({
      status: "success",
      message: "Patient details fetched successfully",
      data: patient,
    });
  },
);

// @desc login a patient
// @route POST /api/v1/public/patient/login
// @access Public
const loginAsPatient = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.statusCode = 400;
      throw new Error("Please provide email and password");
    }

    const patient = await getOnePatientDetails(
      { email },
      { password: 1, _id: 1, name: 1, onBoarded: 1, step: 1 },
    );
    if (patient instanceof Error) {
      res.statusCode = 404;
      throw patient;
    }

    const passwordMatch = bcrypt.compare(password, patient.password);

    if (typeof passwordMatch === "undefined") {
      res.statusCode = 400;
      throw new Error("Invalid Credentials");
    }

    return res.status(200).json({
      status: "success",
      message: "Patient logged in successfully",
      auth_token: generateToken({
        id: patient.id,
        role: "patient",
        name: patient.name,
      }),
      name: patient.name,
      onBoarded: patient.onBoarded,
      step: patient.step,
      role: "patient",
    });
  },
);

// @desc Register as a patient
// @route POST /api/v1/public/patient/register
// @access Public
const registerAsPatient = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.statusCode = 400;
      throw new Error("Please provide email and password");
    }

    const doesPatientExists = await getOnePatientDetails({ email }, { _id: 1 });
    if (!(doesPatientExists instanceof Error)) {
      res.statusCode = 400;
      throw new Error("Patient already exists, please login");
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const patient = await registerAsPatientService({
      email,
      password: hashedPassword,
    });
    if (patient instanceof Error) {
      res.statusCode = 400;
      throw patient;
    }

    return res.status(201).json({
      status: "success",
      message: "Patient registered successfully",
      auth_token: generateToken({
        id: patient.id,
        role: "patient",
      }),
      step: patient.step,
    });
  },
);

// @desc get patient reports
// @route GET /api/v1/patient/reports
// @access Private
const getPatientReports = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const patient = await getOnePatientDetails(
      { _id: req.id },
      { reports: 1, _id: 0 },
    );
    if (patient instanceof Error) {
      res.statusCode = 404;
      throw patient;
    }

    return res.status(200).json({
      status: "success",
      message: "Patient reports fetched successfully",
      data: patient,
    });
  },
);

// @desc update patient reports
// @route PATCH /api/v1/patient/report
// @access Private
const updatePatientReports = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { reportName, reportUrl, reportedBy, issuedAt } = req.body;
    if (!reportName || !reportUrl || !reportedBy || !issuedAt) {
      res.statusCode = 400;
      throw new Error("Please provide all the details");
    }
    const { id } = req;
    const conditions = { _id: id };
    const updateBody = {
      $push: {
        report: {
          reportName,
          reportUrl,
          reportedBy,
          issuedAt,
        },
      },
    };

    const updatedPatient = await updatePatientDetailsService(
      conditions,
      updateBody,
    );
    if (updatedPatient instanceof Error) {
      res.statusCode = 400;
      throw updatedPatient;
    }

    return res.status(200).json({
      status: "success",
      message: "Patient reports updated successfully",
    });
  },
);

// @desc delete patient report by id
// @route DELETE /api/v1/patient/report/:id
// @access Private
const deletePatientReport = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const id = getSanitizedParam(req.params.id);
    const conditions = { _id: req.id };
    const updateBody = { $pull: { report: { _id: id } } };

    const updatedPatient = await updatePatientDetailsService(
      conditions,
      updateBody,
    );
    if (updatedPatient instanceof Error) {
      res.statusCode = 400;
      throw updatedPatient;
    }

    return res.status(200).json({
      status: "success",
      message: "Patient report deleted successfully",
    });
  },
);

// @desc get list of doctors to choose
// @route GET /api/v1/patient/doctors
// @access Private
const getDoctorsListForPatient = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const search = req.query.search as string;

    // remove all the doctor which are already in chat
    const doctorInChat = await getOnePatientDetails(
      { _id: req.id },
      { messageToDoctor: 1, _id: 0 },
    );
    if (doctorInChat instanceof Error) {
      res.statusCode = 400;
      throw doctorInChat;
    }
    const doctorsInChatId = doctorInChat.messageToDoctor.map(
      (doctor) => doctor.dId,
    );

    const conditions = {
      _id: { $nin: doctorsInChatId },
      $or: [
        { speciality: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } },
      ],
    };

    const doctorsForPatient = await getDoctorsService(conditions, {
      name: 1,
      phone: 1,
      experience: 1,
      speciality: 1,
      _id: 1,
      profileImage: 1,
      qualification: 1,
    });

    if (doctorsForPatient instanceof Error) {
      res.statusCode = 400;
      throw doctorsForPatient;
    }

    return res.status(200).json({
      status: "success",
      message: "Doctors fetched successfully",
      data: doctorsForPatient,
    });
  },
);

// @desc push message to patient
// @route PATCH /patient/new-chat/:dId
// @access private
const newChatWithDoctor = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const dId = getSanitizedParam(req.params.dId);
    const pId = req.id;
    const roomId = `${pId}-${dId}`;

    // CHECK IF DOCTOR IS IN CHAT
    const patient = await getOnePatientDetails(
      { "appointment.doctorId": dId },
      { appointment: 1, _id: 0 },
    );
    if (patient instanceof Error) {
      res.statusCode = 400;
      throw patient;
    }
    if (patient.appointment.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Chat initiated successfully",
      });
    }

    // UPDATE MESSAGE ARRAY
    const patientUpdateBody = {
      $push: {
        messageToDoctor: {
          dId,
          roomId,
        },
      },
    };
    const doctorUpdateBody = {
      $push: {
        messageToPatient: {
          pId,
          roomId,
        },
      },
    };

    const updatedPatient = await updatePatientDetailsService(
      { _id: pId },
      patientUpdateBody,
    );
    if (updatedPatient instanceof Error) {
      res.statusCode = 400;
      throw updatedPatient;
    }

    const updatedDoctor = await updateDoctorDetailsService(
      { _id: dId },
      doctorUpdateBody,
    );
    if (updatedDoctor instanceof Error) {
      res.statusCode = 400;
      throw updatedDoctor;
    }

    return res.status(200).json({
      status: "success",
      message: "Chat initiated successfully",
    });
  },
);

// @desc get all the message list of patient
// @route GET /patient/doctor-message-list
// @access private
const getPatientMessageList = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { id } = req;
    // const search = req.query.search as string || "";

    const conditions = { _id: id };
    const attributes = {
      messageToDoctor: 1,
      _id: 0,
    };

    const patient = await getPatientMessageListService(conditions, attributes);
    if (patient instanceof Error) {
      res.statusCode = 400;
      throw patient;
    }

    return res.status(200).json({
      status: "success",
      message: "Patient message list fetched successfully",
      data: patient,
    });
  },
);

// @desc accept appointment request from doctor
// @route PATCH /patient/accept-appointment/:dId
// @access private
const acceptAppoinmentRequest = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { id } = req;
    const dId = getSanitizedParam(req.params.dId);
    const { appointmentTitle, appointmentOn, appointmentLink } = req.body;

    if (!appointmentTitle || !appointmentOn || !appointmentLink) {
      res.statusCode = 400;
      throw new Error("Please provide all the details");
    }

    // UPDATE FOR PATIENT
    const conditions = { _id: id };
    const updateBody = {
      $push: {
        appointment: {
          doctorId: dId,
          appointmentTitle,
          appointmentDate: appointmentOn,
          appointementUrl: appointmentLink,
        },
      },
    };
    const patient = await updatePatientDetailsService(conditions, updateBody);
    if (patient instanceof Error) {
      res.statusCode = 400;
      throw patient;
    }

    // UPDATE FOR DOCTOR
    const doctorConditions = { _id: dId };
    const doctorUpdateBody = {
      $push: {
        appointment: {
          patientId: id,
          appointmentTitle,
          appointmentDate: appointmentOn,
          appointementUrl: appointmentLink,
        },
      },
    };
    const doctor = await updateDoctorDetailsService(
      doctorConditions,
      doctorUpdateBody,
    );
    if (doctor instanceof Error) {
      res.statusCode = 400;
      throw doctor;
    }

    return res.status(200).json({
      status: "success",
      message: "Appoinment accepted successfully",
    });
  },
);

// @desc get all the doctors for patient that are available on emergency
// @route GET /patient/doctors-available-on-emergency
// @access private
const doctorsAvailableOnEmergency = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const conditions = { availableOnEmergency: true };
    const attributes = {
      name: 1,
      profileImage: 1,
      speciality: 1,
      qualification: 1,
    };
    const patient = await getDoctorsService(conditions, attributes);
    if (patient instanceof Error) {
      res.statusCode = 400;
      throw patient;
    }

    return res.status(200).json({
      status: "success",
      message: "Emergency updated successfully",
      data: patient,
    });
  },
);

export {
  loginAsPatient,
  registerAsPatient,
  getPatientReports,
  updatePatientReports,
  deletePatientReport,
  getDoctorsListForPatient,
  newChatWithDoctor,
  getPatientMessageList,
  acceptAppoinmentRequest,
  doctorsAvailableOnEmergency,
};
