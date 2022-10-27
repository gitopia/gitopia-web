# Coding Guidelines

- We use tabs to indent, and interpret tabs as 2 spaces.
- Variables name should follow Camel casing.
- Make your code readable and sensible. You may put comments if needed.
- Code must not consist of any `yarn lint` errors.
- Multi-line comments include their delimiters on separate lines from
  the text. E.g.
  ```
  *
  g
  .
  /
  ```
- Avoid introducing a new dependency.

As for more concrete guidelines, just imitate the existing code (this is a good guideline, no matter which project you are contributing to). It is always preferable to match the _local_ convention. New code added to Git suite is expected to match the overall style of existing code. Modifications to existing code is expected to match the style the surrounding code already uses (even if it doesn't match the overall style of existing code).
