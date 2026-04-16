'use client';

import { useState } from 'react';

const STYLE_PRESETS = [
  {
    label: 'Cartoon',
    emoji: 'ð¨',
    prompt: 'Transform this person into a fun cartoon mascot. Bold outlines, bright colours, friendly expression, keep the face recognisable.',
    description: 'Bold outlines, bright colours',
    bg: 'linear-gradient(135deg, #FFD54F 0%, #FF8A65 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cartoon&backgroundColor=FFD54F&top=shortHair&accessories=round&clothing=hoodie',
  },
  {
    label: 'Sports Mascot',
    emoji: 'ð',
    prompt: 'Turn this person into an energetic sports team mascot. Action pose, vivid team colours, bold cartoon style.',
    description: 'Energetic, action pose',
    bg: 'linear-gradient(135deg, #4CAF50 0%, #1565C0 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sports&backgroundColor=4CAF50&top=hat&clothing=graphicShirt&clothingColor=1565C0',
  },
  {
    label: 'Anime',
    emoji: 'â¡',
    prompt: 'Convert this person into an anime character. Large expressive eyes, clean linework, vibrant colour palette.',
    description: 'Large eyes, vibrant colours',
    bg: 'linear-gradient(135deg, #CE93D8 0%, #7986CB 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=anime&backgroundColor=CE93D8',
  },
  {
    label: 'Chibi',
    emoji: 'ð¾',
    prompt: 'Transform this person into a cute chibi character. Oversized head, tiny body, adorable proportions, pastel colours.',
    description: 'Oversized head, pastel tones',
    bg: 'linear-gradient(135deg, #F48FB1 0%, #FFF9C4 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=chibi&backgroundColor=F48FB1',
  },
  {
    label: 'Superhero',
    emoji: 'ð¦¸',
    prompt: 'Render this person as a superhero cartoon character. Dynamic pose, bold costume colours, comic-book style.',
    description: 'Dynamic, comic-book style',
    bg: 'linear-gradient(135deg, #EF5350 0%, #FFA726 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero&backgroundColor=EF5350&top=shortHair&clothing=blazerAndShirt&clothingColor=FFA726',
  },
  {
    label: 'Pixel Art',
    emoji: 'ð®',
    prompt: 'Convert this person into a pixel art character. 16-bit style, limited colour palette, clear pixel details.',
    description: '16-bit retro sprite',
    bg: 'linear-gradient(135deg, #26C6DA 0%, #66BB6A 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel&backgroundColor=26C6DA',
  },
];

