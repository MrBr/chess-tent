export class NotificationNotPreparedError extends Error {
  constructor() {
    super();
    this.message = 'Notification not prepared in res.locals.notification';
  }
}
