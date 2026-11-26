const jobDescription = document.querySelector("#job-description");
const jobCount = document.querySelector("#job-count");
const sampleJobButton = document.querySelector("#sample-job");
const sampleResumeButton = document.querySelector("#sample-resume");
const resumeInput = document.querySelector("#resume-file");
const dropZone = document.querySelector("#drop-zone");
const uploadTitle = document.querySelector("#upload-title");
const fileStatus = document.querySelector("#file-status");
const form = document.querySelector("#resume-form");
const formMessage = document.querySelector("#form-message");

const sampleJobDescription =
  "Senior Frontend Engineer — Stripe\n\nWe are looking for an engineer experienced in React, TypeScript, and accessible design systems to lead checkout performance and UI architecture. You will work closely with product and design teams to build reliable, intuitive experiences. Strong communication skills and a focus on quality are essential.";

function makeSampleResume() {
  const content = [
    "BT /F1 18 Tf 72 720 Td (Sample Resume) Tj",
    "0 -32 Td /F1 12 Tf (Alex Morgan - Software Engineer) Tj",
    "0 -24 Td (Experience: Frontend Engineer, 2021-2025) Tj",
    "0 -20 Td (Skills: JavaScript, React, TypeScript, CSS) Tj",
    "0 -20 Td (Education: BS Computer Science) Tj ET",
  ].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new File([pdf], "sample-resume.pdf", { type: "application/pdf" });
}

function updateJobCount() {
  const count = jobDescription.value.trim().length;
  jobCount.textContent = `${count} chars`;
  jobCount.classList.toggle("is-ready", count >= 100);
}

function showFile(file) {
  const validExtension = /\.(pdf|docx)$/i.test(file.name);
  const validMimeType = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ].includes(file.type);

  fileStatus.classList.remove("is-error", "is-success");
  if ((!validExtension && !validMimeType) || file.size > 10 * 1024 * 1024) {
    fileStatus.textContent = file.size > 10 * 1024 * 1024
      ? "That file is over 10 MB. Choose a smaller resume."
      : "Unsupported file type. Please choose a PDF or DOCX file.";
    fileStatus.classList.add("is-error");
    resumeInput.value = "";
    uploadTitle.innerHTML = "Drag and drop your resume here or<br /> browse files";
    return false;
  }

  uploadTitle.textContent = file.name;
  const sizeLabel = file.size >= 1024 * 1024
    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : `${Math.max(1, Math.round(file.size / 1024))} KB`;
  fileStatus.textContent = `${file.name} · ${sizeLabel}`;
  fileStatus.classList.add("is-success");
  formMessage.textContent = "";
  return true;
}

jobDescription.addEventListener("input", updateJobCount);

sampleJobButton.addEventListener("click", () => {
  jobDescription.value = sampleJobDescription;
  updateJobCount();
  jobDescription.focus();
});

resumeInput.addEventListener("change", () => {
  if (resumeInput.files?.[0]) showFile(resumeInput.files[0]);
});

sampleResumeButton.addEventListener("click", () => {
  const transfer = new DataTransfer();
  const file = makeSampleResume();
  transfer.items.add(file);
  resumeInput.files = transfer.files;
  showFile(file);
});

for (const eventName of ["dragenter", "dragover"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
}

dropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files[0];
  if (!file) return;

  const transfer = new DataTransfer();
  transfer.items.add(file);
  resumeInput.files = transfer.files;
  showFile(file);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.classList.remove("is-error", "is-success");

  if (jobDescription.value.trim().length < 100) {
    formMessage.textContent = "Please enter at least 100 characters of job description.";
    formMessage.classList.add("is-error");
    jobDescription.focus();
    return;
  }

  if (!resumeInput.files?.[0]) {
    formMessage.textContent = "Please upload a PDF or DOCX resume to continue.";
    formMessage.classList.add("is-error");
    resumeInput.focus();
    return;
  }

  formMessage.textContent =
    "Your details are ready. Resume optimization will be available when the processing service is connected.";
});
