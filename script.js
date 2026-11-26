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
const heroCopy = document.querySelector(".hero-copy");
const heroSection = document.querySelector(".hero");
const howSection = document.querySelector(".how-section");
const optimizationView = document.querySelector("#optimization-view");
const resultsView = document.querySelector("#results-view");
const progressTitle = document.querySelector("#progress-title");
const progressMode = document.querySelector("#progress-mode");
const progressFilename = document.querySelector("#progress-filename");
const progressRoleName = document.querySelector("#progress-role-name");
const progressCurrentText = document.querySelector("#progress-current-text");
const progressStepCount = document.querySelector("#progress-step-count");
const progressPercent = document.querySelector("#progress-percent");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const progressFooter = document.querySelector("#progress-footer");
const progressOutcome = document.querySelector("#progress-outcome");
const optimizationSuccess = document.querySelector("#optimization-success");
const demoOutcomeTitle = document.querySelector("#demo-outcome-title");
const demoOutcomeMessage = document.querySelector("#demo-outcome-message");
const cancelButton = document.querySelector("#cancel-optimization");
const backButton = document.querySelector("#back-to-form");
const startAnotherButton = document.querySelector("#start-another");
const optimizeAnotherButton = document.querySelector("#optimize-another");
const resumeTab = document.querySelector("#resume-tab");
const letterTab = document.querySelector("#letter-tab");
const resumePreview = document.querySelector("#resume-preview");
const letterPreview = document.querySelector("#letter-preview");
const previewButtons = [...document.querySelectorAll("[data-preview]")];
const downloadButtons = [...document.querySelectorAll("[data-download]")];
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const progressSteps = [...document.querySelectorAll(".progress-step")];
let activeRequest;

const sampleJobDescription =
  "Senior Frontend Engineer — Stripe\n\nWe are looking for an engineer experienced in React, TypeScript, and accessible design systems to lead checkout performance and UI architecture. You will work closely with product and design teams to build reliable, intuitive experiences. Strong communication skills and a focus on quality are essential.";

