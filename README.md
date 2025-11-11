# 🗒️ To-Do Interface

A lightweight, interactive task manager designed to explore **team assignment flows**, **due-date validation**, and **interface clarity**.  
Built with HTML, CSS, and jQuery — designed through a product design lens focusing on hierarchy, usability, and persistence.

---

## 🎯 Overview

This project prototypes a clean and intuitive **to-do list interface** for small teams.  
Users can add teammates, assign tasks with due dates, and view work grouped by assignee.  
Each decision — from alphabetical sorting to automatic due-date defaults — was made to reduce friction and help users stay organized.

---

## 🎨 Design Process

**Goal:**  
Design an interface that simplifies the process of assigning, tracking, and completing tasks across multiple teammates.

**Key Design Decisions**
- **Two-Step Flow:** Separate “Add Teammate” and “Assign Task” to mirror real-world collaboration.
- **Smart Defaults:** If a due date isn’t selected, it defaults to tomorrow — encouraging short-term, achievable deadlines.
- **Error Prevention:** Prevents duplicate teammate names and disallows past due dates.
- **Visual Hierarchy:** Uses spacing, contrast, and subtle color to group sections clearly.
- **Empty States:** Contextual “No tasks right now” message keeps users oriented and avoids blank screens.

**Inspiration:**  
Minimal project dashboards and tools like Notion and Asana, simplified into a single-screen web app.

---

## ✨ Features

- ➕ Add teammates dynamically  
- 🧑‍💼 Assign tasks with due dates  
- 🧾 Tasks grouped and sorted by teammate + due date  
- ✅ Mark complete, clear completed tasks, or reset the board  
- 💾 Persistent local state with `localStorage`  
- 📱 Responsive and keyboard-accessible layout

---

## 🧩 Tech Stack

- **HTML5 + CSS3** for structure and visual design  
- **jQuery** for dynamic DOM manipulation and event handling  
- **LocalStorage** for persistent session data  
- **Vanilla JS logic** for sorting, validation, and date defaults  

---

## ♿ Accessibility & Usability

- Keyboard-friendly tab navigation  
- Minimum date validation prevents invalid input  
- Clear focus states for all interactive elements  
- High color contrast and consistent spacing for readability  
- Empty-state message uses semantic HTML for assistive clarity  

---

## 💡 Challenges & Learnings

Designing this interface reinforced the relationship between **interaction design** and **data logic**.  
Even in a small project, seemingly simple decisions — like when to validate inputs or how to sort teammates — shape how users perceive flow and trust the system.  
Balancing flexibility (open inputs) with constraints (no duplicates, valid dates) made the UI feel both empowering and safe.

---

## 🔭 Future Improvements

- Replace `alert()` boxes with inline error messages for smoother UX  
- Add dark mode and improved mobile layout  
- Animate task transitions for a more responsive feel  
- Migrate to **React** and **TypeScript** for modular scalability  
- Add a lightweight backend or API integration to simulate collaboration data

---
