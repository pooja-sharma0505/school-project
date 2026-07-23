# School Management System

A modern School Management System built with **Nuxt 3**, **Vue 3**, **Nitro Server**, and **Tailwind CSS**. The application helps manage students, classes, subjects, attendance, exams, fees, and results through an easy-to-use admin interface.

---

# Features

## Dashboard

- School Management Dashboard
- Responsive Layout
- Navigation Sidebar

---

## Students Module

- Add Student
- Edit Student
- Delete Student
- View Student List
- Search Students

---

## Classes Module

- Create Class
- Edit Class
- Delete Class
- View All Classes

---

## Subjects Module

- Add Subject
- Edit Subject
- Delete Subject
- Assign Subjects

---

## Attendance Module

- Mark Daily Attendance
- Update Attendance
- View Attendance Records
- Filter Attendance

---

## Exams Module

- Create Exams
- Edit Exams
- Delete Exams
- Assign Exams to Classes

---

## Results Module

- Enter Student Marks
- Update Existing Results
- Calculate Grades
- Save Results
- Display Student Results

---

## Fees Module

- Add Fee Records
- Edit Fee Details
- Delete Fee Records
- Track Student Payments

---

# Tech Stack

Frontend

- Nuxt 3
- Vue 3
- Tailwind CSS
- Composition API

Backend

- Nitro Server API
- H3

Database

- MySQL

Language

- JavaScript

---

# Project Structure

```
project/

├── components/
│
├── layouts/
│   └── default.vue
│
├── pages/
│   ├── attendance/
│   ├── classes/
│   ├── exams/
│   ├── fees/
│   ├── results/
│   ├── students/
│   ├── subjects/
│   └── index.vue
│
├── server/
│   ├── api/
│   │   ├── attendance/
│   │   ├── classes/
│   │   ├── exams/
│   │   ├── fees/
│   │   ├── results/
│   │   ├── students/
│   │   └── subjects/
│   │
│   └── utils/
│
├── plugins/
├── public/
├── utils/
├── nuxt.config.ts
├── package.json
└── README.md
```

---

# Installation

Clone Repository

```bash
git clone <repository-url>
```

Move into project

```bash
cd project
```

Install Dependencies

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

Default

```
http://localhost:3000
```

If port 3000 is busy

```
http://localhost:3001
```

---

# Build for Production

```bash
npm run build
```

Preview

```bash
npm run preview
```

---

# Database

MySQL Database

Example Tables

- students
- classes
- attendance
- exams
- results
- fees
- subjects

---

# API Structure

Example APIs

```
server/api/students/
server/api/classes/
server/api/attendance/
server/api/exams/
server/api/results/
server/api/fees/
server/api/subjects/
```

Each module supports operations such as:

- GET
- POST
- PUT
- DELETE

---

# Result Management

Features

- Select Exam
- Select Student
- Enter Marks
- Calculate Grade
- Update Existing Result
- Save Results
- Reload Result List

---

# Attendance

- Mark Present
- Mark Absent
- Update Attendance
- View Attendance History

---

# Student Management

- Add Student
- Edit Student
- Delete Student
- Search Students

---

# Class Management

- Add Class
- Edit Class
- Delete Class

---

# Subject Management

- Add Subject
- Edit Subject
- Delete Subject

---

# Fees Management

- Add Fee
- Update Fee
- Delete Fee
- View Payment Records

---

# Exam Management

- Create Exam
- Update Exam
- Delete Exam

---

# Folder Responsibility

## pages/

Contains all application pages.

## server/api/

Contains backend API endpoints.

## components/

Reusable Vue components.

## layouts/

Application layouts.

## plugins/

Nuxt plugins.

## public/

Static assets.

## utils/

Common helper functions.

---

# Technologies Used

- Nuxt 3
- Vue 3
- Composition API
- Tailwind CSS
- Nitro
- H3
- MySQL

---

# Future Improvements

- Authentication
- Role-Based Access Control
- Parent Portal
- Teacher Portal
- Student Portal
- Report Card PDF
- Fee Receipt PDF
- Dashboard Charts
- Notifications
- Email Support
- SMS Alerts
- Bulk Import (Excel/CSV)
- Export Reports
- Audit Logs
- Pagination
- Search Optimization

---

# Scripts

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Preview

```bash
npm run preview
```

Generate Static Site

```bash
npm run generate
```

---

# License

This project is created for learning and educational purposes.

---

# Author

Pooja Sharma