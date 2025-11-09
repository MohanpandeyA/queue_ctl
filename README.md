# 🚀 QueueCTL — CLI-Based Background Job Queue System

**QueueCTL** is a production-grade **CLI tool** that manages background jobs with retry logic, exponential backoff, and a Dead Letter Queue (DLQ).  
It’s built using **Node.js + SQLite**, supports **multiple concurrent workers**, and provides persistent storage for all jobs.

---

## 🎯 Objective

The goal of this system is to simulate a real-world **job queue engine** (like Celery or BullMQ) — but implemented entirely in Node.js and controlled through a clean command-line interface.

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Language | Node.js (ES Modules) |
| Database | SQLite (via `better-sqlite3`) |
| CLI Framework | Commander.js |
| Concurrency | Node Worker Processes |
| OS | ✅ Windows (PowerShell) ✅ Linux/macOS (Bash) |

---

## 🧠 Architecture

```mermaid
flowchart TD
    A["queuectl CLI"] --> B["Command Handlers - src/commands"]
    B --> C["Service Layer - src/services"]
    C --> D["Repositories - src/repositories"]
    D --> E["SQLite Database (Persistent Store)"]
