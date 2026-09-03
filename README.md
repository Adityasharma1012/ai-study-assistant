# 🎓 AI Study Assistant

An intelligent, modern, and responsive **AI-powered study platform** designed to help students learn, practice, organize, and track their academic progress from a single dashboard.

The AI Study Assistant combines an AI chatbot, AI-generated notes, quiz generation, study planning, progress tracking, subject management, and learning resources into one platform.

---

## 🌐 Live Demo

🚀 **Live Website:**  
https://adityasharma1012.github.io/ai-study-assistant/

---

## 📌 Project Overview

Students often use multiple applications for studying, taking notes, preparing quizzes, managing schedules, and tracking their progress.

The **AI Study Assistant** aims to solve this problem by providing a centralized platform where students can manage their entire study workflow.

The application provides an AI-powered assistant that can answer questions, explain difficult concepts, generate study material, create quizzes, and help students build personalized study plans.

---

## 🎯 Purpose of the Project

The main purpose of this project is to create a **personalized digital study companion** that makes learning more organized, interactive, and efficient.

### The project aims to:

- 🤖 Provide AI-powered academic assistance
- 📚 Generate study notes automatically
- 🧠 Create practice quizzes
- 📅 Generate personalized study plans
- 📊 Track academic progress
- 📖 Organize subjects and topics
- 🔗 Save useful learning resources
- 💬 Allow students to interact with an AI tutor
- 📱 Provide a responsive experience across devices

---

# ✨ Features

## 🤖 AI Study Assistant

A ChatGPT-style AI assistant designed specifically for learning.

Students can ask questions such as:

> Explain binary search simply.

> Explain recursion with an example.

> What is the difference between TCP and UDP?

> Write a C++ program for binary search.

> Explain operating systems.

The assistant can provide:

- Concept explanations
- Programming help
- Mathematical solutions
- Technical explanations
- Study guidance
- Exam preparation
- Interview preparation

### Chat Features

- Real-time AI responses
- Conversation history
- Follow-up questions
- Loading/typing indicator
- Copy AI response
- Regenerate response
- Clear conversation
- Suggested questions
- Local chat persistence

---

## 📝 AI Notes Generator

Generate structured study notes from a subject and topic.

Users can specify:

- Subject
- Topic
- Difficulty
- Notes length

Generated notes include:

- Topic overview
- Key concepts
- Definitions
- Examples
- Important points
- Summary
- Important questions

Users can also:

- Save notes
- Copy notes
- Download notes
- Delete notes

---

## 🧠 AI Quiz Generator

Generate quizzes based on a selected topic.

### Quiz options

- Subject
- Topic
- Difficulty
- Number of questions

### Quiz features

- Multiple-choice questions
- Automatic scoring
- Correct answer explanations
- Percentage calculation
- Performance summary
- Weak-topic identification
- Revision recommendations
- Quiz history

---

## 📅 AI Study Planner

Create personalized study schedules based on:

- Subjects
- Topics
- Exam dates
- Available study hours
- Difficulty level

The planner generates daily tasks containing:

- Subject
- Topic
- Priority
- Estimated study time
- Completion status

Students can:

- Add tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Search tasks
- Filter tasks

---

## 📊 Progress Tracking

The dashboard provides visual insights into the student's learning progress.

It can track:

- Study hours
- Weekly activity
- Subject progress
- Quiz performance
- Completed topics
- Study streak
- Overall progress

Charts and statistics help students understand their strengths and weaknesses.

---

## 📚 Subject Management

Students can create and manage subjects.

Each subject can contain:

- Subject name
- Description
- Topics
- Progress
- Study hours
- Notes
- Quiz history

Example subjects:

- Data Structures
- DBMS
- Operating Systems
- Computer Networks
- Artificial Intelligence

---

## 🔗 Learning Resources

Students can save useful learning materials such as:

- Websites
- YouTube videos
- PDFs
- Documents
- Other resources

Resources can be:

- Added
- Edited
- Deleted
- Searched
- Filtered
- Opened directly

---

## 📈 Dashboard

The dashboard provides a quick overview of the student's academic activity.

It includes:

- Study streak
- Total study hours
- Overall progress
- Quiz performance
- Today's tasks
- Upcoming exams
- Subject progress
- Weekly study activity
- Recent activity

---

# 🛠️ Technologies Used

## Frontend

### React

Used to build the interactive user interface using reusable components.

### Vite

Used as the development environment and build tool for fast development and optimized production builds.

### JavaScript

Used for application logic, state management, API communication, and data processing.

### Tailwind CSS

Used to create the responsive and modern UI.

---

## 🤖 Artificial Intelligence

### Google Gemini API

The AI functionality is designed to use the **Google Gemini API** for dynamic responses.

Gemini can power:

- AI Assistant
- Notes generation
- Quiz generation
- Study plan generation

The application uses a dedicated AI service layer so the AI provider can be changed in the future without rewriting the UI.

---

## 💾 Data Storage

### LocalStorage

LocalStorage is used for development and client-side persistence.

It stores:

- Chat history
- Notes
- Quizzes
- Study tasks
- Subjects
- Resources
- Progress information
- User preferences

The architecture can later be migrated to a real database.

---

# 🏗️ Project Architecture

```text
AI Study Assistant
│
├── Frontend
│   ├── React
│   ├── Vite
│   └── Tailwind CSS
│
├── AI Layer
│   └── aiService.js
│       ├── askAI()
│       ├── generateNotes()
│       ├── generateQuiz()
│       └── generateStudyPlan()
│
├── Data Layer
│   └── LocalStorage
│
└── Deployment
    └── GitHub Pages
```
