
import { AlertTriangle, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Application {
  id: number;
  university?: string | null;
  degree?: string | null;
  studyField?: string | null;
  status?: string | null;
  progress?: number | null;
}

interface DeadlineAlertProps {
  applications: Application[];
}

export const DeadlineAlert = ({ applications }: DeadlineAlertProps) => {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  // For now, return null since we don't have deadline data in SupabaseApplication
  // This can be enhanced later when deadline fields are added to the database
  return null;
};

