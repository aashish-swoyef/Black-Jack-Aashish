# Full Stack App (Express + React + Dockerized MySQL & Redis)

This is a full-stack project using:

- **Express.js** for the backend
- **React (Vite)** for the frontend
- **MySQL 8.0** and **Redis** as services via Docker Compose

---

## 📦 Project Structure

├── backend/ # Express backend
├── frontend/ # React Vite frontend
├── docker-compose.yml
└── README.md

---

## 🐳 Docker Services

This project uses Docker Compose to spin up:

- **MySQL 8.0** (port `3306`)
- **Redis** (port `6379`)

---

### 🚀 Getting Started

#### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Start Docker services
   bash
   Copy
   Edit

# Pull images

docker compose pull

# Run services (MySQL and Redis)

docker compose up -d

# See running services

docker compose ps
