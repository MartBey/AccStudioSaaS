export default function VitrinLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="animate-pulse text-lg font-medium text-muted-foreground">
          Vitrin Hazırlanıyor...
        </p>
      </div>
    </div>
  );
}
