import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = 'Nenhum evento encontrado. Tente buscar por outros termos ou mudar a cidade.' }: EmptyStateProps) => {
  return (
    <div className="w-full py-24 bg-white rounded-[32px] border border-gray-100 flex flex-col items-center gap-4 text-center px-4">
      <SearchX size={48} className="text-gray-300" />
      <h3 className="text-2xl font-bold text-gray-900">Ops, sem resultados</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
    </div>
  );
};

export default EmptyState;
