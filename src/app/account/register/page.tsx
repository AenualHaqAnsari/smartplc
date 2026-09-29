"use client";

import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/account/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            country: form.country,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create account."
        );
      }

      router.push("/account");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account."
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="mx-auto max-w-lg px-6 py-20">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          Join the Collection
        </p>

        <h1 className="mt-3 font-serif text-5xl font-bold">
          CREATE ACCOUNT
        </h1>

        <p className="mt-5 text-[#475569]">
          Create an account to manage your
          orders and saved information.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 border border-[#cbd5e1] bg-[#ffffff] p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="First Name"
              required
              value={form.firstName}
              onChange={(value) =>
                updateField(
                  "firstName",
                  value
                )
              }
            />

            <Field
              label="Last Name"
              required
              value={form.lastName}
              onChange={(value) =>
                updateField(
                  "lastName",
                  value
                )
              }
            />
          </div>

          <Field
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(value) =>
              updateField("email", value)
            }
          />

          <Field
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(value) =>
              updateField("phone", value)
            }
          />

          <Field
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(value) =>
              updateField(
                "password",
                value
              )
            }
          />

          <Field
            label="Confirm Password"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(value) =>
              updateField(
                "confirmPassword",
                value
              )
            }
          />

          <div>
            <label
              htmlFor="country"
              className="block"
            >
              <span className="text-xs uppercase tracking-[0.15em] text-[#475569]">
                Country
                <span className="text-[#0877b9]"> *</span>
              </span>

              <select
                id="country"
                name="country"
                required
                value={form.country}
                onChange={(event) =>
                  updateField(
                    "country",
                    event.target.value
                  )
                }
                className="mt-2 min-h-12 w-full border border-[#cbd5e1] bg-[#ffffff] px-4 text-[#17212b] outline-none focus:border-[#0284c7]"
              >
                <option value="" disabled>
                  Select your country
                </option>

                <option value="India">
                  India
                </option>

                <option value="United States">
                  United States
                </option>

                <option value="United Kingdom">
                  United Kingdom
                </option>

                <option value="Germany">
                  Germany
                </option>

                <option value="France">
                  France
                </option>

                <option value="Italy">
                  Italy
                </option>

                <option value="Belgium">
                  Belgium
                </option>

                <option value="Spain">
                  Spain
                </option>

                <option value="Switzerland">
                  Switzerland
                </option>

                <option value="Canada">
                  Canada
                </option>

                <option value="Australia">
                  Australia
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              <p className="mt-2 text-xs text-[#475569]">
                Your country determines your applicable discount.
              </p>
            </label>
          </div>
          {error && (
            <div className="border border-[#d4aaa0] bg-[#f8ebe7] p-4 text-sm text-[#d79b8d]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0877b9] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#ffffff] transition hover:bg-[#075985] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <p className="text-center text-sm text-[#475569]">
            Already have an account?{" "}
            <Link
              href="/account/login"
              className="text-[#0877b9] hover:text-[#075985]"
            >
              Sign In
            </Link>
          </p>
        </form>
      </section>
          <SiteFooter />
    </main>
  );
}

function Field({
  label,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.15em] text-[#475569]">
        {label}
        {required && (
          <span className="text-[#0877b9]">
            {" "}
            *
          </span>
        )}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 min-h-12 w-full border border-[#cbd5e1] bg-[#ffffff] px-4 text-[#17212b] outline-none placeholder:text-[#475569] focus:border-[#0284c7]"
      />
    </label>
  );
}
