'use strict';

// Project-maintained mitigation for GHSA-vfj7-8cjw-p6xm. Bound braces AND
// parentheses before recursive walkers, including callers passing an AST.
const MAX_DEPTH = 100;
const assertDepth = depth => {
  if (depth > MAX_DEPTH) throw new SyntaxError('Brace AST nesting exceeds maximum depth (100)');
};

const validateAst = ast => {
  const stack = [{ node: ast, depth: 0 }];
  const seen = new WeakSet();
  while (stack.length > 0) {
    const { node, depth } = stack.pop();
    if (!node || !node.nodes) continue;
    assertDepth(depth);
    if (seen.has(node)) throw new SyntaxError('Cyclic or shared brace AST');
    seen.add(node);
    for (const child of node.nodes) stack.push({ node: child, depth: depth + 1 });
  }
};

module.exports = { assertDepth, validateAst };
