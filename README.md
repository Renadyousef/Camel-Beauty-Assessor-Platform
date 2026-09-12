# 🐪 Camel Mazayen Assessor Platform

An AI-powered platform designed to support **مزايين الإبل (Camel Mazayen)** assessment through Computer Vision, automated scoring, and AI-generated reporting.

The platform analyzes camel images to identify selected Mazayen characteristics, calculates assessment scores, compares participating camels and teams, and generates structured reports.

The platform is designed with **camel festivals and Mazayen events** in mind, where AI can support judges and organizers with faster and more structured assessment.

> **Developed as part of the Tuwaiq Bootcamp.**

---

## 🎯 Project Overview

**مزايين الإبل** is an important part of Saudi heritage and culture, where camels are evaluated based on specific physical characteristics.

This project explores how **AI and Computer Vision** can support the assessment process by analyzing camel images and identifying selected Mazayen characteristics.

The platform provides:

* 📷 Digital camel image assessment
* 🔍 Automatic detection of selected Mazayen characteristics
* 📊 Automated scoring
* 🐪 Individual camel evaluation
* 🏆 Team comparison
* 🤖 AI-generated assessment reports
* 📈 Structured results to support judging decisions

---

## 🏟️ Festival Use Case

The platform is designed around a potential real-world **camel festival and Mazayen competition** workflow.

```text
Camel Registration
       ↓
Image Capture
       ↓
AI-Assisted Assessment
       ↓
Characteristic Detection
       ↓
Score Calculation
       ↓
Team Comparison
       ↓
AI-Generated Report
       ↓
Judge Review
       ↓
Final Result
```

The system is designed to **support judges rather than replace them**, providing structured AI-assisted analysis that can help make the assessment process more efficient and consistent.

---

## 🧠 How It Works

```text
Camel Images
     ↓
Computer Vision
     ↓
Mazayen Characteristics
     ↓
Confidence Scores
     ↓
Camel Scores
     ↓
Team Scores
     ↓
LLM Reporting
     ↓
Assessment Report
```

### 1. Image Assessment

Camel images are uploaded to the platform for analysis.

### 2. Characteristic Detection

The Computer Vision system identifies selected Mazayen characteristics in the images.

### 3. Scoring

The detected characteristics and confidence scores are processed to calculate individual camel scores and team totals.

### 4. Team Comparison

The platform compares participating teams based on their calculated results.

### 5. AI-Generated Reporting

An **LLM** uses the structured assessment results to generate a clear report summarizing the results and overall team performance.

---

## ✨ Key Features

### 🐪 Camel Mazayen Assessment

Analyze camel images and identify selected physical characteristics relevant to Mazayen competitions.

### 🔍 Computer Vision Detection

Automatically identify predefined Mazayen characteristics from camel images.

### 📊 Automated Scoring

Process detection results and confidence scores to calculate camel and team results.

### 🏆 Team Comparison

Compare multiple teams based on their assessment results.

### 🤖 AI-Generated Reports

Use an LLM to transform structured assessment results into easy-to-understand reports.

### 🏟️ Festival-Oriented Design

Designed around a potential festival workflow where AI can assist with large-scale and structured assessments.

### 👨‍⚖️ Human-in-the-Loop

AI predictions and generated reports are intended to **support judges and organizers**, not replace official expert evaluation.

---

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript

### Backend

* Python
* FastAPI
* Computer Vision
* Image Processing

### AI

* Object Detection
* Large Language Model (LLM)
* Custom camel dataset
* Confidence-based scoring

### Development Tools

* Roboflow
* Postman
* Git & GitHub

---

## 📡 API

### Assess Team Camels

```http
POST /winner-camels
```

The endpoint accepts camel images through `multipart/form-data`.

Example fields:

```text
team1_images → camel1.png
team1_images → camel2.png

team2_images → camel3.png
team2_images → camel4.png
```

The system processes the images, performs the assessment, calculates the results, and uses the structured results to generate the reporting output.

---

## 📊 Scoring

The assessment follows a general scoring flow:

```text
Detected Characteristics
          ↓
Confidence Scores
          ↓
Camel Score
          ↓
Team Total Score
          ↓
Team Comparison
```

The resulting scores are passed to the reporting layer to generate a human-readable assessment summary.

---

## 🤖 AI-Generated Reporting

The platform uses an **LLM as a reporting layer**.

The LLM receives structured assessment results and generates a report that can summarize:

* Detected Mazayen characteristics
* Individual camel results
* Team scores
* Overall team performance
* Assessment observations

The Computer Vision system performs the visual assessment, while the LLM transforms the results into a readable report.

---

## ⚠️ Current Scope

The current system is an **AI-assisted Mazayen assessment prototype**.

The system demonstrates how AI can support camel assessment and festival workflows. Further validation with domain experts and official judging criteria would be required before deployment in an official live competition.

---

## 👥 Team

Developed during the **Tuwaiq Bootcamp** by:

* **Renad**
* **Joud**
* **Reema**
* **Shahad**

---

## 🙏 Acknowledgments

* Tuwaiq Academy
* King Abdulaziz Camel Festival
* Ultralytics
* Roboflow

---

## 🔒 License

**All Rights Reserved.**

This project and its source code are proprietary to the project team.

The code, models, datasets, documentation, and other project materials may **not be copied, modified, distributed, published, or used for commercial or personal projects without explicit written permission from the project team.**

© 2026 Renad, Joud, Reema, and Shahad.
