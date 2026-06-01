import { useContext } from "react";
import { LeaveContext } from "../context/LeaveContext";

export function useLeave() {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error("useLeave must be used inside <LeaveProvider>");
  return ctx;
}