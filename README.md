# 🚀 QueueCTL — CLI-Based Background Job Queue System

**QueueCTL** is a production-grade **CLI tool** that manages background jobs with retry logic, exponential backoff, and a Dead Letter Queue (DLQ).  
It’s built using **Node.js + SQLite**, supports **multiple concurrent workers**, and provides persistent storage for all jobs.

---

## 🎯 Objective

The goal of this system is to simulate a real-world **job queue engine** similar to Celery or BullMQ — but completely in Node.js and accessible through a single command-line interface.

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Language | Node.js (ES Modules) |
| Database | SQLite (via `better-sqlite3`) |
| CLI Framework | Commander.js |
| Concurrency | Node Worker Processes |
| OS | ✅ Windows (PowerShell)   ✅ Linux/macOS (Bash) |

---

## 🧠 Architecture

```mermaid
flowchart TD
    A[queuectl CLI] --> B[Command Handlers (src/commands)]
    B --> C[Service Layer (src/services)]
    C --> D[Repositories (src/repositories)]
    D --> E[(SQLite Database)]


## 🧠 Folder Structure

queuectl/
├── src/
│   ├── cli.js
│   ├── commands/
│   │   ├── enqueue.js
│   │   ├── worker.js
│   │   ├── list.js
│   │   ├── status.js
│   │   ├── config.js
│   │   └── dlq.js
│   ├── db/
│   │   ├── db.js
│   │   └── schema.sql
│   ├── repositories/
│   │   ├── jobsRepo.js
│   │   ├── dlqRepo.js
│   │   └── configRepo.js
│   └── services/
│       ├── execCommand.js
│       └── worker.js
├── scripts/
│   └── seed-and-test.ps1
├── package.json
├── queue.db
└── README.md


# Clone and enter project
git clone https://github.com/<your-username>/QueueCTL.git
cd QueueCTL

# Install dependencies
npm install

# Register CLI globally
npm link

# Verify
queuectl --help
