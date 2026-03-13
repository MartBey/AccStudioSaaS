"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, toast } from "ui";

import { updateTaskStatus } from "../_actions/task-actions";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: string;
  projectName: string;
  earning: number;
  deadline: string;
}

interface KanbanClientProps {
  tasks: TaskItem[];
}

// DB status → Türkçe label eşlemesi
const statusColumns = [
  {
    dbStatus: "TODO",
    title: "Yapılacak",
    color: "bg-slate-100 dark:bg-slate-900 border-slate-200",
  },
  {
    dbStatus: "IN_PROGRESS",
    title: "Devam Ediyor",
    color: "bg-blue-50 dark:bg-blue-950/20 border-blue-100",
  },
  {
    dbStatus: "REVIEW",
    title: "İnceleniyor",
    color: "bg-amber-50 dark:bg-amber-950/20 border-amber-100",
  },
  {
    dbStatus: "DONE",
    title: "Tamamlandı",
    color: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100",
  },
];

export default function KanbanClient({ tasks: initialTasks }: KanbanClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [isPending, startTransition] = useTransition();

  const moveTask = (taskId: string, newDbStatus: string) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newDbStatus } : t)));

    // Server action
    startTransition(async () => {
      const res = await updateTaskStatus(taskId, newDbStatus);
      if (!res.success) {
        // Rollback on error
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: initialTasks.find((it) => it.id === taskId)?.status || t.status }
              : t
          )
        );
        toast.error(res.error || "Görev durumu güncellenemedi.");
      }
    });
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-6rem)] flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Görevlerim (Kanban)</h1>
          <p className="mt-1 text-muted-foreground">
            Üstlendiğiniz freelance işlerin durumunu butonlarla kaydırarak güncelleyin.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          {tasks.length} görev
        </Badge>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-x-auto pb-4 md:grid-cols-2 lg:grid-cols-4">
        {statusColumns.map((col, colIndex) => {
          const colTasks = tasks.filter((t) => t.status === col.dbStatus);

          return (
            <div key={col.dbStatus} className={`flex flex-col rounded-xl border p-4 ${col.color}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider">{col.title}</h3>
                <Badge variant="secondary" className="bg-background/50">
                  {colTasks.length}
                </Badge>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <AnimatePresence>
                  {colTasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg border border-dashed bg-background/50 p-4 text-center text-xs text-muted-foreground"
                    >
                      Görev yok
                    </motion.div>
                  ) : (
                    colTasks.map((task) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={task.id}
                      >
                        <Card className="group flex cursor-default flex-col shadow-sm transition-shadow hover:shadow-md">
                          <CardHeader className="p-4 pb-2">
                            <div className="mb-1 flex items-start justify-between">
                              <span className="rounded bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                                {task.id.slice(0, 8)}
                              </span>
                              <Badge
                                variant={
                                  task.deadline.includes("Bugün") || task.deadline.includes("Yarın")
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="h-4 px-1.5 text-[10px] font-normal"
                              >
                                <Clock className="mr-1 h-3 w-3" />
                                {task.deadline}
                              </Badge>
                            </div>
                            <CardTitle
                              className="line-clamp-2 text-sm leading-tight"
                              title={task.title}
                            >
                              {task.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="flex-1 space-y-3 border-b p-4 pb-3 pt-0">
                            <span className="line-clamp-1 truncate text-xs text-muted-foreground">
                              {task.projectName}
                            </span>
                            {task.earning > 0 && (
                              <div className="flex w-fit items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-semibold text-emerald-600">
                                <DollarSign className="h-3.5 w-3.5" />
                                {task.earning.toLocaleString("tr-TR")} ₺
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="justify-between bg-muted/20 p-2">
                            {/* Geri butonu */}
                            {colIndex > 0 ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={() =>
                                  moveTask(task.id, statusColumns[colIndex - 1].dbStatus)
                                }
                                disabled={isPending}
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <div className="w-6" />
                            )}

                            {/* İleri butonu */}
                            {colIndex < statusColumns.length - 1 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="shadow-xs h-6 gap-1 bg-background px-2 text-[10px] transition-colors hover:bg-primary hover:text-primary-foreground"
                                onClick={() =>
                                  moveTask(task.id, statusColumns[colIndex + 1].dbStatus)
                                }
                                disabled={isPending}
                              >
                                İleri Al
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 px-2 text-[10px] font-medium text-emerald-600">
                                <CheckCircle2 className="h-3 w-3" /> Bitti
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
