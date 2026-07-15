import { Link } from "react-router-dom";
import { ArrowLeft, Linkedin, Github, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import dharni from "../assets/dharni.png";
import darshini from "../assets/darshini.jpeg";
import sam from "../assets/samyuktha.jpeg";

const TEAM = [
  {
    image: dharni,
    name: "Dharni Patel",
    role: "",
    bio: "AI-focused engineering student skilled in building full-stack AI platforms using React, FastAPI, MongoDB, and Qdrant. Developed ThinkHive's RAG pipeline, confidence scoring, and enterprise knowledge dashboards.",
    linkedin: "https://www.linkedin.com/in/dharni-patel-a52625323/",
    github: "https://github.com/Dharnipatel21",
  },
  {
    image: darshini,
    name: "Darshini",
    role: "",
    bio: "Third-year CSBS student skilled in Web Development, Data Structures & Algorithms, Artificial Intelligence, and Problem Solving. Passionate about developing scalable software, learning modern technologies, and contributing to innovative projects.",
    linkedin: "https://www.linkedin.com/in/s-darshini-jeya-shakthi-a5198431b/",
    github: "https://github.com/Darshini240906",
  },
  {
    image: sam,
    name: "Samyuktha Lakshmi",
    role: "",
    bio: "Building intelligent web applications with AI and full-stack technologies. Passionate about Generative AI, Retrieval-Augmented Generation (RAG), and creating scalable solutions that bridge technology and business.",
    linkedin: "https://www.linkedin.com/in/samyuktha-lakshmi-14a7a334a/",
    github: "https://github.com/samyuuuu-afk",
  },
];

export default function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-base text-cream">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-base-deep/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <img src={isDark ? logoDark : logoLight} alt="ThinkHive" className="h-full w-full object-contain" />
            </div>
            <span className="font-display text-lg font-bold text-cream">ThinkHive</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-rose-muted transition-colors hover:text-cream">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Back to home</span><span className="sm:hidden">Back</span>
          </Link>
        </div>
      </nav>

      {/* Intro */}
      <section className="relative overflow-hidden px-4 pb-16 pt-24 text-center sm:px-6 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-1/3 top-0 h-80 w-80 rounded-full bg-gold/8 blur-3xl animate-fade-in" />
          <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-gold/5 blur-3xl animate-fade-in" style={{ animationDelay: "150ms" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl stagger-item">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-gold sm:mb-6 sm:px-4 sm:text-xs sm:tracking-widest">
            About Us
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-cream sm:text-4xl md:text-5xl">
            The team behind <span className="text-gold">ThinkHive</span>
          </h1>
          <p className="mt-5 text-base text-rose-muted sm:mt-6 sm:text-lg">
            {/* Placeholder — replace with real company description */}
            Stop searching. Start asking.  ThinkHive-your organization's brain, on demand.
          </p>
        </div>
      </section>

      {/* Team cards */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:pb-28">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className="stagger-item group relative rounded-2xl border border-border bg-surface p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_20px_40px_-15px_rgba(212,175,106,0.25)] sm:p-6 lg:p-8"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Avatar placeholder */}
              <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-gold/30 bg-base-deep/40 transition-transform duration-300 group-hover:scale-105">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <User size={40} className="text-rose-muted/50" />
                )}
              </div>

              <h3 className="font-display text-xl font-semibold text-cream">{member.name}</h3>
              <p className="mt-1 text-sm font-mono uppercase tracking-wide text-gold">{member.role}</p>
              <p className="mt-4 text-sm text-rose-muted">{member.bio}</p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-rose-muted transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-rose-muted transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <Github size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
