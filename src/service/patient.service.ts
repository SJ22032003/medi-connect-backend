import patientModel from "../models/patient.model";

export const getOnePatientDetails = async (conditions: {}, attributes: {}) => {
  try {
    const response = await patientModel
      .findOne(conditions, attributes)
      .populate({
        path: "appointment.doctorId",
        model: "Doctor",
        select: "name speciality profileImage qualification",
      });
    if (!response) return new Error("No patient found");
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerAsPatientService = async (patientDetails: {}) => {
  try {
    const response = await patientModel.create(patientDetails);
    if (!response) return new Error("Patient not registered");
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePatientDetailsService = async (
  conditon: {},
  updateBody: {},
) => {
  try {
    const response = await patientModel.findOneAndUpdate(conditon, updateBody, {
      new: true,
    });
    if (!response) return new Error("Patient not updated");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPatientMessageListService = async (
  condtion: {},
  attributes: {},
) => {
  try {
    const res = patientModel.findOne(condtion, attributes).populate({
      path: "messageToDoctor.dId",
      model: "Doctor",
      select: "name profileImage speciality qualification",
    });

    const response = await res.exec();
    if (!response) return new Error("No patient found");
    return response;
  } catch (error) {
    throw error;
  }
};