const sampleDocuments = {
  resume: {
    filename: "Alex_Morgan_Demo_Resume.pdf",
    lines: [
      { text: "DEMO SAMPLE - NOT YOUR RESUME", size: 9, bold: true, gap: 30 },
      { text: "Alex Morgan", size: 20, bold: true, gap: 25 },
      { text: "Frontend Software Engineer", size: 12, bold: true, gap: 19 },
      { text: "San Francisco, CA | alex.morgan@example.test", size: 9, gap: 26 },
      { text: "PROFESSIONAL SUMMARY", size: 11, bold: true, gap: 18 },
      { text: "Frontend engineer focused on accessible React experiences,", size: 9, gap: 14 },
      { text: "reliable design systems, and web performance.", size: 9, gap: 22 },
      { text: "WORK EXPERIENCE", size: 11, bold: true, gap: 19 },
      { text: "Frontend Engineer - Northstar Labs (2022 - Present)", size: 9, bold: true, gap: 16 },
      { text: "Built reusable React and TypeScript customer workflows.", size: 9, gap: 14 },
      { text: "Improved accessibility and Core Web Vitals across product pages.", size: 9, gap: 14 },
      { text: "Partnered with design and product teams on reliable UI updates.", size: 9, gap: 21 },
      { text: "Software Engineer - Brightline Systems (2020 - 2022)", size: 9, bold: true, gap: 16 },
      { text: "Delivered responsive dashboards and shared components.", size: 9, gap: 14 },
      { text: "Added automated tests and documented frontend patterns.", size: 9, gap: 21 },
      { text: "SKILLS", size: 11, bold: true, gap: 18 },
      { text: "React, TypeScript, JavaScript, Accessibility, CSS, Testing", size: 9, gap: 22 },
      { text: "EDUCATION", size: 11, bold: true, gap: 18 },
      { text: "B.S. Computer Science - Example State University", size: 9 },
    ],
  },
  letter: {
    filename: "Alex_Morgan_Demo_Cover_Letter.pdf",
    lines: [
      { text: "DEMO SAMPLE - FICTIONAL CONTENT", size: 9, bold: true, gap: 30 },
      { text: "Alex Morgan", size: 20, bold: true, gap: 22 },
      { text: "San Francisco, CA | alex.morgan@example.test", size: 9, gap: 36 },
      { text: "Dear Hiring Team,", size: 10, bold: true, gap: 25 },
      { text: "I am excited to apply for the Senior Frontend Engineer role.", size: 10, gap: 18 },
      { text: "My experience building accessible React applications and", size: 10, gap: 16 },
      { text: "reusable TypeScript components aligns with this opportunity.", size: 10, gap: 29 },
      { text: "At Northstar Labs, I partnered with design and product teams", size: 10, gap: 16 },
      { text: "to improve customer workflows and strengthen frontend", size: 10, gap: 16 },
      { text: "performance. I enjoy turning complex requirements into clear,", size: 10, gap: 16 },
      { text: "reliable experiences.", size: 10, gap: 29 },
      { text: "I would welcome the opportunity to bring that focus to your", size: 10, gap: 16 },
      { text: "team. Thank you for your consideration.", size: 10, gap: 29 },
      { text: "Sincerely,", size: 10, gap: 18 },
      { text: "Alex Morgan", size: 10, bold: true },
    ],
  },
};

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
  if ((!validExtension && !validMimeType) || file.size > MAX_FILE_BYTES) {
    fileStatus.textContent = file.size > MAX_FILE_BYTES
      ? "That file is over 4 MB. Choose a smaller resume."
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

function resetProgress() {
  progressSteps.forEach((step) => {
    step.classList.remove("is-active", "is-done", "is-error");
    step.querySelector(".progress-status").textContent = "Queued";
  });
  progressCurrentText.textContent = "Preparing demo";
  progressStepCount.textContent = "Step 1 of 6";
  progressPercent.textContent = "0%";
  progressTrack.setAttribute("aria-valuenow", "0");
  progressFill.style.width = "0%";
  progressOutcome.hidden = true;
  optimizationSuccess.hidden = true;
  progressFooter.hidden = false;
  progressMode.textContent = "Demo Mode · Simulated Progress";
  progressTitle.textContent = "Previewing the Optimization Process";
}

function updateProgress(event) {
  const { step, status, percent, detail } = event;
  if (!Number.isInteger(step) || step < 0 || step >= progressSteps.length) {
    throw new Error("The demo received an invalid progress update.");
  }

  progressSteps.forEach((element, index) => {
    const stepStatus = element.querySelector(".progress-status");
    element.classList.remove("is-active", "is-done", "is-error");

    if (index < step || (index === step && status === "done")) {
      element.classList.add("is-done");
      stepStatus.textContent = "Done";
    } else if (index === step && status === "in_progress") {
      element.classList.add("is-active");
      stepStatus.textContent = "In progress";
    } else {
      stepStatus.textContent = "Queued";
    }
  });

  const currentStep = progressSteps[step];
  progressCurrentText.textContent = currentStep.querySelector("h2").textContent;
  progressStepCount.textContent = `Step ${step + 1} of ${progressSteps.length}`;
  progressPercent.textContent = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(percent));
  progressFill.style.width = `${percent}%`;
  if (detail) currentStep.querySelector("p").textContent = detail;
}

function showDemoPaused() {
  const activeStep = progressSteps.find((step) => step.classList.contains("is-active"));
  if (activeStep) {
    activeStep.classList.remove("is-active");
    activeStep.querySelector(".progress-status").textContent = "Paused";
  }
  progressMode.textContent = "Demo Paused";
  progressCurrentText.textContent = "Demo paused";
  demoOutcomeTitle.textContent = "Demo paused.";
  demoOutcomeMessage.textContent =
    "No files were processed or sent. You can return to your application or run the demo again.";
  progressFooter.hidden = true;
  progressOutcome.hidden = false;
  optimizationSuccess.hidden = false;
}

