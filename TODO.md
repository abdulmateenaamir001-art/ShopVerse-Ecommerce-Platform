# ShopVerse Order Fulfillment Lifecycle - TODO

## Planned implementation (from approved plan)
- [ ] Add lifecycle flags to `shopverse-backend/models/Order.js`
  - isConfirmed/confirmedAt
  - isDispatched/dispatchedAt/trackingNumber/estimatedDelivery
- [ ] Add Admin verification controller + route
  - `PUT /api/orders/:id/confirm`
  - update `isConfirmed`, `confirmedAt`
  - mock notification: "Your payment has been cleared and your order #ID is officially confirmed."
- [ ] Add Admin dispatch controller + route
  - `PUT /api/orders/:id/dispatch`
  - requires trackingNumber + estimatedDelivery
  - guards: paid && confirmed
  - updates dispatched fields
- [ ] Enforce strict deliver guards + mock notification
  - update `PUT /api/orders/:id/deliver`
  - guards: paid && confirmed && dispatched
  - mock notification: "Your package has been successfully marked as delivered."
- [x] Update customer Order View with tracking step progress bar
  - Steps: Paid → Confirmed → Dispatched → Delivered
  - conditional rendering guards (logged-in user)
  - display trackingNumber/estimatedDelivery when dispatched
- [x] Add admin fulfillment panel actions to OrderDetails (confirm/dispatch/deliver)




## After code changes
- [ ] Run backend start and verify endpoints
- [ ] Run frontend and verify OrderDetails tracking UI

