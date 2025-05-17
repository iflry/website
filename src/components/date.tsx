import {useFormatter} from 'next-intl';

export default function DateComponent({ dateString }: { dateString: string }) {
  const format = useFormatter();
  return (
    <time dateTime={dateString}>
      {format.dateTime(new Date(dateString), {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </time>
  );
}
