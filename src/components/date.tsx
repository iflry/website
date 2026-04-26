import {useFormatter} from 'next-intl';

export default function DateComponent({ dateString, showTime = false }: { dateString: string; showTime?: boolean }) {
  const format = useFormatter();
  const date = new Date(dateString);
  const datePart = format.dateTime(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (!showTime) {
    return <time dateTime={dateString}>{datePart}</time>;
  }
  const timePart = format.dateTime(date, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
    timeZoneName: 'short',
  });
  return (
    <time dateTime={dateString}>
      {datePart} · {timePart}
    </time>
  );
}
