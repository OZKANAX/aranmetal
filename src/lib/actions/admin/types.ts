export type ActionState = {
  ok: boolean | null;
  message?: string;
  /** Başarılı işlemden sonra formu yeniden kurmak için */
  nonce?: number;
};

export const initialActionState: ActionState = { ok: null };
