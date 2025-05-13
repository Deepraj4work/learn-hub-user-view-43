
import { toast } from "sonner";

// Re-export toast from sonner with custom default options
export { toast };

// Add default configuration if needed
toast.success = (message, options = {}) => {
  return toast.success(message, { 
    duration: 3000,
    ...options 
  });
};

toast.error = (message, options = {}) => {
  return toast.error(message, { 
    duration: 5000, // Longer duration for errors
    ...options 
  });
};

toast.warning = (message, options = {}) => {
  return toast.warning(message, { 
    duration: 4000,
    ...options 
  });
};
