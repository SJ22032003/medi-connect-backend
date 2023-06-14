import uuid from "short-uuid";
import { mongoose, Document, Schema } from "./mongoose_export";
import { validateEmail, validatePhone } from "../utils/validators.util";
import { IPatient } from "./patient.model";

interface IMessageToPatient {
  roomId: string;
  pId: string; // patient mongo id
  patient: IPatient;
}

interface IAppointment {
  patientId: IPatient;
  appointmentTitle: string;
  appointmentDate: Date;
  appointementUrl: string;
}

const MessageToPatientSchema = new Schema({
  roomId: {
    type: String,
    required: [true, "Room id required"],
    unique: true,
  },
  pId: {
    type: Schema.Types.ObjectId,
    required: [true, "Patient Id reuqired"],
    ref: "Patient",
  },
});

const AppointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      required: [true, "Patient id required"],
      ref: "Patient",
    },
    appointmentTitle: {
      type: String,
      required: [true, "Appointment title required"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date required"],
    },
    appointementUrl: {
      type: String,
      required: [true, "Appointment url required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  age: number;
  profileImage: string;
  city: string;
  state: string;
  step: number;
  onBoarded: boolean;
  speciality: string;
  experience: number;
  qualification: string;
  verified: boolean;
  messageToPatient: IMessageToPatient[];
  appointment: IAppointment[];
}

const DoctorSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      validate: [validateEmail, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      trim: true,
      minlength: [6, "Password should be atleast 6 characters long"],
    },
    phone: {
      type: String,
      trim: true,
      validate: [validatePhone, "Please add a valid phone number"],
    },
    address: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [25, "Age should be greater than 25"],
      max: [100, "Age should be less than 100"],
    },
    profileImage: {
      type: String,
      default: () => `https://api.dicebear.com/6.x/lorelei/svg?seed=${uuid.generate()}`,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    step: {
      type: Number,
      default: 1,
    },
    onBoarded: {
      type: Boolean,
      default: false,
    },
    speciality: {
      type: String,
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: [0, "Experience should be greater than 0"],
      max: [100, "Experience should be less than 100"],
    },
    messageToPatient: {
      type: [MessageToPatientSchema],
      default: [],
      populate: {
        path: "pId",
        model: "Patient",
        select: "name profileImage",
      },
    },
    appointment: {
      type: [AppointmentSchema],
      default: [],
      populate: {
        path: "patientId",
        model: "Patient",
        select: "name profileImage report",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "doctors",
  },
);

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);
