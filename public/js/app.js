const inputURL = document.querySelector("input.url");
const btnDownload = document.querySelectorAll(".btn-download");

function clickedBtnDownload(e) {
  const url = inputURL.value;
  if (e.target.classList.contains("video")) {
    downloadVideo(url);
  } else if (e.target.classList.contains("mp3")) {
    downloadAudio(url);
  }
}

inputURL.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const url = inputURL.value;
    downloadVideo(url);
  }
});

function downloadVideo(url) {
  if (url) {
    window.location.href = `${window.location.origin}/download?url=${url}`;
    return;
  }
  alert("Please insert your Video URL");
}

function downloadAudio(url) {
  if (url) {
    window.location.href = `${window.location.origin}/mp3?url=${url}`;
    return;
  }
  alert("Please insert your Video URL");
}

btnDownload.forEach((button) =>
  button.addEventListener("click", clickedBtnDownload)
);
