"use client";
import { useContext } from "react";
import { PopupContext } from "../utils/context/popup_provider";

export default function PopupComponent() {
  const { isOpen, component, setComponent } = useContext(PopupContext);

  if (!component) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
        <button
          onClick={() => setComponent(null)}
          className="absolute top-4 right-4 text-white bg-red-500 px-4 py-2 rounded cursor-pointer"
        >
          Close
        </button>
        {component}
      </div>
    </div>
  );
}
