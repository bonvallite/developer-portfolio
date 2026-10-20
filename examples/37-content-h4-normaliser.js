// Demo: upgrade headings only in parsed document nodes, not with regex in raw HTML.
export function normaliseHeadingElements(root) {
  for (const node of [...root.querySelectorAll("h1,h2,h3")]) {
    const replacement = root.ownerDocument.createElement("h4");
    for (const attribute of [...node.attributes]) replacement.setAttribute(attribute.name, attribute.value);
    while (node.firstChild) replacement.appendChild(node.firstChild);
    node.replaceWith(replacement);
  }
  return root;
}
