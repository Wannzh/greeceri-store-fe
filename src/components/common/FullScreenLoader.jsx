export default function FullScreenLoader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Memuat data...</p>
    </div>
  );
}
