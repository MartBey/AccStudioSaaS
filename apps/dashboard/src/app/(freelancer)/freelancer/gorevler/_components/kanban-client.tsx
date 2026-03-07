"use client";

import { useState, useTransition } from "react";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  toast,
} from "ui";
import { Clock, DollarSign, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateTaskStatus } from "../_actions/task-actions";
import { useRouter } from "next/navigation";

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
  { dbStatus: "TODO", title: "Yapılacak", color: "bg-slate-100 dark:bg-slate-900 border-slate-200" },
  { dbStatus: "IN_PROGRESS", title: "Devam Ediyor", color: "bg-blue-50 dark:bg-blue-950/20 border-blue-100" },
  { dbStatus: "REVIEW", title: "İnceleniyor", color: "bg-amber-50 dark:bg-amber-950/20 border-amber-100" },
  { dbStatus: "DONE", title: "Tamamlandı", color: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100" },
];

export default function KanbanClient({ tasks: initialTasks }: KanbanClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [isPending, startTransition] = useTransition();

  const moveTask = (taskId: string, newDbStatus: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newDbStatus } : t));

    // Server action
    startTransition(async () => {
      const res = await updateTaskStatus(taskId, newDbStatus);
      if (!res.success) {
        // Rollback on error
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: initialTasks.find(it => it.id === taskId)?.status || t.status } : t));
        toast.error(res.error || "Görev durumu güncellenemedi.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Görevlerim (Kanban)</h1>
          <p className="text-muted-foreground mt-1">
            Üstlendiğiniz freelance işlerin durumunu butonlarla kaydırarak güncelleyin.
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1.5">
          {tasks.length} görev
        </Badge>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {statusColumns.map((col, colIndex) => {
          const colTasks = tasks.filter(t => t.status === col.dbStatus);

          return (
            <div key={col.dbStatus} className={`flex flex-col rounded-xl border p-4 ${col.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider">{col.title}</h3>
                <Badge variant="secondary" className="bg-background/50">{colTasks.length}</Badge>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <AnimatePresence>
                  {colTasks.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-xs text-center p-4 border border-dashed rounded-lg text-muted-foreground bg-background/50"
                    >
                      Görev yok
                    </motion.div>
                  ) : (
                    colTasks.map(task => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={task.id}
                      >
                        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-default flex flex-col group">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 rounded">
                                {task.id.slice(0, 8)}
                              </span>
                              <Badge 
                                variant={task.deadline.includes("Bugün") || task.deadline.includes("Yarın") ? "destructive" : "secondary"} 
                                className="text-[10px] font-normal px-1.5 h-4"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {task.deadline}
                              </Badge>
                            </div>
                            <CardTitle className="text-sm leading-tight line-clamp-2" title={task.title}>
                              {task.title}
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent className="p-4 pt-0 space-y-3 pb-3 border-b flex-1">
                            <span className="text-xs text-muted-foreground line-clamp-1 truncate">
                              {task.projectName}
                            </span>
                            {task.earning > 0 && (
                              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
                                <DollarSign className="h-3.5 w-3.5" />
                                {task.earning.toLocaleString("tr-TR")} ₺
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="p-2 justify-between bg-muted/20">
                            {/* Geri butonu */}
                            {colIndex > 0 ? (
                              <Button 
                                variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={() => moveTask(task.id, statusColumns[colIndex - 1].dbStatus)}
                                disabled={isPending}
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </Button>
                            ) : <div className="w-6" />}

                            {/* İleri butonu */}
                            {colIndex < statusColumns.length - 1 ? (
                              <Button 
                                variant="outline" size="sm" 
                                className="h-6 px-2 text-[10px] gap-1 bg-background shadow-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                                onClick={() => moveTask(task.id, statusColumns[colIndex + 1].dbStatus)}
                                disabled={isPending}
                              >
                                İleri Al
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium px-2">
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
