const cases = require('./RandomCases.js');

exports.schedule = async (cases) => {

    const queues = [[], [], []];

    const finalScheduled = [];

    // Assign cases to different queues based on priority ranges
    for (const currentCase of cases) {
        if (currentCase.severity >= 7 && currentCase.severity <= 10) {
            this.queues[0].push(currentCase); // Queue 1 for urgent cases (7-10)
        } else if (currentCase.score >= 4 && currentCase.score <= 6) {
            this.queues[1].push(currentCase); // Queue 2 for medium priority cases (4-6)
        } else if (currentCase.score >= 1 && currentCase.score <= 3) {
            this.queues[2].push(currentCase); // Queue 3 for low-priority cases (1-3)
        }
    }

    // function to sort each queue 
    // loop on each queues
    for (let i = 0; i < this.queues.length; i++) {
        // const priorityLabel = this.getPriorityLabel(i);
        // console.log(`${priorityLabel} cases:`);

        // Sort cases within each queue based on the score (higher scores first)
        const sortedCases = this.queues[i].sort((a, b) => b.score - a.score);

        // for (const currentCase of sortedCases) {
        // console.log(`   Case ${currentCase.name} (Score ${currentCase.score})`);
        // }
    }


    // traverse on queues
    // if queue is not empty and it is urgent queue then take 3 and put it in scheduled 
    // else (empty) then ignore
    // then take 2 from medium same 
    // then take 1 from low priority

    let counter = cases.length;
    let urgentCount = 3;
    let mediumCount = 2;
    let lowCount = 1;

    while (counter > 0) {
        // Process urgent queue
        while (urgentCount > 0 && queues[0].length > 0) {
            finalScheduled.push(queues[0].shift());
            counter--;
            urgentCount--;
        }

        // Process medium queue
        while (mediumCount > 0 && queues[1].length > 0) {
            finalScheduled.push(queues[1].shift());
            counter--;
            mediumCount--;
        }

        // Process low priority queue
        while (lowCount > 0 && queues[2].length > 0) {
            finalScheduled.push(queues[2].shift());
            counter--;
            lowCount--;
        }

        // Reset counts for the next iteration
        urgentCount = 3;
        mediumCount = 2;
        lowCount = 1;
    }

    console.log("finalScheduled", finalScheduled)

    return finalScheduled;
}


class MLFQ {
    constructor(queues) {
        this.queues = queues;
    }

    schedule(cases) {

        const finalScheduled = [];
        // Assign cases to different queues based on priority ranges
        for (const currentCase of cases) {
            if (currentCase.score >= 7 && currentCase.score <= 10) {
                this.queues[0].push(currentCase); // Queue 1 for urgent cases (7-10)
            } else if (currentCase.score >= 4 && currentCase.score <= 6) {
                this.queues[1].push(currentCase); // Queue 2 for medium priority cases (4-6)
            } else if (currentCase.score >= 1 && currentCase.score <= 3) {
                this.queues[2].push(currentCase); // Queue 3 for low-priority cases (1-3)
            }
        }

        // function to sort each queue 
        // loop on each queues
        for (let i = 0; i < this.queues.length; i++) {
            const priorityLabel = this.getPriorityLabel(i);
            // console.log(`${priorityLabel} cases:`);

            // Sort cases within each queue based on the score (higher scores first)
            const sortedCases = this.queues[i].sort((a, b) => b.score - a.score);

            // for (const currentCase of sortedCases) {
            // console.log(`   Case ${currentCase.name} (Score ${currentCase.score})`);
            // }
        }


        // traverse on queues
        // if queue is not empty and it is urgent queue then take 3 and put it in scheduled 
        // else (empty) then ignore
        // then take 2 from medium same 
        // then take 1 from low priority

        let counter = cases.length;
        let urgentCount = 3;
        let mediumCount = 2;
        let lowCount = 1;

        while (counter > 0) {
            // Process urgent queue
            while (urgentCount > 0 && queues[0].length > 0) {
                finalScheduled.push(queues[0].shift());
                counter--;
                urgentCount--;
            }

            // Process medium queue
            while (mediumCount > 0 && queues[1].length > 0) {
                finalScheduled.push(queues[1].shift());
                counter--;
                mediumCount--;
            }

            // Process low priority queue
            while (lowCount > 0 && queues[2].length > 0) {
                finalScheduled.push(queues[2].shift());
                counter--;
                lowCount--;
            }

            // Reset counts for the next iteration
            urgentCount = 3;
            mediumCount = 2;
            lowCount = 1;
        }

        console.log("finalScheduled", finalScheduled)

        // for (let i = 0; i < this.queues.length; i++) {
        //   const priorityLabel = this.getPriorityLabel(i);
        //   console.log(`${priorityLabel} cases:`);

        //   // Sort cases within each queue based on the score (higher scores first)
        //   const sortedCases = this.queues[i].sort((a, b) => b.score - a.score);

        //   for (const currentCase of sortedCases) {
        //     console.log(`   Case ${currentCase.name} (Score ${currentCase.score})`);
        //   }
        // }
        return finalScheduled;
    }

    getPriorityLabel(queueIndex) {
        // Get the priority label for a given queue index
        switch (queueIndex) {
            case 0:
                return "Urgent";
            case 1:
                return "Medium Priority";
            case 2:
                return "Low Priority";
            default:
                return `Queue ${queueIndex + 1}`;
        }
    }
}

// Example usage with 10 cases
// queue "Urgent queue, Medium Queue and Low Queue"
const queues = [[], [], []]; // Three queues with different priorities
const mlfq = new MLFQ(queues);

const temp1 = async () => {
    mlfq.schedule(cases);
}

module.exports = temp1;
