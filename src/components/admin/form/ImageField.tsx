"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Görsel alanı: URL girilebilir veya dosya yüklenebilir.
 * Dosya seçilirse `${name}__file` olarak gönderilir ve sunucuda URL'nin yerine geçer.
 */
export function ImageField({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputId = `${name}-file`;

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shown = preview ?? url;

  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted sm:w-44">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="grid flex-1 content-start gap-2">
          <Input
            id={name}
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/images/ornek.jpg veya https://..."
            disabled={!!fileName}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(inputId)?.click()}
            >
              <Upload />
              Dosya Yükle
            </Button>
            {fileName && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const input = document.getElementById(inputId) as HTMLInputElement | null;
                  if (input) input.value = "";
                  setFileName(null);
                  setPreview(null);
                }}
              >
                <X />
                {fileName}
              </Button>
            )}
            <input
              id={inputId}
              type="file"
              name={`${name}__file`}
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setFileName(file.name);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, AVIF veya GIF — en fazla 5 MB.</p>
        </div>
      </div>
      {/* Dosya seçiliyken devre dışı input gönderilmez; mevcut URL'yi koru */}
      {fileName && <input type="hidden" name={name} value={url} />}
    </div>
  );
}
