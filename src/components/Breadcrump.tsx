import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {item.to ? (
            <Link to={item.to} className="hover:underline text-indigo-600 font-medium">
              {item.label}
            </Link>
            ) : (
                <span className="text-gray-500 font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2 text-gray-400">{'>'}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

