'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Send } from 'lucide-react';
import { useSidebar } from '@/components/sidebar-context';

const links = [
  { href: '/communications', icon: Home, label: 'Início' },
  { href: '/communications', icon: Send, label: 'Comunicações' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  if (!open) return null;

  return (
    <aside className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-6 shrink-0">
      {links.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            title={label}
            className="p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Icon size={16} />
          </Link>
        );
      })}
    </aside>
  );
}
