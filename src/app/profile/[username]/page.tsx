"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, Post, Reel } from "@/lib/types";
import { CURRENT_USER } from "@/lib/mock-data";
import Link from "next/link";
import { toast } from "sonner";
import ProfileGrid from "@/components/ProfileGrid";
import FollowModal from "@/components/InterfazSeguidores";

interface FollowUser {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isVerified: boolean;
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [tipoVentana, setTipoVentana] = useState<"seguidores" | "siguiendo" | null>(null);
  const [usuariosVentana, setUsuariosVentana] = useState<FollowUser[]>([]);
  const [cargandoVentana, setCargandoVentana] = useState(false);

  const [reelsLoaded, setReelsLoaded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts");

  const [reels, setReels] = useState<Reel[]>([]);

  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedLoaded, setSavedLoaded] = useState(false);

  useEffect(() => {
    // TODO: Change the URL below to your real backend endpoint.
    // Example: fetch(`https://your-api.com/profile/${username}`)
    //hecho
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${username}`);
        const data = await res.json();

        setUser(data.user);
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading profile…</div>;
  if (!user) return <div className="flex justify-center py-20 text-gray-400">User not found.</div>;

  //funcion relacionada al toDo del boton pal follow
  async function handleFollow() {
  setFollowLoading(true);

  try {
    const response = await fetch(`/api/profile/${username}/follow`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const { isFollowing } = await response.json();

    // Actualizar estado de follow
    setIsFollowing(isFollowing);

    // Actualizar usuario de forma segura
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const change = isFollowing ? 1 : -1;

      return {
        ...prevUser,
        followersCount: Math.max(0, prevUser.followersCount + change),
      };
    });

    toast.success(
      isFollowing
        ? `Ahora estás siguiendo a ${username}`
        : `Dejaste de seguir a ${username}`
    );
  } catch (error) {
    console.error(error);
    toast.error("No se pudo actualizar el seguimiento. Intenta de nuevo.");
  } finally {
    setFollowLoading(false);
  }
}

  async function abrirSeguidores() {
    setTipoVentana("seguidores");
    setCargandoVentana(true);
    setUsuariosVentana([]);
    try {
      const res = await fetch(`/api/profile/${username}/followers`);
      const data = await res.json();
      setUsuariosVentana(data);
    } catch {
      toast.error("Error al cargar seguidores");
    } finally {
      setCargandoVentana(false);
    }
  }

  async function abrirSiguiendo() {
    setTipoVentana("siguiendo");
    setCargandoVentana(true);
    setUsuariosVentana([]);
    try {
      const res = await fetch(`/api/profile/${username}/following`);
      const data = await res.json();
      setUsuariosVentana(data);
    } catch {
      toast.error("Error al cargar siguiendo");
    } finally {
      setCargandoVentana(false);
    }
  }

  function cerrarVentana() {
    setTipoVentana(null);
    setUsuariosVentana([]);
  }

  function handleTabClick(tab: "posts" | "reels" | "saved") {
    setActiveTab(tab);
    if (tab === "reels" && !reelsLoaded) {
      fetch(`/api/profile/${username}/reels`)
        .then((res) => res.json())
        .then((data) => {
          setReels(data);
          setReelsLoaded(true);
        });
    }
    if (tab === "saved" && !savedLoaded) {
    fetch(`/api/posts`)
      .then((res) => res.json())
      .then((data: Post[]) => {
        setSavedPosts(data.filter((p) => p.isSaved));
        setSavedLoaded(true);
      });
  }
  }

  const isOwn = username === CURRENT_USER.username;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex gap-8 md:gap-16 items-start mb-8">
        <div className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover border border-gray-200"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-xl font-light">{user.username}</h1>
            {user.isVerified && (
              <svg viewBox="0 0 24 24" fill="#3b82f6" className="w-5 h-5" aria-label="Verified">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
            {isOwn ? (
              <Link href="/profile/edit" className="px-4 py-1.5 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Edit profile
              </Link>
            ) : (
              <>
                {/* TODO: Wire to POST /api/profile/[username]/follow */}

                {/* hecho*/}

                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                    isFollowing
                      ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {followLoading ? "…" : isFollowing ? "Following" : "Follow"}
                </button>
                <Link href="/messages" className="px-4 py-1.5 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Message
                </Link>
              </>
            )}
          </div>

          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-semibold">{user.postsCount.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">posts</span>
            </div>
            <button className="hover:opacity-70" onClick={abrirSeguidores}>
              {/* TODO: fetch("/api/profile/[username]/followers") */}

              <span className="font-semibold">{user.followersCount.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">followers</span>
            </button>
            <button className="hover:opacity-70" onClick={abrirSiguiendo}>
              {/* TODO: fetch("/api/profile/[username]/following") */}

              <span className="font-semibold">{user.followingCount.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">following</span>
            </button>
          </div>

          <div>
            <p className="font-semibold text-sm">{user.name}</p>
            {user.bio && <p className="text-sm whitespace-pre-line mt-0.5">{user.bio}</p>}
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-900 font-semibold hover:underline mt-0.5 block">
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 flex justify-center gap-10 mb-6">
        <button
          onClick={() => handleTabClick("posts")}
          className={`flex items-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-widest ${activeTab === "posts" ? "border-t-2 border-gray-900" : "text-gray-400"}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          Posts
        </button>
        {/* TODO: fetch(`/api/profile/${username}/reels`) on tab click */}

        <button
          onClick={() => handleTabClick("reels")}
          className={`flex items-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-widest ${activeTab === "reels" ? "border-t-2 border-gray-900" : "text-gray-400"}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 9h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 20.625v-9.75C1.5 9.839 2.34 9 3.375 9z" />
          </svg>
          Reels
        </button>
        {isOwn && (
          <button
            onClick={() => handleTabClick("saved")}
            className={`flex items-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-widest ${activeTab === "saved" ? "border-t-2 border-gray-900" : "text-gray-400"}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            Saved
          </button>
        )}
      </div>

      {/* TODO (students): Render the posts grid here.
           `posts` is an array of Post objects fetched above.
           Each post has: id, imageUrl, caption, likesCount, commentsCount, author.
           Display them in a 3-column grid (use grid grid-cols-3 gap-0.5).
           Each cell should be aspect-square with the post image filling it.
           Optionally show a hover overlay with likes/comments counts. */}

      {/* hecho */}

      {activeTab === "posts" && <ProfileGrid posts={posts} />}

      {/* Reels grid */}
      {activeTab === "reels" && (
        reels.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {reels.map((reel) => (
              <Link key={reel.id} href="/reels" className="relative aspect-[9/16] group cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    {reel.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {reel.viewsCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
            <p className="font-semibold text-lg">No reels yet</p>
          </div>
        )
      )}

      {activeTab === "saved" && <ProfileGrid posts={savedPosts} />}

      {/*se pone esta parte de forma adicional para que se pueda verificar que funciona los followers y following*/}
      {tipoVentana && (
        <FollowModal
          tipo={tipoVentana}
          usuarios={usuariosVentana}
          cargando={cargandoVentana}
          onClose={cerrarVentana}
        />
      )}
    </div>
  );
}