🚀 CodeX: The Ultimate Online Code Execution Platform
💡 About CodeX
CodeX is a secure, efficient, and feature-rich online code execution platform that allows users to write, execute, and review code in multiple programming languages—all from a sleek and intuitive interface. Whether you're a student, developer, or interviewer, CodeX ensures a seamless coding experience with real-time execution feedback, robust security, and an elegant multi-tab editor.

✨ Features
✅ Multi-Language Support – Run code in Java, Python, JavaScript, and more.
✅ Secure Sandbox Execution – Docker-based isolation for safe code execution.
✅ Lightning-Fast Performance – Optimized backend for rapid response times.
✅ Multi-Tab Editor – Write and manage multiple files effortlessly.
✅ Execution Insights – View execution time, memory usage, and error messages.
✅ Rate Limiting – Prevents abuse with 10 API calls/hour per user.
✅ JWT Authentication – Ensures a secure user environment.
✅ Resource Constraints – 5s execution time limit, restricted filesystem access.
✅ Optional Logging – Track execution history for debugging or learning.

🛠️ Tech Stack
Frontend:
React – Modern UI with a smooth developer experience.
Monaco Editor – Feature-rich multi-tab code editor.
Backend:
Node.js with Express / FastAPI / Spring Boot – Scalable and efficient API.
Docker – Isolated code execution environment.
MongoDB  – Secure and scalable database storage.
📦 Installation & Setup
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/anandbhardwaj456/codeEditor
cd codex
2️⃣ Install Dependencies
Frontend
bash
Copy
Edit
cd frontend
npm install
npm start
Backend
bash
Copy
Edit
cd backend
npm install
npm start
3️⃣ Run with Docker (Optional)
bash
Copy
Edit
docker-compose up --build
📌 API Endpoints
Method	Endpoint	Description
POST	/execute	Run code securely in a sandbox
POST	/auth/login	Authenticate users via JWT
POST	/auth/signup	Register new users
GET	/history	Retrieve execution logs
🚀 Contributing
We welcome contributions! If you’d like to enhance CodeX, follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature-name)
Commit changes (git commit -m "Added new feature")
Push to branch (git push origin feature-name)
Open a Pull Request
🔐 Security
CodeX enforces strict security measures:

Rate Limiting to prevent abuse
Docker Sandbox for safe execution
JWT Authentication for secure access
Restricted File Access to avoid exploits

🌟 Star this repo if you like it! 🚀
Happy Coding! 💻✨
