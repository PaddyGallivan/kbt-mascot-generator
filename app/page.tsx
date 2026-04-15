'use client';

import { useState } from 'react';

const STYLE_PRESETS = [
  { label: '🎨 Cartoon', prompt: 'Transform this person into a fun cartoon mascot. Bold outlines, bright colours, friendly expression, keep the face recognisable.' },
  { label: '🏆 Sports Mascot', prompt: 'Turn this person into an energetic sports team mascot. Action pose, vivid team colours, bold cartoon style.' },
  { label: '🍣 Anime', prompt: 'Convert this person into an anime character. Large expressive eyes, clean linework, vibrant colour palette.' },
  { label: '🐻 Chibi', prompt: 'Transform this person into a cute chibi character. Oversized head, tiny body, adorable proportions, pastel colours.' },
  { label: '🦸 Superhero', prompt: 'Render this person as a superhero cartoon character. Dynamic pose, bold costume colours, comic-book style.' },
  { label: '🎮 Pixel Art', prompt: 'Convert this person into a pixel art character. 16-bit style, limited colour palette, clear pixel details.' },
];

function ImageDropZone({
  label,
  hint,
  file,
  preview,
  onChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div style={styles.dropZone}>
      <p style={styles.dropLabel}>{label}</p>
      <p style={styles.dropHint}>{hint}</p>
      {preview ? (
        <div style={{ position: 'relative' }}>
          <img src={preview} alt={label} style={styles.previewImg} />
          <p style={styles.filename}>✓ {file?.name}</p>
        </div>
      ) : (
        <div style={styles.uploadIcon}>📁</div>
      )}
      <label style={styles.uploadBtn}>
        {preview ? 'Change image' : 'Choose image'}
        <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
      </label>
    </div>
  );
}

