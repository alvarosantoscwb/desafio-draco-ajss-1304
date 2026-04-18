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
  const { open, toggle } = useSidebar();

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-14 bg-white border-r border-gray-200
          flex flex-col items-center py-4 gap-6 shrink-0
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'}
        `}
      >
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              title={label}
              onClick={() => { if (window.innerWidth < 768) toggle(); }}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${active ? 'text-[#0D4897] bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Icon size={16} />
            </Link>
          );
        })}
      </aside>
    </>
  );
}
