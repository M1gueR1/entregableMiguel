"use client";

// Stories bar — purely visual mock. Students can wire it to a real stories API.
// TODO (students): Fetch real stories from your backend endpoint (e.g. GET /api/stories)

//hecho

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Story {
  username: string;
  avatar: string;
  isOwn: boolean;
  storyUrl: string | null;
}

export default function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([]);
  const [historiaActiva, setHistoriaActiva] = useState<Story | null>(null);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/stories");
        const data = await res.json();
        setStories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (!historiaActiva) return;
    setProgreso(0);
    const interval = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setHistoriaActiva(null);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [historiaActiva]);

  if (stories.length === 0) return null;

  function abrirHistoria(story: Story) {
    if (story.isOwn) {
      toast.info("Selecciona una imagen desde Crear para agregar a tu historia");
    } else {
      setHistoriaActiva(story);
    }
  }

  function cerrarHistoria() {
    setHistoriaActiva(null);
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide bg-white border border-gray-200 rounded-xl px-4 py-3">
        {stories.map(({ username, avatar, isOwn, storyUrl }) => (
          <button
            key={username}
            onClick={() => abrirHistoria({ username, avatar, isOwn, storyUrl })}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div
              className={`w-14 h-14 rounded-full p-0.5 ${
                isOwn ? "bg-gray-200" : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
              }`}
            >
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {isOwn ? (
              <div className="relative -mt-5 ml-8 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                  <path d="M12 5v14M5 12h14" stroke="white" strokeWidth={3} strokeLinecap="round" />
                </svg>
              </div>
            ) : null}
            <span className="text-xs text-gray-500 truncate max-w-[56px]">
              {isOwn ? "Your story" : username.split(".")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Lo que esta aca abajo es para cumplir la parte del toDo que dice: Students can wire it to a real stories API. */}
        {/* Entonces lo que hace es renderizar la URL de la historia para mapearla y usarla */}
      {historiaActiva && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={cerrarHistoria}
        >
          <div
            className="relative w-full max-w-sm h-[80vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 z-10 px-3 pt-3">
              <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            <div className="absolute top-4 left-0 right-0 z-10 flex items-center gap-3 px-4 pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={historiaActiva.avatar}
                alt={historiaActiva.username}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <span className="text-white font-semibold text-sm">{historiaActiva.username}</span>
              <button onClick={cerrarHistoria} className="ml-auto text-white text-xl">&times;</button>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={historiaActiva.storyUrl!}
              alt={`${historiaActiva.username}'s story`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}