export default function Home() {
  const [targetFile, setTargetFile] = useState<File | null>(null);
  const [styleFile, setStyleFile] = useState<File | null>(null);
  const [targetPreview, setTargetPreview] = useState<string | null>(null);
  const [stylePreview, setStylePreview] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (url: string | null) => void
  ) {
    const file = e.target.files?.[0] || null;
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function handlePresetClick(idx: number) {
    setSelectedPreset(idx);
    setCustomPrompt(STYLE_PRESETS[idx].prompt);
  }

  async function handleGenerate() {
    if (!targetFile) {
      setError('Please upload a target photo first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append('target', targetFile);
      if (styleFile) formData.append('style', styleFile);
      formData.append('prompt', customPrompt);

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else if (data.image) {
        setResultImage(data.image);
      } else {
        setError('No image returned. Please try again.');
      }
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = !loading && !!targetFile;

  return (
    <main style={styles.main}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎨 Mascot Generator</h1>
        <p style={styles.subtitle}>Turn any photo into a cartoon mascot using AI</p>
      </div>

      {/* Images row */}
      <div style={styles.imagesRow}>
        <ImageDropZone
          label="📸 Target Photo"
          hint="The person you want to mascot-ify"
          file={targetFile}
          preview={targetPreview}
          onChange={(e) => handleFile(e, setTargetFile, setTargetPreview)}
        />
        <div style={styles.arrow}>→</div>
        <ImageDropZone
          label="🖼 Style Reference (optional)"
          hint="A cartoon/mascot showing the art style"
          file={styleFile}
          preview={stylePreview}
          onChange={(e) => handleFile(e, setStyleFile, setStylePreview)}
        />
      </div>

      {/* Style presets */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Quick style presets:</p>
        <div style={styles.presetRow}>
          {STYLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(idx)}
              style={{
                ...styles.presetBtn,
                background: selectedPreset === idx ? '#6366f1' : '#f0f0ff',
                color: selectedPreset === idx ? 'white' : '#333',
                borderColor: selectedPreset === idx ? '#6366f1' : '#ddd',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom prompt */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Prompt (edit or write your own):</p>
        <textarea
          value={customPrompt}
          onChange={(e) => {
            setCustomPrompt(e.target.value);
            setSelectedPreset(null);
          }}
          placeholder="Describe the mascot style you want… or just pick a preset above."
          rows={3}
          style={styles.textarea}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        style={{
          ...styles.generateBtn,
          background: canGenerate ? '#6366f1' : '#a5b4fc',
          cursor: canGenerate ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? '⏳  Generating your mascot…' : '✨  Generate Mascot'}
      </button>

      {loading && (
        <p style={styles.loadingNote}>
          Powered by fal.ai — usually done in under 15 seconds. Don't refresh!
        </p>
      )}

      {/* Error */}
      {error && <div style={styles.errorBox}>❌ {error}</div>}

      {/* Result */}
      {resultImage && (
        <div style={styles.resultSection}>
          <h2 style={styles.resultTitle}>Your Mascot 🎉</h2>
          <div style={styles.compareRow}>
            {targetPreview && (
              <div style={styles.compareItem}>
                <p style={styles.compareLabel}>Original</p>
                <img src={targetPreview} alt="Original" style={styles.compareImg} />
              </div>
            )}
            <div style={styles.compareItem}>
              <p style={styles.compareLabel}>Mascot</p>
              <img src={resultImage} alt="Generated mascot" style={styles.compareImg} />
            </div>
          </div>
          <div style={styles.actions}>
            <a href={resultImage} download="mascot.jpg" style={styles.downloadBtn}>
              📥 Download
            </a>
            <button
              onClick={() => {
                setResultImage(null);
                setError(null);
              }}
              style={styles.resetBtn}
            >
              🔄 Generate again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '40px 24px 80px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#111',
  },
  header: {
    textAlign: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    margin: '0 0 8px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    margin: 0,
  },
  imagesRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  arrow: {
    fontSize: 28,
    color: '#a855f7',
    flexShrink: 0,
  },
  dropZone: {
    flex: 1,
    border: '2px dashed #c7d2fe',
    borderRadius: 14,
    padding: '20px 16px',
    textAlign: 'center',
    background: '#fafaff',
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  dropLabel: {
    fontWeight: 700,
    fontSize: 15,
    margin: 0,
  },
  dropHint: {
    fontSize: 13,
    color: '#888',
    margin: 0,
  },
  uploadIcon: {
    fontSize: 36,
    margin: '8px 0',
  },
  previewImg: {
    width: '100%',
    maxHeight: 160,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 4,
  },
  filename: {
    fontSize: 12,
    color: '#666',
    margin: '4px 0 0',
  },
  uploadBtn: {
    display: 'inline-block',
    background: '#6366f1',
    color: 'white',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    marginTop: 0,
  },
  presetRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    border: '1.5px solid',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  textarea: {
    width: '100%',
    borderRadius: 10,
    border: '1.5px solid #ddd',
    padding: '12px 14px',
    fontSize: 14,
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
    color: '#333',
  },
  generateBtn: {
    display: 'block',
    width: '100%',
    padding: '16px 0',
    fontSize: 18,
    fontWeight: 800,
    color: 'white',
    border: 'none',
    borderRadius: 12,
    transition: 'opacity 0.2s',
    letterSpacing: 0.3,
  },
  loadingNote: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    marginTop: 12,
  },
  errorBox: {
    marginTop: 20,
    padding: '14px 18px',
    background: '#fff1f1',
    border: '1px solid #fca5a5',
    borderRadius: 10,
    color: '#b91c1c',
    fontWeight: 500,
    fontSize: 14,
  },
  resultSection: {
    marginTop: 40,
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: 20,
  },
  compareRow: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  compareItem: {
    flex: '0 0 auto',
    width: 280,
  },
  compareLabel: {
    fontWeight: 600,
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  compareImg: {
    width: '100%',
    borderRadius: 14,
    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
  },
  actions: {
    marginTop: 20,
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  downloadBtn: {
    display: 'inline-block',
    background: '#6366f1',
    color: 'white',
    padding: '10px 22px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    textDecoration: 'none',
  },
  resetBtn: {
    background: 'white',
    border: '1.5px solid #ddd',
    padding: '10px 22px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    color: '#444',
  },
};
