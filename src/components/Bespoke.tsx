import {useState, type FormEvent} from 'react';
import {bespoke, brand} from '../content';
import {useReveals} from '../hooks/useReveals';

type Status = 'idle' | 'invalid' | 'opened';

/**
 * Bespoke enquiry. There is no backend: the form composes a WhatsApp message
 * to the atelier and opens it in a new tab for the visitor to send.
 */
export function Bespoke() {
  const ref = useReveals<HTMLElement>();
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus('invalid');
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const text = [
      'Bespoke enquiry',
      `Name: ${String(data.get('name'))}`,
      `Piece: ${String(data.get('piece'))}`,
      `Notes: ${String(data.get('notes') || '—')}`,
    ].join('\n');
    window.open(`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setStatus('opened');
  };

  const field =
    'w-full rounded-[2px] border-b border-bone/25 bg-transparent px-0 py-3.5 text-body text-bone outline-none placeholder:text-taupe focus:border-gold user-invalid:border-red-400/70';

  return (
    <section ref={ref} id="bespoke" aria-labelledby="bespoke-title" className="relative bg-ink px-6 pb-28 sm:px-8 md:px-[6vw] md:pb-40">
      <div className="grid gap-16 border-t border-bone/10 pt-20 md:grid-cols-2 md:gap-24 md:pt-28">
        <div data-reveal>
          <p className="label text-gold">{bespoke.eyebrow}</p>
          <h2 id="bespoke-title" className="mt-4 font-display text-display font-light text-bone">
            {bespoke.heading}
          </h2>
          <p className="mt-6 max-w-[30rem] text-body text-bone/65">{bespoke.body}</p>
        </div>

        <form noValidate onSubmit={onSubmit} aria-describedby="bespoke-status" className="space-y-7" data-reveal>
          <label className="block">
            <span className="label mb-1 block text-taupe">Name</span>
            <input name="name" required autoComplete="name" placeholder="Your name" className={field} onInput={() => setStatus('idle')} />
          </label>
          <label className="block">
            <span className="label mb-1 block text-taupe">Piece</span>
            <select name="piece" defaultValue="Not sure yet" className={`${field} appearance-none`}>
              {bespoke.pieces.map((p) => (
                <option key={p} value={p} className="bg-ink">
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label mb-1 block text-taupe">Notes</span>
            <textarea name="notes" rows={3} placeholder="The occasion, the silhouette, the colour you have in mind" className={`${field} resize-none`} />
          </label>
          <button type="submit" className="label w-full rounded-[2px] bg-gold px-6 py-4 text-ink transition-colors hover:bg-bone">
            Send on WhatsApp
          </button>
          <p id="bespoke-status" role="status" className="min-h-[1.25rem] text-[0.8125rem] text-bone/65">
            {status === 'invalid' && 'Please add your name to continue.'}
            {status === 'opened' && `WhatsApp should have opened with your enquiry. If not, message us on ${brand.phoneDisplay}.`}
          </p>
        </form>
      </div>
    </section>
  );
}