import { useState } from "react";

export const useExecutiveMode = () => {
  const [isExecutive, setIsExecutive] = useState(false);

  const toggle = () => {
    setIsExecutive(prev => !prev);
  };

  return { isExecutive, toggle };
};
