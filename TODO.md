- [ ] Fix src/pages/Dashboard.jsx crash: remove inner `transactions` redeclaration causing TDZ.
- [ ] Define `alerts` and `categories` without using mockData (fetch from Firestore where possible) or guard to avoid ReferenceError.
- [ ] Normalize transaction date usage (transactionDate vs date) in recent transactions rendering.
- [ ] Run build/dev to confirm Dashboard renders without runtime errors.

