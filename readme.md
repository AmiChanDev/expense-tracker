# Expense Tracker 💸

A full-stack Expense Tracker application built with React, Vite, TypeScript, and Material-UI for a sleek and responsive frontend, paired with a robust Nodejs, Express, MySQL, and TypeScript backend.
Track your expenses effortlessly with a modern, user-friendly interface and a secure, scalable API. 🚀

## ✨ Features

- Add, Edit, Delete Expenses: Seamlessly manage your expenses.
- Categorize Expenses: Organize expenses by category for better insights.
- Persistent Storage: Store data securely in a MySQL database.
- RESTful API: Reliable backend API for smooth data operations.
- Responsive Design: Built with Material-UI for a polished, mobile-friendly UI.
- Type Safety: TypeScript ensures robust code on both frontend and backend.

## 📂 Project Structure

```
expense-tracker/
├── frontend/ # React + Vite frontend
│ ├── src/
│ │    ├── routes/
│ ├── package.json
│ └── ...
├── backend/ # Node.js + Express backend
│ ├── src/
│ ├── package.json
│ └── ...
└── README.md
```

## 🛠️ Prerequisites

Ensure you have the following installed before setting up the project:

- Node.js[](https://nodejs.org/) (v18+ recommended)
- npm[](https://www.npmjs.com/)
- MySQL[](https://www.mysql.com/) server (running locally or remotely)

## ⚙️ Installation

Follow these steps to get the project up and running:

### 1. Clone the Repository

```
git clone https://github.com/AmiChanDev/expense-tracker.git
cd expense-tracker
```

### 2. Install Frontend Dependencies

```
cd frontend
npm install
```

### 3. Install Backend Dependencies

```
cd ../backend
npm install
```

### 4. Configure Environment Variables

Create a .env file in the backend/ directory with your MySQL credentials:

- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=your_password
- DB_NAME=expense_tracker
- PORT=5000
- JWT_SECRET=your JWT secret

## 🚀 Running the Project

### 1. Start the Backend Server

```
cd backend
npm start
The backend API will be available at: http://localhost:5000
```

### 2. Start the Frontend Development Server

```
cd frontend
npm run dev
Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173).
```

## 📜 Scripts

### Frontend (frontend/package.json)

| Command         | Description                         |
| --------------- | ----------------------------------- |
| npm run dev     | Starts the development server       |
| npm run build   | Builds the production bundle        |
| npm run preview | Previews the production build       |
| npm run lint    | Runs ESLint for code quality checks |

### Backend (backend/package.json)

| Command   | Description                            |
| --------- | -------------------------------------- |
| npm start | Starts the backend server with ts-node |

## 🤝 Contributing

I welcome contributions to make this project even better! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch:
   git checkout -b feature/my-feature
3. Commit your changes:
   git commit -am "Add my feature"
4. Push to the branch:
   git push origin feature/my-feature
5. Create a Pull Request on GitHub.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🌟 Acknowledgments

- Built with love by AmiChanDev[](https://github.com/AmiChanDev).
- Powered by React[](https://reactjs.org/), Vite[](https://vitejs.dev/), Material-UI[](https://mui.com/), Node.js[](https://nodejs.org/), Express[](https://expressjs.com/), and MySQL[](https://www.mysql.com/).

---

Happy tracking! 💰
