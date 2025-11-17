// util / dentro do Home.tsx
function normalizeAccents(s: string) {
    return s.normalize?.('NFD')?.replace(/[\u0300-\u036f]/g, '') ?? s;
}

export function parseCustomDateAny(input: any): Date {
    if (!input && input !== 0) return new Date(NaN);

    // 1) Firestore Timestamp-like (has toDate)
    if (input && typeof input.toDate === 'function') {
        return input.toDate();
    }

    // 2) If it's already a Date
    if (input instanceof Date) return input;

    // 3) If it's a number (ms timestamp)
    if (typeof input === 'number') return new Date(input);

    // 4) If it's a string
    if (typeof input === 'string') {
        const s = input.trim();

        // 4a) ISO-like or plain parsable
        const isoTry = new Date(s);
        if (!isNaN(isoTry.getTime())) return isoTry;

        // 4b) dd/mm/yyyy or dd-mm-yyyy
        const dm = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}:\d{2}:\d{2}))?/);
        if (dm) {
            const day = Number(dm[1]), month = Number(dm[2]) - 1, year = Number(dm[3]);
            if (dm[4]) {
                const [hh, mm, ss] = dm[4].split(':').map(Number);
                return new Date(year, month, day, hh, mm, ss || 0);
            }
            return new Date(Date.UTC(year, month, day));
        }

        // 4c) Formato natural com "de" e possivelmente "às" e fuso ex:
        // "12 de novembro de 2025 às 21:00:00 UTC-3"
        // Normaliza acentos para mapear meses
        const sNorm = normalizeAccents(s.toLowerCase());
        const re = /(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})(?:\s+as\s*)?(\d{1,2}:\d{2}(?::\d{2})?)(?:\s*(?:utc|gmt)?\s*([+-]?\d{1,2})(?::?(\d{2}))?)?/i;
        const m = sNorm.match(re);
        if (m) {
            const day = Number(m[1]);
            const monthName = m[2];
            const year = Number(m[3]);
            const timePart = m[4];
            const tzHourStr = m[5]; // ex: "-3" or "+1"
            const tzMinStr = m[6]; // ex: "30" (optional)

            const MONTHS: Record<string, number> = {
                janeiro:0, fevereiro:1, marco:2, abril:3, maio:4, junho:5,
                julho:6, agosto:7, setembro:8, outubro:9, novembro:10, dezembro:11
            };
            const month = MONTHS[monthName] ?? NaN;
            const [hh, mm, ss = '0'] = timePart.split(':');
            const hour = Number(hh), minute = Number(mm), second = Number(ss);

            // Se vier fuso (tzHourStr), convertemos para UTC usando Date.UTC
            if (typeof tzHourStr !== 'undefined') {
                const tzHours = Number(tzHourStr); // pode ser -3, +2...
                const tzMinutes = tzMinStr ? Number(tzMinStr) : 0;
                // UTC hour = localHour - offsetHours
                // exemplo: local is UTC-3 (tzHours = -3) => UTC = local - (-3) = local + 3
                const utcMillis = Date.UTC(
                    year,
                    month,
                    day,
                    hour - tzHours,
                    minute - tzMinutes,
                    second
                );
                return new Date(utcMillis);
            } else {
                // sem fuso declarado → tratamos como hora local
                return new Date(Date.UTC(year, month, day, hour, minute, second));
            }
        }
    }

    // fallback
    return new Date(NaN);
}

// Formata para exibir
export function formatDateForDisplay(input: any) {
    const d = parseCustomDateAny(input);
    if (isNaN(d.getTime())) return 'Data inválida';
    // se quiser só data:
    return d.toLocaleDateString('pt-BR');
    // ou com hora:
    // return d.toLocaleString('pt-BR');
}


