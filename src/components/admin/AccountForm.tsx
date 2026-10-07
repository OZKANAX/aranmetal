"use client";

import { updateAccount } from "@/lib/actions/admin/account";
import { initialActionState } from "@/lib/actions/admin/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Field, SubmitButton, useFormAction } from "./form/form-kit";

export function AccountForm({ name }: { name: string }) {
  const [state, onSubmit, pending] = useFormAction(updateAccount, initialActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil ve Şifre</CardTitle>
        <CardDescription>Şifreyi değiştirmek istemiyorsanız şifre alanlarını boş bırakın.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} key={state.nonce ?? 0} className="grid gap-4">
          <Field label="Ad Soyad" htmlFor="name">
            <Input id="name" name="name" defaultValue={name} required />
          </Field>
          <Separator className="my-2" />
          <Field label="Mevcut Şifre" htmlFor="currentPassword">
            <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Yeni Şifre" htmlFor="newPassword" help="En az 10 karakter.">
              <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={10} />
            </Field>
            <Field label="Yeni Şifre (Tekrar)" htmlFor="confirmPassword">
              <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" />
            </Field>
          </div>
          <div className="flex justify-end">
            <SubmitButton pending={pending}>Kaydet</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
