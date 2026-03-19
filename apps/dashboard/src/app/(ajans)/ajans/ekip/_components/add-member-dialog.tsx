"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  toast,
} from "ui";

import { addEmployee } from "../../../../_actions/agency-actions";

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const email = formData.get("email") as string;

    try {
      const result = await addEmployee({ name, role, email });
      if (result.success) {
        toast.success("Ekip üyesi başarıyla eklendi.");
        setOpen(false);
      } else {
        toast.error(result.error || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Yeni Üye Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Ekip Üyesi</DialogTitle>
            <DialogDescription>
              Ajans ekibinize yeni bir üye ekleyin. Bu kişi projelerde görevlendirilebilir.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tam İsim</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol / Ünvan</Label>
              <Input id="role" name="role" placeholder="Senior Developer" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta (Opsiyonel)</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Ekleniyor..." : "Üyeyi Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
