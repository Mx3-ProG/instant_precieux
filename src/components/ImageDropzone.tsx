import { useEffect, useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";

type Props = { file: File | null; onFile: (file: File | null) => void; error?: string };

export default function ImageDropzone({ file, onFile, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function choose(candidate?: File) {
    if (!candidate) return;
    onFile(candidate);
  }
  return <div className="dropzone-wrap">
    <input ref={inputRef} className="dropzone-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => choose(event.target.files?.[0])}/>
    {file ? <div className="dropzone-preview"><img src={preview} alt="Aperçu de la photo à publier"/><div><ImagePlus/><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(1)} Mo · optimisation automatique en WebP</span><button type="button" onClick={() => onFile(null)}><X/>Retirer</button></div></div> : <button type="button" className={`dropzone ${dragging ? "dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files?.[0]); }}><span><UploadCloud/></span><strong>Déposez votre photo ici</strong><small>ou cliquez pour choisir un fichier · JPG, PNG ou WebP · 10 Mo maximum</small></button>}
    {error ? <p className="dropzone-error">{error}</p> : null}
  </div>;
}
