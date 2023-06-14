import uuid from "short-uuid";
import { mongoose, Document, Schema } from "./mongoose_export";
import { validateEmail, validatePhone } from "../utils/validators.util";
import { IDoctor } from "./doctor.model";

interface IReport {
  reportName: string;
  reportUrl: string;
  reportedBy: string;
  issuedAt: Date;
}

interface IAppointment {
  doctorId: IDoctor;
  appointmentTitle: string;
  appointmentDate: Date;
  appointementUrl: string;
}

interface IMessageToDoctor {
  roomId: string;
  dId: string; // doctor mongo id
  doctor:IDoctor;
}

const MessageToDoctorSchema = new Schema(
  {
    roomId: {
      type: String,
      required: [true, "Room id required"],
      unique: true,
    },
    dId: {
      type: Schema.Types.ObjectId,
      required: [true, "Doctor id required"],
      ref: "Doctor",
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const AppointmentSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      required: [true, "Doctor id required"],
      ref: "Doctor",
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

const ReportSchema = new Schema(
  {
    reportName: String,
    reportUrl: String,
    reportedBy: String,
    issuedAt: Date,
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export interface IPatient extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  age: number;
  profileImage: string;
  report: IReport[];
  appointment: IAppointment[];
  city: string;
  state: string;
  step: number;
  onBoarded: boolean;
  verified: boolean;
  messageToDoctor: IMessageToDoctor[];
}

const PatientSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      validate: [validateEmail, "Please fill a valid email address"],
      required: [true, "Email required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    phone: {
      type: String,
      validate: [validatePhone, "Please fill a valid phone number"],
    },
    address: {
      type: String,
    },
    age: {
      type: Number,
    },
    profileImage: {
      type: String,
      default: () => `https://api.dicebear.com/6.x/lorelei/svg?seed=${uuid.generate()}`,
    },
    report: {
      type: [ReportSchema],
      default: [],
    },
    appointment: {
      type: [AppointmentSchema],
      default: [],
      populate: {
        path: "doctorId",
        model: "Doctor",
        select: "name speciality profileImage qualification",
      },
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    step: {
      type: Number,
      default: 1,
    },
    onBoarded: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    messageToDoctor: {
      type: [MessageToDoctorSchema],
      default: [],
      populate: {
        path: "dId",
        model: "Doctor",
        select: "name speciality profileImage qualification",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "patients",
  },
);

export default mongoose.model<IPatient>("Patient", PatientSchema);
