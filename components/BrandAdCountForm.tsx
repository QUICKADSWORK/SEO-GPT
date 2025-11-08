'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

type FormValues = {
  websiteUrl: string;
};

type AdCountResults = {
  websiteUrl: string;
  brandName: string;
  totalAdCount: number;
  activeAdCount: number;
  inactiveAdCount: number;
  timestamp: string;
};

export const BrandAdCountForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AdCountResults | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      websiteUrl: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/brand-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to fetch brand ad counts');
      }

      const data: AdCountResults = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-subtle">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Brand Ad Intelligence</h2>
          <p className="text-sm text-slate-500">
            Enter a brand website to discover their Instagram presence and ad metrics
          </p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          🎯 AI-Powered
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Brand Website URL <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="https://www.amazon.in"
              className={clsx(
                'flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2',
                errors.websiteUrl
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'
              )}
              {...register('websiteUrl', {
                required: 'Website URL is required',
                pattern: {
                  value: /^https?:\/\/.+\..+/,
                  message: 'Please enter a valid URL'
                }
              })}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={clsx(
                'rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-200',
                isLoading && 'cursor-not-allowed opacity-70'
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Get Ad Counts'
              )}
            </button>
          </div>
          {errors.websiteUrl && (
            <span className="text-xs text-red-500">{errors.websiteUrl.message}</span>
          )}
          <p className="text-xs text-slate-400">
            Example: www.amazon.in → Amazon India, nike.com → Nike
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {/* Brand Info Card */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white text-xl font-bold">
                  {results.brandName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Instagram Brand</p>
                  <h3 className="text-2xl font-bold text-emerald-900">{results.brandName}</h3>
                </div>
              </div>
              <p className="text-sm text-emerald-700">
                <span className="font-semibold">Website:</span> {results.websiteUrl}
              </p>
            </div>

            {/* Ad Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Total Ads */}
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Total Ads</p>
                </div>
                <p className="text-4xl font-bold text-blue-900">{results.totalAdCount.toLocaleString()}</p>
              </div>

              {/* Active Ads */}
              <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✅</span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Active Ads</p>
                </div>
                <p className="text-4xl font-bold text-green-900">{results.activeAdCount.toLocaleString()}</p>
              </div>

              {/* Inactive Ads */}
              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⏸️</span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Inactive Ads</p>
                </div>
                <p className="text-4xl font-bold text-slate-900">{results.inactiveAdCount.toLocaleString()}</p>
              </div>
            </div>

            {/* Timestamp */}
            <p className="text-xs text-slate-400 text-center">
              Retrieved at {new Date(results.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
