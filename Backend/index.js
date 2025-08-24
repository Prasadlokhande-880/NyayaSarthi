const express = require('express');
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require('cors');
const corsOptions = require('./config/corsOptions.js');
const credentials = require('./middleware/credentials.js');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error.js");
const axios = require('axios');
const scheduleController = require('./controller/scheduleController.js')


const app = express();
app.use(morgan('tiny'));

// Cors access 
app.use(credentials);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cors({
    origin: [
        "https://ssu-admin.vercel.app",
        "https://ssu-8uh2.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ]
}))


// Accepting Cookies from client
app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// error middleware
app.use(errorHandler);

const port = process.env.PORT || 5000;

dotenv.config();
// connect mongodb from here
const connect = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to Database successfully on " + process.env.MONGO_URI);
        })
        .catch((err) => {
            throw err;
        });
};

// async function main() {
//     const scheduledCases = await scheduleController.schedule(cases);
//     console.log("Scheduled Cases:", scheduledCases);
// }
// main().then(() => { console.log("this is the scheduled ") })

// Calling the Model of ML to find severity of the case

// const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
// const PROJECT_ID = "global-incline-407709";
// const MODEL_ID = "text-bison";
// const LOCATION_ID = "us-central1";
// const TOKEN = `ya29.a0AfB_byAILi9IQvGMS54K982uoNkS904E3DAoNCOGLmmjK3rjBVgfLYdQSO_coqBvbLaGu2ywK-y1KU0b2e0I1UEsbYOquQfwYdY-bPwrwQ9Y8j_VCf4RZXQ_SMkj8qtaDiZ4HL6D8FV9CZAwwYI2TLUtUUkcieABi0hEgOZn4XgkOqUQ49KHWVzOM2rJgTM_CgXAIEflQPOVoaU5wylBMUtNrJ2qWi3zuAvu1PHPMMeZl0127FCxaCM78gNC8bif5Ok_AKEYIrZ2A8dEXtu8Z48BYsOalwOxzYgg0n3W61DC__LCfm0QamMzUFruHsbXAzFhi405Ws3XHJz1tKlXs_DhtDooEPfinxOjnX41F4YQ3qBitbpIV80Bno5sCMhd8-NQucaedSNJOL2BoPlRg9ayYA1yuYdgaCgYKAecSARISFQHGX2MiOp1DUJhJ_RiB20SNA9E1yg0423`;


// app.post('/predict', async (req, res) => {
//     try {
//         // const { caseId, sectionsActs, caseDescription } = req.body; // Extract data from request body
//         let caseId = "CS001";
//         let sectionsActs = "IPC 302"
//         let caseDescription = "A man accused to murder his wife"


//         const data = {
//             instances: [
//                 {
//                     content: `You are an assistant that should answer any questions based on Indian cases also use Indian penal codes and states laws and all the laws of India if asked, analyze the input to give severity of the case(from 1 to 10 ) based case complexity and nature of case and time to dispose the case and max punishable year from 1-10 along with the sections that could be imposed on it.

//                   input: Case ID
//                   input: Sections acts
//                   input: case description 
//                   output: Severity of the Case :

//                   input: Case ID - ${caseId}
//                   input: Sections acts : ${sectionsActs}
//                   input: case description : ${caseDescription}
//                   output:
//                   `,
//                 },
//             ],
//             parameters: {
//                 candidateCount: 2,
//                 maxOutputTokens: 1024,
//                 temperature: 0.9,
//                 topP: 1,
//                 topK: 23,
//             },
//         };

//         const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/google/models/${MODEL_ID}:predict`;

//         try {

//             const response = await axios.post(url, data, {
//                 headers: {
//                     'Authorization': `Bearer ${TOKEN}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             console.log(response);
//             const prediction = response.data.predictions[0].content; // Extract prediction from response
//             console.log(prediction);

//             // Function to extract severity of the case using regex and convert to number
//             function extractSeverityAsNumber(prediction) {
//                 const severityRegex = /\Severity of the Case:\*\*\ (\d+(?:\/\d+)?)/;
//                 const match = prediction.match(severityRegex);
//                 if (match && match.length > 1) {
//                     const severityString = match[1];
//                     return parseInt(severityString, 10);
//                 } else {
//                     return null;
//                 }
//             }

//             // Extracting severity of the case as a number
//             const severity = extractSeverityAsNumber(prediction);
//             if (severity !== null) {
//                 console.log(`Severity of the case: ${severity}`);
//             } else {
//                 console.log("Severity information not found in the provided data.");
//             }


//             res.json({ prediction, severity }); // Send prediction as JSON response
//         } catch (err) {
//             console.log("this is error of axios :- ", err.response ? err.response.data : err.message);
//             console.log(err);
//         }
//     } catch (error) {
//         console.error(error);
//         console.log("this is error :- ");
//         res.status(500).json({ error: error.message }); // Handle error
//     }
// });







//routes 
const Route = require('./routes/router.js');
app.use('/api/', Route);

app.listen(port, () => {
    connect();
    console.log("Connected to Server Successfully on port " + port);
});