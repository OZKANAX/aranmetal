/** Arka plan olarak kullanılan görsel (admin'den gelen URL'ler dahil). */
export function BgImage({ src, alt, className = "" }: { src: string; alt?: string; className?: string }) {
  if (!src) return <div className={`w-full h-full bg-paper-3 ${className}`} />;
  return (
    <div
      role={alt ? "img" : undefined}
      aria-label={alt}
      className={`w-full h-full bg-cover bg-center bg-paper-3 ${className}`}
      style={{ backgroundImage: `url("${src.replace(/"/g, "%22")}")` }}
    />
  );
}
