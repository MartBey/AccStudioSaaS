"use client";

import { Eye, EyeOff, Globe, Lock, Mail, MapPin, Save, Shield, User } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  toast,
} from "ui";

import { changePassword, updateProfile } from "@/app/_actions/profile-actions";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
}

interface AyarlarClientProps {
  profile: ProfileData;
}

const roleLabels: Record<string, string> = {
  BRAND: "Marka",
  AGENCY: "Ajans",
  FREELANCER: "Freelancer",
  ADMIN: "Admin",
};

export default function AyarlarClient({ profile }: AyarlarClientProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Şifre state
  const [pwData, setPwData] = useState({ current: "", newPw: "", confirm: "" });
  const [isPwSaving, setIsPwSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Profil başarıyla güncellendi!");
      } else {
        toast.error(res.error || "Hata oluştu.");
      }
    } catch {
      toast.error("Profil güncellenemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (pwData.newPw.length < 6) {
      toast.error("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (pwData.newPw !== pwData.confirm) {
      toast.error("Yeni şifreler eşleşmiyor.");
      return;
    }
    setIsPwSaving(true);
    try {
      const res = await changePassword({
        currentPassword: pwData.current,
        newPassword: pwData.newPw,
      });
      if (res.success) {
        toast.success("Şifre başarıyla değiştirildi!");
        setPwData({ current: "", newPw: "", confirm: "" });
      } else {
        toast.error(res.error || "Hata oluştu.");
      }
    } catch {
      toast.error("Şifre değiştirilemedi.");
    } finally {
      setIsPwSaving(false);
    }
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hesap Ayarları</h1>
        <p className="mt-1 text-muted-foreground">
          Profil bilgilerinizi ve güvenlik ayarlarınızı yönetin.
        </p>
      </div>

      {/* Profil Özet */}
      <Card className="border-t-4 border-t-primary">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">{roleLabels[profile.role] || profile.role}</Badge>
                <span className="text-sm text-muted-foreground">{profile.email}</span>
              </div>
              <span className="text-xs text-muted-foreground">Katılım: {profile.joinDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profil Düzenleme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>E-posta</Label>
              <div className="flex h-10 items-center gap-2 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {profile.email}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biyografi</Label>
            <Textarea
              id="bio"
              placeholder="Kendinizi kısaca tanıtın..."
              className="min-h-[80px]"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Konum
              </Label>
              <Input
                id="location"
                placeholder="İstanbul, Türkiye"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleProfileSave} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </Button>
        </CardContent>
      </Card>

      {/* Şifre Değiştirme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Güvenlik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pw">Mevcut Şifre</Label>
            <div className="relative">
              <Input
                id="current-pw"
                type={showPasswords ? "text" : "password"}
                value={pwData.current}
                onChange={(e) => setPwData({ ...pwData, current: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-pw">Yeni Şifre</Label>
              <Input
                id="new-pw"
                type={showPasswords ? "text" : "password"}
                value={pwData.newPw}
                onChange={(e) => setPwData({ ...pwData, newPw: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirm-pw"
                type={showPasswords ? "text" : "password"}
                value={pwData.confirm}
                onChange={(e) => setPwData({ ...pwData, confirm: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePasswordChange}
              disabled={isPwSaving}
              variant="outline"
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              {isPwSaving ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
            </Button>
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPasswords ? "Gizle" : "Göster"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
