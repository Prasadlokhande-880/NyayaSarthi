const mongoose = require("mongoose");
const Case = require("../models/caseModel.js");
const User = require("../models/user.js");
const MasterCase = mongoose.model("MasterCase", Case.schema);
const { ObjectId } = require("mongodb");
require("dotenv").config();
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const { GoogleAuth } = require("google-auth-library");

async function getAccessToken() {
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return typeof tokenResponse === "string" ? tokenResponse : tokenResponse.token;
}



// exports.addCase = async (req, res) => {
//   try {
//     const { courtID, step, ...restOfData } = req.body;
//     const userID = req.user._id;

//     let caseDetails = {};
//     let petitionerDetails = {};
//     let responderDetails = {};
//     let otherCaseDetails = {};

//     // Extract relevant data based on the step
//     switch (step) {
//       case 1:
//         caseDetails = restOfData;
//         break;
//       case 2:
//         caseDetails = req.user.caseDetails; // Assuming user already has caseDetails from step 1
//         petitionerDetails = restOfData;
//         break;
//       case 3:
//         caseDetails = req.user.caseDetails;
//         petitionerDetails = req.user.petitionerDetails; // Assuming user already has petitionerDetails from step 2
//         responderDetails = restOfData;
//         break;
//       case 4:
//         caseDetails = req.user.caseDetails;
//         petitionerDetails = req.user.petitionerDetails;
//         responderDetails = req.user.responderDetails; // Assuming user already has responderDetails from step 3
//         otherCaseDetails = restOfData;
//         break;
//       default:
//         return res.status(400).json({ error: 'Invalid step' });
//     }

//     const caseModel = mongoose.model(`Case_${courtID}`, Case.schema);

//     const newCase = new caseModel({
//       courtID,
//       userID,
//       ...caseDetails,
//       petitioner: { ...petitionerDetails },
//       responder: { ...responderDetails },
//       ...otherCaseDetails,
//     });

//     await newCase.save();

//     // Update user's details based on the step
//     const updateFields = {};
//     switch (step) {
//       case 1:
//         updateFields.caseDetails = newCase._id;
//         break;
//       case 2:
//         updateFields.petitionerDetails = newCase._id;
//         break;
//       case 3:
//         updateFields.responderDetails = newCase._id;
//         break;
//       case 4:
//         updateFields.otherCaseDetails = newCase._id;
//         break;
//     }

//     await User.findByIdAndUpdate(userID, { $set: updateFields });

