const urlInput = document.getElementById("url");
const manualFolderInput = document.getElementById("folder-text");
const generateBtn = document.getElementById("generate-btn");
const outputArea = document.getElementById("output");
const copyBtn = document.getElementById("copy-btn"); // Added missing definition
const copyBanner = document.getElementById('copy-banner');

const typeSelect = document.getElementById("type");
const sourceSelect = document.getElementById("source");
const qualitySelect = document.getElementById("quality");

// Populate quality options based on type and source
function populateQualityOptions() {
  qualitySelect.innerHTML = "";

  if (typeSelect.value === "mp3") {
    const qualities = [
      { value: "0", label: "Best" },
      { value: "5", label: "128 kbps" },
      { value: "9", label: "64 kbps" },
    ];
    qualities.forEach(({ value, label }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      qualitySelect.appendChild(option);
    });
  } else if (typeSelect.value === "mp4") {
    const qualities = [
      { value: "best", label: "Best (Original)" },
      { value: "1080", label: "1080p" },
      { value: "720", label: "720p" },
      { value: "480", label: "480p" },
      { value: "360", label: "360p" },
    ];
    qualities.forEach(({ value, label }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      qualitySelect.appendChild(option);
    });
  }
}

// Copy button click handler
copyBtn.addEventListener("click", () => {
  outputArea.select();
  document.execCommand("copy");

  // Show banner
  copyBanner.classList.add('show');

  // Hide after 2 seconds
  setTimeout(() => {
    copyBanner.classList.remove('show');
  }, 2000);
});

typeSelect.addEventListener("change", () => {
  populateQualityOptions();
});

generateBtn.addEventListener("click", () => {
  generateCommand();
  autoResizeTextarea(outputArea);
});

function generateCommand() {
  const url = urlInput.value.trim();
  const folder = manualFolderInput.value.trim();

  if (!url) {
    alert("Please enter a URL!");
    return;
  }

  let command = "";

  if (folder) {
    command += `cd "${folder}"\n`;
  }

  command += "yt-dlp ";

  const type = typeSelect.value;
  const source = sourceSelect.value;
  const quality = qualitySelect.value;

  if (type === "mp3") {
    command += "-x --audio-format mp3 ";

    if (quality === "0") {
      command += "--audio-quality 0 ";
    } else {
      command += `--audio-quality ${quality} `;
    }

    command += "--embed-thumbnail --add-metadata ";
  } else if (type === "mp4") {
    if (quality === "best") {
      command += '-f "bestvideo+bestaudio/best" --merge-output-format mp4 ';
    } else {
      command += `-f "bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]" --merge-output-format mp4 `;
    }
  }

  if (source === "playlist") {
    command += `-o "%(playlist_index)s - %(title)s.%(ext)s" `;
  } else {
    command += `-o "%(title)s.%(ext)s" `;
  }

  command += `"${url}"`;

  outputArea.value = command;
}

// Auto resize textarea height based on content
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto'; // reset height
  textarea.style.height = textarea.scrollHeight + 'px'; // set to scroll height
}

// On page load
window.addEventListener("load", () => {
  populateQualityOptions();
  autoResizeTextarea(outputArea);
});
