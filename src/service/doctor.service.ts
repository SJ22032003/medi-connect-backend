import DoctorModel from "../models/doctor.model";

export const getOneDoctorDetails = async (conditions: {}, attributes: {}) => {
  try {
    const response = await DoctorModel.findOne(conditions, attributes).populate(
      {
        path: "appointment.patientId",
        model: "Patient",
        select: "name profileImage report",
      },
    );
    if (!response) return new Error("No doctor found");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDoctorsService = async (conditions: {}, attributes: {}) => {
  try {
    const response = await DoctorModel.find(conditions, attributes);
    if (!response) return new Error("No doctor found");
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerAsDoctorService = async (doctorDetails: {}) => {
  try {
    const response = await DoctorModel.create(doctorDetails);
    if (!response) return new Error("doctor not registered");
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDoctorDetailsService = async (
  conditon: {},
  updateBody: {},
) => {
  try {
    const response = await DoctorModel.findOneAndUpdate(conditon, updateBody, {
      new: true,
    });
    if (!response) return new Error("doctor not updated");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDoctorMessageListService = async (
  condtion: {},
  attributes: {},
) => {
  try {
    const res = DoctorModel.findOne(condtion, attributes).populate({
      path: "messageToPatient.pId",
      model: "Patient",
      select: "name profileImage",
    });

    const response = await res.exec();
    if (!response) return new Error("No doctor found");
    return response;
  } catch (error) {
    throw error;
  }
};
