"use client";

import {
  useState,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import { Icon } from "@/components/icon";
import { FieldError, Label, cn } from "@/components/ui";

const base =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: string;
  error?: string[];
};

export function TextField({ label, icon, error, type = "text", name, ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
          />
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          className={cn(base, icon && "pl-10", isPassword && "pr-10")}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={show ? "Hide password" : "Show password"}
          >
            <Icon name={show ? "visibility_off" : "visibility"} className="text-[20px]" />
          </button>
        )}
      </div>
      <FieldError messages={error} />
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  icon?: string;
  error?: string[];
  placeholder?: string;
  options: readonly string[];
};

export function SelectField({
  label,
  icon,
  error,
  name,
  placeholder,
  options,
  ...rest
}: SelectProps) {
  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
          />
        )}
        <select
          id={name}
          name={name}
          className={cn(base, icon && "pl-10", "appearance-none pr-10")}
          {...rest}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Icon
          name="chevron_down"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400"
        />
      </div>
      <FieldError messages={error} />
    </div>
  );
}
