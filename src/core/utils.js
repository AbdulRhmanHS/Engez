export function getUniqueName(baseName, existingNames) {
    // 1. Filter names that start with our base
    const similar = existingNames.filter(name => name.startsWith(baseName));

    if (similar.length === 0) return baseName;

    let maxNumber = 1;
    similar.forEach(name => {
        const match = name.match(/\((\d+)\)$/);
        if (match) {
            const num = parseInt(match[1]);
            if (num > maxNumber) maxNumber = num;
        } else if (name.trim() === baseName.trim()) {
            // If the exact base name exists, we treat it as (1)
            maxNumber = Math.max(maxNumber, 1);
        }
    });

    // If only the base name exists, return (2), otherwise max + 1
    return `${baseName} (${maxNumber + 1})`;
}


export function makeEditable(editableEl, targetObj, property = "name") {
  let previousValue = targetObj[property];
  editableEl.contentEditable = true;

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

    editableEl.contentEditable = false;
  });

  // Prevent new lines, confirm edit with Enter
  editableEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editableEl.textContent.trim() !== "") editableEl.blur();
    }
  });
}

export function findTaskElement(obj, container = document) {
  return Array.from(container.querySelectorAll(".task")).find(
    (el) => el.taskObj === obj
  );
}