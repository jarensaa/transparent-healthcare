import React, { FunctionComponent } from "react";
import { Toaster, Position, Intent } from "@blueprintjs/core";

type ToastContextProps = {
  showSuccess(message: string): void;
  showFailure(message: string): void;
};

const ToastContext = React.createContext<ToastContextProps>({
  showSuccess: () => {},
  showFailure: () => {}
});

const AppToaster = Toaster.create({
  position: Position.TOP_RIGHT
});

const ToastContextProvider: FunctionComponent = ({ children }) => {
  const showToast = (message: string, intent: Intent) => {
    AppToaster.show({
      message: message,
      intent: intent,
      timeout: 5000
    });
  };

  const showSuccess = (message: string) => {
    showToast(message, Intent.SUCCESS);
  };

  const showFailure = (message: string) => {
    showToast(message, Intent.DANGER);
  };

  return (
    <ToastContext.Provider
      value={{ showSuccess: showSuccess, showFailure: showFailure }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContextProvider };
export default ToastContext;
