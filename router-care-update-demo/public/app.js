const form = document.getElementById("commentForm");
const comment = document.getElementById("comment");
const counter = document.getElementById("counter");
const errorBox = document.getElementById("error");
const stepComment = document.getElementById("stepComment");
const stepLoading = document.getElementById("stepLoading");
const stepDone = document.getElementById("stepDone");
const progressBar = document.getElementById("progressBar");
const restartBtn = document.getElementById("restartBtn");

comment.addEventListener("input", () => {
  counter.textContent = `${comment.value.length} / 1000`;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.textContent = "";

  const value = comment.value.trim();
  if (!value) {
    errorBox.textContent = "Please enter a comment before continuing.";
    return;
  }

  try {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: value })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not save your comment.");
    }

    stepComment.classList.add("hidden");
    stepLoading.classList.remove("hidden");

    let progress = 0;
    const timer = setInterval(() => {
      progress += 5;
      progressBar.style.width = `${Math.min(progress, 100)}%`;

      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          stepLoading.classList.add("hidden");
          stepDone.classList.remove("hidden");
        }, 350);
      }
    }, 90);
  } catch (error) {
    errorBox.textContent = error.message;
  }
});

restartBtn.addEventListener("click", () => {
  comment.value = "";
  counter.textContent = "0 / 1000";
  progressBar.style.width = "0%";
  stepDone.classList.add("hidden");
  stepComment.classList.remove("hidden");
  comment.focus();
});
