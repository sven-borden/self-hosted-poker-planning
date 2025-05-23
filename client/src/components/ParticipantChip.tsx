export default function ParticipantChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-200 text-sm mr-2">
      {name}
    </span>
  );
}
