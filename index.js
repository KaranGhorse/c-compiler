const editor = document.getElementById('code-editor');

const keywords = [
    "auto", "break", "case", "char", "const", "continue", "default", "do",
    "double", "else", "enum", "extern", "float", "for", "goto", "if", "inline",
    "int", "long", "register", "restrict", "return", "short", "signed",
    "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned",
    "void", "volatile", "while", "_Alignas", "_Alignof", "_Atomic", "_Bool",
    "_Complex", "_Generic", "_Imaginary", "_Noreturn", "_Static_assert",
    "_Thread_local"
  ];

// Syntax highlighting logic
editor.addEventListener('input',formatCCode);

// Auto-close brackets
editor.addEventListener('keydown', (e) => {
  const cursorPosition = window.getSelection().getRangeAt(0).startOffset;
  const code = editor.innerText;

  // Handle {}
  if (e.key === '{') {
    e.preventDefault();
    insertTextAtCursor('{}');
    moveCursor(-1);
  }

  // Handle ()
  if (e.key === '(') {
    e.preventDefault();
    insertTextAtCursor('()');
    moveCursor(-1);
  }
});

// Helper functions
function insertTextAtCursor(text) {
    const selection = window.getSelection(); // 1. Get the current selection.
    const range = selection.getRangeAt(0);   // 2. Get the range object.
  
    range.deleteContents();                  // 3. Remove any selected text (if any).
  
    const textNode = document.createTextNode(text); // 4. Create a new text node with the given text.
    range.insertNode(textNode);             // 5. Insert the new text node at the cursor position.
  
    // 6. Move the cursor between the brackets
    if (text.includes('{') && text.includes('}')) {
      range.setStart(textNode, 2);

      console.dir(range); // Starting container node
        console.log(range.startOffset);        // Move cursor after the `{`.
      range.setEnd(textNode, 1);            // Keep the selection collapsed (cursor only).
         // Move cursor after the `{`.
    } else if (text.includes('(') && text.includes(')')) {
      range.setStart(textNode, 1);          // Move cursor after the `(`.
      range.setEnd(textNode, 1);            // Keep the selection collapsed (cursor only).
    }
  
    selection.removeAllRanges();            // 7. Clear previous selection.
    selection.addRange(range);              // 8. Add modified range back to the selection.
  }
  

function moveCursor(offset) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.setStart(range.startContainer, range.startOffset + offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function placeCursorAtEnd(element) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

(function writeHello() {
    editor.innerText = `#include <stdio.h>
            int main(){
                printf("Hello Mr. Dev");
                return 0;
            }`

            formatCCode()
})()

function formatCCode(){
        let code = editor.innerText;
      
        // Escape HTML to prevent XSS
        code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      
        // Wrap keywords in <span> tags with styles
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'g');
          code = code.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
      
        // Render highlighted code
        editor.innerHTML = code;
      
        // Place cursor at the end
        placeCursorAtEnd(editor);
      
}