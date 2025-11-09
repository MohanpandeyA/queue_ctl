// testEnqueue.js
import { enqueue, listByState, statusSummary } from './src/repositories/jobsRepo.js';

// Enqueue 3 test jobs — IDs will be auto-generated (uuid)
enqueue({ command: "echo 'First auto job!'" });
enqueue({ command: "echo 'Second auto job!'" });
enqueue({ command: "sleep 1 && echo 'Third auto job!'" });

// Fetch and display all pending jobs
const pendingJobs = listByState('pending');
console.log("\n🧾 Pending Jobs:");
console.table(pendingJobs);

// Show system job summary
const summary = statusSummary();
console.log("\n📊 Job Status Summary:");
console.table(summary);
