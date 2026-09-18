"use client";

import React, { Fragment } from "react";
import {
  MdCheckCircle,
  MdCancel,
  MdDeleteForever,
  MdOutlineClose,
  MdDownload,
  MdSend,
  MdErrorOutline,
} from "react-icons/md";
import {
  Transition,
  Dialog,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";

export type ModalProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  showIcon?: boolean;
  variant?:
    | "success"
    | "error"
    | "warning"
    | "delete"
    | "downloading"
    | "sendMessage";
  size?: "small" | "medium" | "large" | "viewer" | "full";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const modalMaxWidths = {
  small: "28rem",
  medium: "42rem",
  large: "56rem",
  viewer: "72rem",
  full: "calc(100vw - 40px)",
} as const;

const Modal = ({
  children,
  isOpen,
  onClose,
  className,
  style,
  title,
  showIcon = true,
  variant = "success",
  size = "small",
}: ModalProps) => {
  const variantStyles = {
    success: {
      bgColor: "bg-feedback-success-soft",
      icon: <MdCheckCircle className="h-6 w-6 text-feedback-success-content" />,
    },
    error: {
      bgColor: "bg-feedback-danger-soft",
      icon: <MdCancel className="h-6 w-6 text-feedback-danger-content" />,
    },
    warning: {
      bgColor: "bg-feedback-warning-soft",
      icon: (
        <MdErrorOutline className="h-6 w-6 text-feedback-warning-content" />
      ),
    },
    downloading: {
      bgColor: "bg-feedback-info-soft",
      icon: <MdDownload className="h-6 w-6 text-feedback-info-content" />,
    },
    delete: {
      bgColor: "bg-feedback-info-soft",
      icon: <MdDeleteForever className="h-6 w-6 text-feedback-info-content" />,
    },
    sendMessage: {
      bgColor: "bg-feedback-info-soft",
      icon: <MdSend className="h-6 w-6 text-feedback-info-content" />,
    },
  };

  const { bgColor, icon } = variantStyles[variant];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-modal gap-0"
        aria-label={title ? undefined : "Janela de diálogo"}
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-overlay/50 backdrop-blur-[1px]" />
        </TransitionChild>
        <div className="portal-safe-modal fixed inset-0 overflow-y-auto gap-0">
          <div className="flex min-h-full items-center justify-center p-5 gap-0">
            <DialogPanel
              className={`relative flex max-h-[calc(100dvh-40px)] max-w-[calc(100vw-40px)] flex-col space-y-5 overflow-x-hidden overflow-y-auto rounded-sm bg-surface-card p-5 shadow-md transition-all ${className ?? ""}`}
              style={{
                ...style,
                width: "100%",
                maxWidth: modalMaxWidths[size],
              }}
            >
              <div className="absolute right-5 top-5 flex items-center justify-end">
                <button
                  type="button"
                  aria-label="Fechar janela"
                  onClick={onClose}
                  className="inline-flex h-6 w-6 touch-manipulation items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                >
                  <MdOutlineClose
                    aria-hidden="true"
                    size={20}
                    className="text-content-secondary"
                  />
                </button>
              </div>

              {showIcon && (
                <div aria-hidden="true" className="flex justify-center p-0">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${bgColor}`}
                  >
                    {icon}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {title && (
                  <DialogTitle
                    as="h3"
                    className="text-xl font-extrabold text-center"
                  >
                    {title}
                  </DialogTitle>
                )}
                {children}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;

