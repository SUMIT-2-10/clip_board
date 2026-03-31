import Image from "next/image";
import Link from "next/link";

const TextIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const FileIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
  </svg>
);

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-background text-foreground font-sans min-h-screen">
      <div className="flex p-1 mb-4 bg-muted/50 rounded-2xl w-fit mx-auto sm:mx-0 backdrop-blur-sm border border-border">
        <Link
          href="/sharetext"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <TextIcon />
          Send Text
        </Link>
        <Link
          href="/retrieve"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <TextIcon />
          Retrieve Text
        </Link>
      
        <Link
          href="/sharefile"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <FileIcon />
          Send Files
        </Link>
        <Link
          href="/retrieve"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <FileIcon />
          Retrieve Files
        </Link>
        </div>
    </div>
  );
}
