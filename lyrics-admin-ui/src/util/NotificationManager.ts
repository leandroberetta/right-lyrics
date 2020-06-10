import { ToastConsumerContext } from "react-toast-notifications";

export default class NotificationManager {
  context?: ToastConsumerContext;
  constructor(context?: ToastConsumerContext) {
    this.context = context;
  }

  success(title: string) {
    this.context?.add(title, {
      appearance: "success",
      autoDismiss: true,
    });
  }

  error(title: string) {
    this.context?.add(title, {
      appearance: "error",
      autoDismiss: true,
    });
  }
}
