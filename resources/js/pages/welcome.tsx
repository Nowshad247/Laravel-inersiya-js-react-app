import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CertificateResult } from '@/types/CertificateResult';

// Regex for UID validation
const UID_REGEX = /^SDC-[A-Z]{2,5}-\d{4}-\d{4}-[A-Z]-\d+$/;

// Extend Inertia's generic PageProps
interface MyPageProps extends Record<string, any> {
  status: boolean | null;
  message: string | null;
  data: CertificateResult | null;
}

export default function Welcome({ canRegister = false }: { canRegister?: boolean }) {
  const { data, setData, post, processing, errors, reset } = useForm<{ uid: string }>({
    uid: '',
  });

  const normalizedUid = useMemo(() => data.uid.trim().toUpperCase(), [data.uid]);
  const isValidUid = UID_REGEX.test(normalizedUid);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUid || processing) return;

    post('/certificate', {
      preserveScroll: true,
      onSuccess: () => reset('uid'),
    });
  }

  // Tell TS the props have our custom fields
  const { props } = usePage<MyPageProps>();
  const { status, message, data: info} = props;
  return (
    <>
      <Head title="Verify Certificate" />
      <main className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-6 dark:bg-[#0a0a0a]">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl dark:bg-[#0f0f0f]">
          <h1 className="mb-6 text-center text-2xl font-semibold">
            Verify Your Certificate
          </h1>

          <form onSubmit={submit} className="space-y-4">
            <Input
              value={data.uid}
              onChange={(e) => setData('uid', e.target.value)}
              placeholder="SDC-DGM-2506-0001-M-12"
              autoComplete="off"
              spellCheck={false}
              required
            />

            {!isValidUid && data.uid.length > 0 && (
              <p className="text-sm text-red-500">Invalid certificate format</p>
            )}

            {errors.uid && (
              <p className="text-sm text-red-500">{errors.uid}</p>
            )}

            <Button
              type="submit"
              disabled={!isValidUid || processing}
              className="w-full"
            >
              {processing ? 'Verifying…' : 'Verify Certificate'}
            </Button>
          </form>

          {status === true && info && (
            <div className="mt-6 overflow-hidden rounded-lg border">
              <div className="bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                ✅ Certificate is valid
              </div>

              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {Object.keys(info).map((key) => {
                    const value = info[key as keyof CertificateResult];
                    return (
                      <tr key={key}>
                        <td className="px-4 py-2 font-medium">
                          {key
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </td>
                        <td className="px-4 py-2">{value ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {status === false && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              ❌ {message}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