//     res.status(201).json({ message: 'Case details added successfully', case: newCase });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.vertexAI = async (req, res) => {
    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/google/models/${MODEL_ID}:predict`;

    const TOKEN = ``;

    let caseId = "CS001";

    const data = {
      instances: [
        {
          content: `You are an assistant that should answer any questions  based on Indian cases also use Indian penal codes and states laws and all the laws of India  if asked, analyze the input to give severity of the case(from 1 to 10 ) based case complexity and nature of case and time to dispose the case and max punishable year from 1-10 along with the sections that could be imposed on it.
          and return Severity of the Case like /Severity of the Case: (\d+)/ this regex

              input: Case ID
              input: Sections acts
              input: case description 
              output: Severity of the Case :

              input: Case ID - ${caseId}
              input: Sections acts : ${sectionsActs}
              input: case description : ${caseDescriptionforModel}
              output:
              `,
        },
      ],
      parameters: {
        candidateCount: 2,
        maxOutputTokens: 1024,
        temperature: 0.9,
        topP: 1,
        topK: 23,
      },
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log(response);
    const prediction = response.data.predictions[0].content;
    console.log(prediction);

    // Function to extract severity of the case using regex and convert to number
    function extractSeverityAsNumber(prediction) {
      const severityRegex = /Severity of the Case: (\d+)/;
      console.log(severityRegex);
      const match = prediction.match(severityRegex);
      if (match && match.length > 1) {
        const severityString = match[1];
        return parseInt(severityString, 10);
      } else {
        return null;
      }
    }

    // Extracting severity of the case as a number
    const getSeverity = extractSeverityAsNumber(prediction);
    let severity = getSeverity;
    if (severity !== null) {
      console.log(`Severity of the case: ${severity}`);
    } else {
      severity = 10;
      // console.log("Severity information not found in the provided data.");
    }

    console.log(severity);
}


exports.addCase = async (req, res) => {
  try {
    const { courtID, ...restOfData } = req.body;

    // case id dynamic
    const caseId = `CS${Date.now()}`;

    // Assuming req.user contains the user information
    const userID = req.user._id;

    // Create a new collection based on courtID
    const caseModel = mongoose.model(`Case_${courtID}`, Case.schema);

    // calculating the severity using the model

    const caseDescriptionforModel = restOfData.caseDetails.caseDescription;
    console.log(caseDescriptionforModel);

    // converting section acts to string
    const sectionsActsArray = restOfData.legalDetails;
    const legalDetailsArray = sectionsActsArray;
    // Convert data to string
    const legalDetailsString = legalDetailsArray
      .map((details) => `${details.act} ${details.section}`)
      .join(", ");
    console.log(legalDetailsString);

    const sectionsActs = legalDetailsString;
    console.log(sectionsActs);

    async function getSeverityFromGemini(caseId, sectionsActs, caseDescription) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an assistant that analyzes Indian legal cases.
        Based on the case details, return a single line:
        "Severity of the Case: (1-10)"

        input: Case ID - ${caseId}
        input: Sections acts: ${sectionsActs}
        input: Case description: ${caseDescription}
        output:
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      console.log("Gemini raw response:", text);


      const match = text.match(/Severity of the Case: (\d+)/);
      return match ? parseInt(match[1], 10) : 10; // default 10 if parsing fails
    }




    // const severity = generateRandomNumber(caseDescriptionforModel);
    const severity = await getSeverityFromGemini(caseId, sectionsActs, caseDescriptionforModel);


    // Create a new document using the specific model
    const newCase = new caseModel({ courtID, userID, severity, ...restOfData });

    // Save the document to the specific courtID table
    await newCase.save();
    console.log("Running");
    // Save the complete case document to the user's cases array
    await User.findByIdAndUpdate(userID, { $push: { cases: newCase.toObject() } });
    // Retrieve the user document
    const user = await User.findById(userID);

    // Add the complete case document to the user's cases array
    user.cases.push(newCase.toObject());

    // Save the updated user document
    await user.save();

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $push: { cases: newCase.toObject() } },
      { new: true } // Return the updated document
    );
    console.log(updatedUser);
    // Update the mastercases table
    const masterCase = new MasterCase({
      courtID,
      userID,
      severity,
      ...restOfData,
    });
    await masterCase.save();

    res.status(201).json({ message: "Case added successfully", case: newCase });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const mastercases = await MasterCase.find();
    res.json(mastercases);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getRestrictedCaseDetails = async (req, res) => {
  try {
    const caseDetails = await MasterCase.find(
      {},
      {
        "petitioner.name": 1,
        causeOfActionDate: 1,
        "responder.name": 1,
        "caseDetails.natureOfCase": 1,
        "caseDetails.caseType": 1,
        "petitioner.mobileNumber": 1,
        _id: 0,
      }
    );

    // Log the first document to inspect its structure
    if (caseDetails.length > 0) {
      console.log("Sample Document:", caseDetails[0]);
    }

    const result = {
      petitionerNames: caseDetails.map((item) =>
        item.petitioner ? item.petitioner.name : null
      ),
      causeOfActionDates: caseDetails.map((item) => item.causeOfActionDate),
      responderNames: caseDetails.map((item) =>
        item.responder ? item.responder.name : null
      ),
      natureOfCases: caseDetails.map((item) =>
        item.caseDetails ? item.caseDetails.natureOfCase : null
      ),
      caseTypes: caseDetails.map((item) =>
        item.caseDetails ? item.caseDetails.caseType : null
      ),
      petitionerMobileNumbers: caseDetails.map((item) =>
        item.petitioner ? item.petitioner.mobileNumber : null
      ),
    };

    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCase = async (req, res) => {
  console.log("delete case");
  const { caseId } = req.params;
  console.log(req.params);
  try {
    const deletedCase = await MasterCase.findByIdAndDelete(caseId);
    if (!deletedCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    // Also remove from user's cases array
    await User.updateMany(
      { "cases._id": caseId },
      { $pull: { cases: { _id: caseId } } }
    );
    
    res.json({ message: "Case deleted successfully", case: deletedCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// for the judge dashboard
exports.getCasesByCourtType = async (req, res) => {
  try {
    const { courtType } = req.params; // Use req.params to get the courtType from the URL
    console.log(courtType);
    const cases = await MasterCase.find({ courtType });
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};



// exports.getCaseById = async (req, res) => {
//   try {
//     const { caseId } = req.params;

//     // Assuming Case is your Mongoose model
//     const caseDetails = await Case.findById(caseId);

//     if (!caseDetails) {
//       return res.status(404).json({ error: 'Case not found' });
//     }

//     res.json(caseDetails);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// exports.getUserCasesDetails = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     console.log("User ID:", userId);
//     const MasterCase = mongoose.model("MasterCase", Case.schema);

//     // const user = await User.findById(userId).populate({
//     //   path: "MasterCase",
//     //   populate: {
//     //     path: "objects", // Adjust this path based on your Case model
//     //   },
//     // });

//     const user = await User.findById({userId});

//     // const user = await User.findById(userId).populate( {path:'cases'});
//     // if (!user) {
//     //   console.log("User not found");

//     //   return res.status(404).json({
//     //     success: false,
//     //     message: "User not found",
//     //   });
//     // }
//     // console.log("User Cases:", user.cases);

//     // Log the objects within each case
//     user.cases.forEach((caseItem) => {
//       console.log(`Case ${caseItem._id}:`, caseItem);
//     });

//     res.status(200).json({
//       success: true,
//       cases: user.cases,
//     });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedCase = await MasterCase.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    
    // Update in user's cases array as well
    await User.updateMany(
      { "cases._id": id },
      { $set: { "cases.$": updatedCase.toObject() } }
    );
    
    res.json({ message: "Case updated successfully", case: updatedCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}