function ImageDropZone({
  label,
  hint,
  file,
  preview,
  onChange,
  optional,
}: {
  label: string;
  hint: string;
  file: File | null;
  preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
}) {
  return (
    <div style={styles.dropZone}>
      <p style={styles.dropLabel}>
        {label}
        {optional && <span style={styles.optionalBadge}>Optional</span>}
      </p>
      <p style={styles.dropHint}>{hint}</p>
      {preview ? (
        <div style={{ position: 'relative' }}>
          <img src={preview} alt={label} style={styles.previewImg} />
          <p style={styles.filename}>â {file?.name}</p>
        </div>
      ) : (
        <div style={styles.uploadIcon}>ð</div>
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
    if (!customPrompt.trim()) {
      setError('Please pick a style or write a prompt.');
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
      setError('Network error â check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = !loading && !!targetFile && !!customPrompt.trim();

  return (
    <main style={styles.main}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>ð¨ Mascot Generator</h1>
        <p style={styles.subtitle}>Turn any photo into a cartoon mascot using AI</p>
      </div>

      {/* Step 1: Upload photo */}
      <div style={styles.stepSection}>
        <div style={styles.stepHeader}>
          <span style={styles.stepBadge}>1</span>
          <span style={styles.stepTitle}>Upload your photo</span>
        </div>
        <div style={styles.singleUpload}>
          <ImageDropZone
            label="ð¸ Your Photo"
            hint="Upload the face or character to mascot-ify"
            file={targetFile}
            preview={targetPreview}
            onChange={(e) => handleFile(e, setTargetFile, setTargetPreview)}
          />
        </div>
      </div>

      {/* Step 2: Pick a style */}
      <div style={styles.stepSection}>
        <div style={styles.stepHeader}>
          <span style={styles.stepBadge}>2</span>
          <span style={styles.stepTitle}>Pick a style</span>
        </div>
        <div style={styles.styleGrid}>
          {STYLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(idx)}
              style={{
                ...styles.styleCard,
                borderColor: selectedPreset === idx ? '#6366f1' : '#e5e7eb',
                boxShadow: selectedPreset === idx
                  ? '0 0 0 3px rgba(99,102,241,0.3)'
                  : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {selectedPreset === idx && (
                <div style={styles.selectedTick}>â</div>
              )}
              <div style={{ ...styles.stylePreview, background: preset.bg }}>
                <img
                  src={preset.exampleUrl}
                  alt={preset.label}
                  style={styles.exampleImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement('span');
                      fallback.style.fontSize = '48px';
                      fallback.textContent = preset.emoji;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <div style={styles.styleInfo}>
                <p style={styles.styleName}>{preset.emoji} {preset.label}</p>
                <p style={styles.styleDesc}>{preset.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Customise (optional) */}
      <div style={styles.stepSection}>
        <div style={styles.stepHeader}>
          <span style={{ ...styles.stepBadge, background: '#9ca3af' }}>3</span>
          <span style={styles.stepTitle}>Customise <span style={styles.optionalText}>(optional)</span></span>
        </div>

        <textarea
          value={customPrompt}
          onChange={(e) => {
            setCustomPrompt(e.target.value);
            setSelectedPreset(null);
          }}
          placeholder="Edit the prompt or write your own style descriptionâ¦"
          rows={3}
          style={styles.textarea}
        />

        <details style={styles.details}>
          <summary style={styles.summary}>ð¼ Upload a style reference image instead</summary>
          <div style={{ marginTop: 12 }}>
            <ImageDropZone
              label="Style Reference"
              hint="A cartoon or mascot showing the art style you want"
              file={styleFile}
              preview={stylePreview}
              onChange={(e) => handleFile(e, setStyleFile, setStylePreview)}
              optional
            />
          </div>
        </details>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        style={{
          ...styles.generateBtn,
          background: canGenerate ? 'linear-gradient(135deg, #6366f1, #a855f7)' : '#d1d5db',
          cursor: canGenerate ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'â³  Generating your mascotâ¦' : 'â¨  Generate Mascot'}
      </button>

      {!targetFile && (
        <p style={styles.hintText}>Upload a photo and pick a style to get started</p>
      )}
      {targetFile && !customPrompt.trim() && (
        <p style={styles.hintText}>Pick a style above to generate</p>
      )}

      {loading && (
        <p style={styles.loadingNote}>
          Powered by fal.ai â usually done in under 15 seconds. Don't refresh!
        </p>
      )}

      {/* Error */}
      {error && <div style={styles.errorBox}>â {error}</div>}

      {/* Result */}
      {resultImage && (
        <div style={styles.resultSection}>
          <h2 style={styles.resultTitle}>Your Mascot ð</h2>
          <div style={styles.compareRow}>
            {targetPreview && (
              <div style={styles.compareItem}>
                <p style={styles.compareLabel}>Original</p>
                <img src={targetPreview} alt="Original" style={styles.compareImg} />
              </div>
            )}
            <div style={styles.compareItem}>
              <p style={styles.compareLabel}>
                {selectedPreset !== null ? `${STYLE_PRESETS[selectedPreset].emoji} ${STYLE_PRESETS[selectedPreset].label}` : 'Mascot'}
              </p>
              <img src={resultImage} alt="Generated mascot" style={styles.compareImg} />
            </div>
          </div>
          <div style={styles.actions}>
            <a href={resultImage} download="mascot.jpg" style={styles.downloadBtn}>
              ð¥ Download
            </a>
            <button
              onClick={() => {
                setResultImage(null);
                setError(null);
              }}
              style={styles.resetBtn}
            >
              ð Try another style
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '40px 24px 80px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#111',
  },
  header: {
    textAlign: 'center',
    marginBottom: 40,
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
  stepSection: {
    marginBottom: 32,
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  stepBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#6366f1',
    color: 'white',
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
  },
  stepTitle: {
    fontWeight: 700,
    fontSize: 17,
    color: '#111',
  },
  optionalText: {
    fontWeight: 400,
    fontSize: 14,
    color: '#9ca3af',
  },
  singleUpload: {
    maxWidth: 360,
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  },
  styleCard: {
    position: 'relative',
    border: '2px solid',
    borderRadius: 14,
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'white',
    padding: 0,
    transition: 'all 0.15s ease',
    textAlign: 'left',
  },
  selectedTick: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#6366f1',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 13,
    zIndex: 2,
  },
  stylePreview: {
    width: '100%',
    height: 110,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleImg: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  styleInfo: {
    padding: '10px 12px 12px',
  },
  styleName: {
    margin: '0 0 2px',
    fontWeight: 700,
    fontSize: 14,
    color: '#111',
  },
  styleDesc: {
    margin: 0,
    fontSize: 12,
    color: '#6b7280',
  },
  details: {
    marginTop: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '10px 14px',
    background: '#fafafa',
  },
  summary: {
    fontWeight: 600,
    fontSize: 14,
    color: '#6b7280',
    cursor: 'pointer',
    userSelect: 'none',
  },
  dropZone: {
    border: '2px dashed #c7d2fe',
    borderRadius: 14,
    padding: '20px 16px',
    textAlign: 'center',
    background: '#fafaff',
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  dropLabel: {
    fontWeight: 700,
    fontSize: 15,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  optionalBadge: {
    fontSize: 11,
    fontWeight: 600,
    background: '#f3f4f6',
    color: '#6b7280',
    padding: '2px 8px',
    borderRadius: 20,
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
    maxHeight: 140,
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
    marginBottom: 0,
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
  hintText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 10,
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
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
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
