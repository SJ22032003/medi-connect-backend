import bcrypt from "bcrypt";
import { IRequestWithRole, IStatusResponse } from "../types/request.type";
import {
  getOneDoctorDetails,
  registerAsDoctorService,
  getDoctorMessageListService,
} from "../service/doctor.service";
import tryCatch from "../utils/try_catch.util";
import generateToken from "../utils/generate_token";

// @desc Register as a doctor
// @route POST /api/v1/public/doctor/register
// @access Public
const registerAsDoctor = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.statusCode = 400;
      throw new Error("Please provide email and password");
    }

    const doesDoctorExists = await getOneDoctorDetails({ email }, { _id: 1 });
    if (!(doesDoctorExists instanceof Error)) {
      res.statusCode = 400;
      throw new Error("Doctor already exists, please login");
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await registerAsDoctorService({
      email,
      password: hashedPassword,
    });
    if (doctor instanceof Error) {
      res.statusCode = 400;
      throw doctor;
    }

    return res.status(201).json({
      status: "success",
      message: "Doctor registered successfully",
      auth_token: generateToken({
        id: doctor.id,
        role: "doctor",
      }),
      step: doctor.step,
    });
  },
);

// @desc login a doctor
// @route POST /api/v1/public/doctor/login
// @access Public
const loginAsDoctor = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.statusCode = 400;
      throw new Error("Please provide email and password");
    }

    const doctor = await getOneDoctorDetails(
      { email },
      { password: 1, _id: 1, name: 1, onBoarded: 1, step: 1 },
    );
    if (doctor instanceof Error) {
      res.statusCode = 404;
      throw doctor;
    }

    const passwordMatch = bcrypt.compare(password, doctor.password);

    if (typeof passwordMatch === "undefined") {
      res.statusCode = 400;
      throw new Error("Invalid Credentials");
    }

    return res.status(200).json({
      status: "success",
      message: "Doctor logged in successfully",
      auth_token: generateToken({
        id: doctor.id,
        role: "doctor",
        name: doctor.name,
      }),
      name: doctor.name,
      onBoarded: doctor.onBoarded,
      step: doctor.step,
      role: "doctor",
    });
  },
);

// @desc get all the message list of doctor
// @route GET /doctor/patient-message-list
// @access private
const getDoctorMessageList = tryCatch(
  async (req: IRequestWithRole, res: IStatusResponse) => {
    const { id } = req;
    // const search = req.query.search as string || "";

    const conditions = { _id: id };
    const attributes = {
      messageToPatient: 1,
      _id: 0,
    };

    const patient = await getDoctorMessageListService(conditions, attributes);
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

export { registerAsDoctor, loginAsDoctor, getDoctorMessageList };
