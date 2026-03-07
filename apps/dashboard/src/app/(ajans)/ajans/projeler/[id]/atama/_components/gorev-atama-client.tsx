"use client";

import { useTransition } from "react";
import { 
  Card, CardContent,
  Badge, toast,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "ui";
import { Users, Briefcase, UserCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { assignTaskToEmployee } from "@/app/_actions/delivery-actions";
import { useRouter } from "next/navigation";

interface TaskItem {
  id: string;
  title: string;
  status: string;
  assignedEmployeeName: string | null;
  freelancerName: string | null;
}

interface EmployeeItem {
  id: string;
  name: string;
  role: string;
}

interface GorevAtamaClientProps {
  projectTitle: string;
  tasks: TaskItem[];
  employees: EmployeeItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  TODO: { label: "Yapılacak", color: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "Devam Ediyor", color: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-amber-100 text-amber-700" },
  DONE: { label: "Tamamlandı", color: "bg-emerald-100 text-emerald-700" },
};

export default function GorevAtamaClient({ projectTitle, tasks, employees }: GorevAtamaClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAssign = (taskId: string, employeeId: string) => {
    startTransition(async () => {
      const res = await assignTaskToEmployee({ taskId, employeeId });
      if (res.success) {
        toast.success("Görev başarıyla atandı!");
        router.refresh();
      } else toast.error(res.error || "Atama yapılamadı.");
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Link href="/ajans/musteriler" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit">
        <ArrowLeft className="h-4 w-4" /> Projelere Dön
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Görev Ataması</h1>
        <p className="text-muted-foreground mt-1">{projectTitle} — Çalışanlarınıza görev atayın</p>
      </div>

      {tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-16 text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Bu projede henüz görev yok.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{task.title}</h3>
                      <Badge className={statusMap[task.status]?.color || "bg-muted"}>
                        {statusMap[task.status]?.label || task.status}
                      </Badge>
                    </div>
                    {task.freelancerName && (
                      <p className="text-xs text-muted-foreground mt-1">Freelancer: {task.freelancerName}</p>
                    )}
                    {task.assignedEmployeeName && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <UserCheck className="h-3 w-3" /> Atanmış: {task.assignedEmployeeName}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 w-48">
                    <Select 
                      onValueChange={(val) => handleAssign(task.id, val)}
                      disabled={isPending}
                      defaultValue={undefined}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Çalışan Seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {emp.name} ({emp.role})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
