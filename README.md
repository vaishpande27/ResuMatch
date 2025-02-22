# 📄 Resume Analyzer using Node.js & EJS

A **Resume Analyzer** built with **Node.js, Express, and EJS** that allows users to upload resumes (PDF/DOCX) and match them against a job description to calculate a similarity score.  

## 🚀 Features
✅ Upload resumes in **PDF** or **DOCX** format  
✅ Extract text from resumes using **mammoth (DOCX)** and **pdf-parse (PDF)**  
✅ Match resumes against a **given job description**  
✅ Score calculation using **keyword matching & TF-IDF**  
✅ Modern **dark-themed UI** with Bootstrap  
✅ Fully responsive design  

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Frontend:** EJS, Bootstrap, CSS  
- **File Handling:** Multer  
- **Text Extraction:** `pdf-parse`, `mammoth`  
- **NLP Matching:** `natural` (TF-IDF for better scoring)  

---
## Folder Structure
![projectstructure](https://github.com/user-attachments/assets/f4c47a08-7e73-46df-82c6-17adddca64e5)



## 📥 Installation & Setup


```sh
git clone https://github.com/vaishpande27/resume-analyzer.git
cd resume-analyzer 
npm install
npm start


