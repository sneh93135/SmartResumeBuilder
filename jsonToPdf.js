const PDFDocument = require("pdfkit");
const fs = require("fs");

// Load resume data from JSON file
const resumeData = JSON.parse(fs.readFileSync("resume.json", "utf-8"));

// Create a new PDF document
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream("resume.pdf"));

// Utility: Add section title
function addSectionTitle(title) {
  doc.moveDown().font("Helvetica-Bold").fontSize(14).text(title, { underline: true });
  doc.moveDown(0.3);
}

// Name & Title
doc.fontSize(20).font("Helvetica-Bold").text(resumeData.name);
doc.fontSize(14).font("Helvetica").text(resumeData.title);

// Contact Info
doc.moveDown();
doc.fontSize(10).text(`${resumeData.contact.phone} | ${resumeData.contact.email} | ${resumeData.contact.portfolio}`);

// Summary
addSectionTitle("Summary");
doc.fontSize(12).font("Helvetica").text(resumeData.summary);

// Skills
addSectionTitle("Skills");
for (const [category, skills] of Object.entries(resumeData.skills)) {
  doc.font("Helvetica-Bold").text(`${category}:`, { continued: true });
  doc.font("Helvetica").text(` ${skills.join(", ")}`);
}

// Experience
addSectionTitle("Experience");
resumeData.experience.forEach((exp) => {
  doc.font("Helvetica-Bold").text(`${exp.role} at ${exp.company}, ${exp.location}`);
  doc.font("Helvetica").text(`${exp.startDate} - ${exp.endDate}`);
  exp.responsibilities.forEach((task) => {
    doc.text(`• ${task}`);
  });
  doc.moveDown();
});

// Education
addSectionTitle("Education");
doc.font("Helvetica-Bold").text(`${resumeData.education.degree} - ${resumeData.education.university}, ${resumeData.education.location}`);
doc.font("Helvetica").text(`Graduation: ${resumeData.education.graduationDate}`);
doc.text(`Coursework: ${resumeData.education.relevantCoursework.join(", ")}`);

// Projects
addSectionTitle("Projects");
resumeData.projects.forEach((proj) => {
  doc.font("Helvetica-Bold").text(proj.name);
  doc.font("Helvetica").text(proj.description);
  doc.moveDown(0.5);
});

// Certifications
addSectionTitle("Certifications");
resumeData.certifications.forEach((cert) => {
  doc.text(`• ${cert}`);
});

// References
addSectionTitle("References");
doc.text(resumeData.references);

// Finalize PDF
doc.end();
console.log("✅ PDF generated: resume.pdf");
