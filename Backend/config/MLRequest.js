
const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
const PROJECT_ID = "global-incline-407709";
const MODEL_ID = "text-bison";
const LOCATION_ID = "us-central1";
const TOKEN = `ya29.a0AfB_byBLgoShq9ZILtpLu61vREPDAh5iVZv3oqAT3CO1lYZ4_FEbJL_kJVIJE58wcPW1XmNdjahPys2z0fkJuZCEdF7MevKrxaDVrmI7FkZb_-tF-_tP1MVBuV4o5PaP8cdrLJht7jjewLpjbW375XXUZOkkpE5cxwH8M6xjI6dWrhvyWpSux0c38ULpj8YIkTNFxuiqBdr6QuOOv0HXRLPbTty69ju8fsKmcZIVhI-Z5pq57MmTkbWBIh0xY705DI4D2auEZI-rSQrcS7VzLEtaLy1gydlvx7cLwEmy3OOwzIWcQHiULSNdCtC-M0SLpDliHNgcDhrcG3C5wl2A-5lucJX3vdLsuX8rI0fXicUKW1mG-e2Q0A3zoL8w9D8esqpczLFnGr26vSsnflj_U-a76oowfqVeaCgYKAZESARISFQHGX2Mil_8kTujZdKX4XTSTeBfUDg0423`;


app.post('/predict', async (req, res) => {
    try {
        // const { caseId, sectionsActs, caseDescription } = req.body; // Extract data from request body
        let caseId = "CS001";
        let sectionsActs = "IPC 302"
        let caseDescription = "A man accused to murder his wife"


        const data = {
            instances: [
                {
                    content: `You are an assistant that should answer any questions based on Indian cases also use Indian penal codes and states laws and all the laws of India if asked, analyze the input to give severity of the case(from 1 to 10 ) based case complexity and nature of case and time to dispose the case and max punishable year from 1-10 along with the sections that could be imposed on it.
        
                  input: Case ID
                  input: Sections acts
                  input: case description 
                  output: Severity of the Case :
        
                  input: Case ID - ${caseId}
                  input: Sections acts : ${sectionsActs}
                  input: case description : ${caseDescription}
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

        const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/google/models/${MODEL_ID}:predict`;

        try {

            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            console.log("this is error of axios :- ", err.response ? err.response.data : err.message);
            console.log(err);
        }
        console.log(response);
        const prediction = response.data.predictions[0]; // Extract prediction from response
        res.json({ prediction }); // Send prediction as JSON response
    } catch (error) {
        console.error(error);
        console.log("this is error :- ");
        res.status(500).json({ error: error.message }); // Handle error
    }
});

