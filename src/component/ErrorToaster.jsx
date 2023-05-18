import React, { useEffect } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

function ErrorToaster({ message, setMessage }) {
  useEffect(() => {
    setTimeout(() => {
      setMessage('');
    }, 2000);
    toast.error(message, {
      theme: "dark",
      autoClose: 700,
      transition: Slide,
      hideProgressBar: true,
      position: "bottom-center"
    });
  }, []);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default ErrorToaster;
