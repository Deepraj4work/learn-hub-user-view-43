
import * as React from "react";
import { useToast as useToastPrimitive } from "@/components/ui/toast";

export const useToast = useToastPrimitive;

export function toast(props: Parameters<typeof useToastPrimitive.toast>[0]) {
  return useToastPrimitive.toast(props);
}

export type { Toast } from "@/components/ui/toast";
