const mongoose = require("mongoose");
const Case = require("../models/caseModel.js");
const User = require("../models/user.js");
const MasterCase = mongoose.model("MasterCase", Case.schema);
const { ObjectId } = require("mongodb");
const axios = require("axios")
const scheduler = require("./scheduler.js")

// var cases = [
//     { "caseID": "CS001", "severity": 10 },
//     { "caseID": "CS002", "severity": 8 },
//     { "caseID": "CS003", "severity": 7 },
//     { "caseID": "CS005", "severity": 6 },
//     { "caseID": "CS007", "severity": 5 },
//     { "caseID": "CS008", "severity": 9 },
//     { "caseID": "CS010", "severity": 10 },
//     { "caseID": "CS010", "severity": 4 },
//     { "caseID": "CS010", "severity": 6 },
//     { "caseID": "CS010", "severity": 5 },
//     { "caseID": "CS010", "severity": 3 },
//     { "caseID": "CS010", "severity": 2 },
//     { "caseID": "CS010", "severity": 1 }
// ];

// // console.log("Cases", cases);


// exports.schedule = async (cases) => {

//     const queues = [[], [], []];

//     const finalScheduled = [];

//     // Assign cases to different queues based on priority ranges
//     for (const currentCase of cases) {
//         if (currentCase.severity >= 7 && currentCase.severity <= 10) {
//             queues[0].push(currentCase); // Queue 1 for urgent cases (7-10)
//         } else if (currentCase.severity >= 4 && currentCase.severity <= 6) {
//             queues[1].push(currentCase); // Queue 2 for medium priority cases (4-6)
//         } else if (currentCase.severity >= 1 && currentCase.severity <= 3) {
//             queues[2].push(currentCase); // Queue 3 for low-priority cases (1-3)
//         }
//     }

//     // function to sort each queue 
//     // loop on each queues
//     for (let i = 0; i < queues.length; i++) {
//         // const priorityLabel = this.getPriorityLabel(i);
//         // console.log(`${priorityLabel} cases:`);

//         // Sort cases within each queue based on the score (higher scores first)
//         const sortedCases = queues[i].sort((a, b) => b.severity - a.severity);

//         // for (const currentCase of sortedCases) {
//         // console.log(`   Case ${currentCase.name} (Score ${currentCase.score})`);
//         // }
//     }


//     // traverse on queues
//     // if queue is not empty and it is urgent queue then take 3 and put it in scheduled 
//     // else (empty) then ignore
//     // then take 2 from medium same 
//     // then take 1 from low priority

//     let counter = cases.length;
//     let urgentCount = 3;
//     let mediumCount = 2;
//     let lowCount = 1;

//     while (counter > 0) {
//         // Process urgent queue
//         while (urgentCount > 0 && queues[0].length > 0) {
//             finalScheduled.push(queues[0].shift());
//             counter--;
//             urgentCount--;
//         }

//         // Process medium queue
//         while (mediumCount > 0 && queues[1].length > 0) {
//             finalScheduled.push(queues[1].shift());
//             counter--;
//             mediumCount--;
//         }

//         // Process low priority queue
//         while (lowCount > 0 && queues[2].length > 0) {
//             finalScheduled.push(queues[2].shift());
//             counter--;
//             lowCount--;
//         }

//         // Reset counts for the next iteration
//         urgentCount = 3;
//         mediumCount = 2;
//         lowCount = 1;
//     }

//     // console.log("finalScheduled", finalScheduled)

//     return finalScheduled;
// }

exports.scheduleCases = async (req, res) => {
    try {
        console.log("working")
        const { courtID } = req.body;
        console.log(courtID)
        
        console.log("working")
        const caseModel = mongoose.model(`Case_${courtID}`, Case.schema);

        const cases = await caseModel.find({ courtID });

        const scheduledCases = await scheduler.schedule(cases);
        console.log("Scheduled Cases:", scheduledCases);

        res.json(scheduledCases);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
// judge schedule severity 

exports.updateSeverity = async (req, res) => {

    try {
        const { caseID, severity } = req.body;
        // const MasterCase = mongoose.model("MasterCase", Case.schema);
        console.log(caseID);
        console.log(severity);
        const newCaseSeverity = await MasterCase.findByIdAndUpdate({ _id: caseID }, { severity }, {
            new: true,
        });

        console.log("newCase Severity ", newCaseSeverity)
        res.status(200).json({
            success: true,
            newCaseSeverity,
        });
        // next();
    } catch (error) {
        return res.status(500).json({ "error": "Internal server error" });
    }

}

