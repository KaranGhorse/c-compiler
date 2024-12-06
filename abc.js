const cKeywords = [
  "auto",
  "break",
  "case",
  "char",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extern",
  "float",
  "for",
  "goto",
  "if",
  "inline",
  "int",
  "long",
  "register",
  "restrict",
  "return",
  "short",
  "signed",
  "sizeof",
  "static",
  "struct",
  "switch",
  "typedef",
  "union",
  "unsigned",
  "void",
  "volatile",
  "while",
  "_Alignas",
  "_Alignof",
  "_Atomic",
  "_Bool",
  "_Complex",
  "_Generic",
  "_Imaginary",
  "_Noreturn",
  "_Static_assert",
  "_Thread_local",
];

let codeBox = document.querySelector(".left");
let outBox = document.querySelector(".right");
let editor = document.querySelector("#code");
let Run = document.querySelector("#runButton");
editor.innerHTML = formatCCode(editor.value);
document
  .getElementById("runButton")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent default behavior of form submission or reload
    let code = editor.value;

    Run.innerHTML = `<i class="fa fa-refresh fa-spin"></i>`;

    editor.innerHTML = formatCCode(code);

    sendCodeUsingAxios(code).then((output) => {
      setOutPut(output);
    });

    Run.innerHTML = `Run <i class="fa-solid fa-play"></i>`;
  });

document.querySelector("#code").addEventListener("keydown", () => {
  let editor = document.querySelector("#code");
  let code = editor.value;

  editor.innerHTML = formatCCode(code);
});

async function sendCodeUsingAxios(code) {
  try {
    const response = await axios.post(
      "https://online-c-compiler-xszv.onrender.com/run",
      { code }
    );
    console.log(response.data.output);
    return response.data.output;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

function setOutPut(output) {
  let outPutContainer = document.querySelector("#output");
  outPutContainer.innerHTML = output;
}

function clearOutPut() {
  let outPutContainer = document.querySelector("#output");
  outPutContainer.innerHTML = "";
}

function formatCCode(unformattedCode) {
  // Splitting code into lines and removing extra spaces
  const lines = unformattedCode.split("\n").map((line) => line.trim());

  // Keywords that need special handling for indentation
  const indentKeywords = ["if", "else", "while", "for", "switch", "{"];
  const dedentKeywords = ["}", "break", "continue"];

  let formattedCode = "";
  let indentLevel = 0;

  lines.forEach((line) => {
    if (!line) return; // Skip empty lines

    const trimmedLine = line.trim();

    // Dedent for lines starting with `}`
    if (dedentKeywords.some((keyword) => trimmedLine.startsWith(keyword))) {
      indentLevel = Math.max(indentLevel - 1, 0);
    }

    // Add indentation
    formattedCode += "  ".repeat(indentLevel) + trimmedLine + "\n";

    // Increase indent level for lines ending with `{`
    if (indentKeywords.some((keyword) => trimmedLine.endsWith(keyword))) {
      indentLevel++;
    }
  });

  return formattedCode.trim(); // Return formatted code without trailing spaces
}

function displayOutput() {
  console.log("out",window.screen.width)
  if (window.screen.width <= 600) {
    outBox.style.display = 'block'
    codeBox.style.display = 'none'
  }
}
function displayCode() {
  console.log(window.screen.width)
  if (window.screen.width <= 600) {
    outBox.style.display = 'none'
    codeBox.style.display = 'block'
  }
}