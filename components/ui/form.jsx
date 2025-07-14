"use client";

import React, { useRef, ReactNode, FormEvent } from "react";

const Form = ({ children, action, classname, onsubmit }) => {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (onsubmit) {
      onsubmit(e); // Executes onsubmit if passed
    }

    if (formRef.current) {
      const formData = new FormData(formRef.current); // Collect form data
      await action(formData); // Call the action passed to Form
      formRef.current.reset(); // Reset the form after submission
    }
  };

  return (
    <form
      className={classname}
      onSubmit={handleSubmit} // Handles form submit
      ref={formRef}  // Correctly use ref to reference the form
    >
      {children} {/* Render form children (input fields) */}
    </form>
  );
};

export default Form;
