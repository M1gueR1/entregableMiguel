import Link from "next/link";

interface FollowUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified: boolean;
}

interface Props {
  tipo: "seguidores" | "siguiendo";
  usuarios: FollowUser[];
  cargando: boolean;
  onClose: () => void;
}

export default function FollowModal({ tipo, usuarios, cargando, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm mx-4 max-h-[70vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold tracking-wide uppercase text-gray-700">{tipo}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-3 py-2">
          {cargando ? (
            <div className="flex justify-center py-10 text-gray-300 text-sm">Loading…</div>
          ) : usuarios.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2 text-gray-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <p className="text-sm">No {tipo} yet</p>
            </div>
          ) : (
            usuarios.map((u) => (
              <Link
                key={u.id}
                href={`/profile/${u.username}`}
                onClick={onClose}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold truncate text-gray-900">{u.username}</p>
                    {u.isVerified && (
                      <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-3.5 h-3.5 flex-shrink-0">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{u.name}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}