function waitForDemoStep(signal, duration) {
  if (signal.aborted) return Promise.resolve(false);
  return new Promise((resolve) => {
    const finish = (completed) => {
      clearTimeout(timer);
      signal.removeEventListener("abort", cancel);
      resolve(completed);
    };
    const cancel = () => finish(false);
    const timer = setTimeout(() => finish(true), duration);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

async function runDemo(signal) {
  const details = [
    "Demo: previewing the resume-reading stage. Your file stays in this browser.",
    "Demo: previewing how the role requirements would be reviewed.",
    "Demo: previewing how matching skills would be identified.",
    "Demo: previewing how resume edits would be prepared.",
    "Demo: previewing how a personalized cover letter would be drafted.",
    "Demo: previewing how downloadable documents would be prepared.",
  ];

  for (let step = 0; step < progressSteps.length; step += 1) {
    if (signal.aborted) return false;
    updateProgress({
      step,
      status: "in_progress",
      percent: Math.max(8, Math.round((step / progressSteps.length) * 100)),
      detail: details[step],
    });
    if (!await waitForDemoStep(signal, 850)) return false;
    updateProgress({
      step,
      status: "done",
      percent: Math.round(((step + 1) / progressSteps.length) * 100),
      detail: details[step],
    });
  }
  return true;
}

function showResultsView() {
  heroSection.hidden = true;
  howSection.hidden = true;
  resultsView.hidden = false;
  selectPreview("resume");
  resultsView.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function escapePdfText(text) {
  return text
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[\\()]/g, "\\$&");
}

function createSamplePdf(documentType) {
  const lines = sampleDocuments[documentType].lines;
  let y = 750;
  const content = lines.map((line) => {
    const font = line.bold ? "F2" : "F1";
    const command = `BT /${font} ${line.size} Tf 54 ${y} Td (${escapePdfText(line.text)}) Tj ET`;
    y -= line.gap ?? 16;
    return command;
  }).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
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
  return new Blob([pdf], { type: "application/pdf" });
}

function selectPreview(documentType) {
  const showResume = documentType === "resume";
  resumeTab.classList.toggle("is-selected", showResume);
  resumeTab.setAttribute("aria-selected", String(showResume));
  resumeTab.tabIndex = showResume ? 0 : -1;
  letterTab.classList.toggle("is-selected", !showResume);
  letterTab.setAttribute("aria-selected", String(!showResume));
  letterTab.tabIndex = showResume ? -1 : 0;
  resumePreview.hidden = !showResume;
  letterPreview.hidden = showResume;
}

function startAnotherDemo() {
  resultsView.hidden = true;
  heroSection.hidden = false;
  howSection.hidden = false;
  showFormView();
  jobDescription.value = "";
  resumeInput.value = "";
  uploadTitle.innerHTML = "Drag and drop your resume here or<br /> browse files";
  fileStatus.textContent = "";
  fileStatus.classList.remove("is-error", "is-success");
  updateJobCount();
  heroSection.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function showProgressView(file, jobDescription) {
  resetProgress();
  heroCopy.hidden = true;
  form.hidden = true;
  optimizationView.hidden = false;
  progressFilename.textContent = file.name;
  progressFilename.title = file.name;
  progressRoleName.textContent = jobDescription.split(/\r?\n/)[0].trim() || "Target role";
  updateProgress({
    step: 0,
    status: "in_progress",
    percent: 8,
    detail: "Demo: previewing the resume-reading stage. Your file stays in this browser.",
  });
  optimizationView.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

function showFormView() {
  const request = activeRequest;
  activeRequest = undefined;
  request?.abort();
  optimizationView.hidden = true;
  heroCopy.hidden = false;
  form.hidden = false;
  formMessage.textContent = "";
}

async function startDemo() {
  const description = jobDescription.value.trim();
  const file = resumeInput.files?.[0];
  formMessage.classList.remove("is-error", "is-success");

  if (description.length < 100) {
    formMessage.textContent = "Please enter at least 100 characters of job description.";
    formMessage.classList.add("is-error");
    jobDescription.focus();
    return;
  }
  if (!file) {
    formMessage.textContent = "Please upload a PDF or DOCX resume to continue.";
    formMessage.classList.add("is-error");
    resumeInput.focus();
    return;
  }

  showProgressView(file, description);
  const controller = new AbortController();
  activeRequest = controller;
  try {
    const completed = await runDemo(controller.signal);
    if (activeRequest === controller) {
      if (completed) showResultsView();
      else showDemoPaused();
    }
  } finally {
    if (activeRequest === controller) activeRequest = undefined;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  startDemo();
});

cancelButton.addEventListener("click", () => activeRequest?.abort());
backButton.addEventListener("click", showFormView);
startAnotherButton.addEventListener("click", startDemo);
optimizeAnotherButton.addEventListener("click", startAnotherDemo);
resumeTab.addEventListener("click", () => selectPreview("resume"));
letterTab.addEventListener("click", () => selectPreview("letter"));
[resumeTab, letterTab].forEach((tab) => {
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextTab = tab === resumeTab ? letterTab : resumeTab;
    selectPreview(nextTab === resumeTab ? "resume" : "letter");
    nextTab.focus();
  });
});
previewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectPreview(button.dataset.preview);
    document.querySelector(".document-preview").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  });
});
downloadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const documentType = button.dataset.download;
    const sample = sampleDocuments[documentType];
    if (!sample) return;
    const url = URL.createObjectURL(createSamplePdf(documentType));
    const link = document.createElement("a");
    link.href = url;
    link.download = sample.filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
});
