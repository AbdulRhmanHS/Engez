import { getProjects } from "./data";


export function getUniqueName(baseName) {
    // Filter only project names starting with the same base name
    const similar = getProjects().map(p => p.name).filter(name => name.startsWith(baseName));

    if (similar.length === 0) return baseName;

    // Extract numbers from names like "Default Project (2)"
    let maxNumber = 1;
    similar.forEach(name => {
      const match = name.match(/\((\d+)\)$/);
      if (match) {
          const num = parseInt(match[1]);
          if (num > maxNumber) maxNumber = num;
      } else if (name === baseName) {
          // plain base name counts as (1)
          maxNumber = Math.max(maxNumber, 1);
      }
    });

    return `${baseName} (${maxNumber + 1})`;
}


export function makeEditable(editableEl, targetObj, property = "name") {
  let previousValue = targetObj[property];

  // Update the object as user types
  editableEl.addEventListener("input", (e) => {
    targetObj[property] = e.target.textContent;
  });

  // Restore last valid value if field is empty
  editableEl.addEventListener("blur", () => {
    const trimmed = targetObj[property].trim();

    if (trimmed === "") {
      targetObj[property] = previousValue;
      editableEl.textContent = previousValue;
    } else {
      targetObj[property] = trimmed;
      previousValue = trimmed;
    }
  });

  // Prevent new lines, confirm edit with Enter
  editableEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editableEl.textContent.trim() !== "") editableEl.blur();
    }
  });
}