// Support file for the library's own specs.
// GoA components use ResizeObserver; Chrome reports "ResizeObserver loop completed with
// undelivered notifications" as a window error when layout changes during a test. It is
// benign and would otherwise fail the test as an uncaught application exception.
Cypress.on("uncaught:exception", (error) => {
  if (/ResizeObserver loop/.test(error.message)) return false;
  return true;
});
