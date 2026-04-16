'use client';

import { useState } from 'react';

const STYLE_PRESETS = [
  {
    label: 'Cartoon',
    emoji: 'ð¨',
    prompt: 'Transform this person into a fun cartoon mascot with bold outlines, bright colours, and a friendly expression. Keep the face recognisable.',
    description: 'Bold outlines, bright colours',
    bg: 'linear-gradient(135deg, #FFD54F 0%, #FF8A65 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mascot1&backgroundColor=FFD54F&top=shortHair&accessories=round&clothing=hoodie&clothingColor=FF8A65',
  },
  {
    label: 'Sports Mascot',
    emoji: 'ð',
    prompt: 'Turn this person into an energetic sports team mascot with vivid team colours and a bold cartoon style.',
    description: 'Energetic, vivid team colours',
    bg: 'linear-gradient(135deg, #4CAF50 0%, #1565C0 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sports7&backgroundColor=4CAF50&top=hat&clothing=graphicShirt&clothingColor=1565C0&accessories=wayfarers',
  },
  {
    label: 'Anime',
    emoji: 'â¡',
    prompt: 'Convert this person into an anime character with large expressive eyes, clean linework, and a vibrant colour palette.',
    description: 'Large eyes, clean linework',
    bg: 'linear-gradient(135deg, #CE93D8 0%, #7986CB 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/lorelei/svg?seed=anime9&backgroundColor=CE93D8&hairColor=7986CB',
  },
  {
    label: 'Chibi',
    emoji: 'ð¾',
    prompt: 'Transform this person into a cute chibi character with an oversized head, tiny body, adorable proportions, and pastel colours.',
    description: 'Oversized head, pastel tones',
    bg: 'linear-gradient(135deg, #F48FB1 0%, #FFF9C4 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=chibi3&backgroundColor=F48FB1',
  },
  {
    label: 'Superhero',
    emoji: 'ð¦¸',
    prompt: 'Render this person as a superhero cartoon character with a dynamic pose, bold costume colours, and comic-book style.',
    description: 'Dynamic, comic-book style',
    bg: 'linear-gradient(135deg, #EF5350 0%, #FFA726 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero4&backgroundColor=EF5350&top=shortHair&clothing=blazerAndShirt&clothingColor=FFA726&accessories=kurt',
  },
  {
    label: 'Pixel Art',
    emoji: 'ð®',
    prompt: 'Convert this person into a pixel art character in 16-bit retro style with a limited colour palette and clear pixel details.',
    description: '16-bit retro sprite',
    bg: 'linear-gradient(135deg, #26C6DA 0%, #66BB6A 100%)',
    exampleUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=pixel5&backgroundColor=26C6DA',
  },
];

const POSE_PRESETS = [
  // Golf
  { label: 'Full Swing', emoji: 'ðï¸', description: 'Dynamic backswing', modifier: 'in a powerful full golf swing, club raised high on backswing follow-through, dynamic motion', category: 'golf' },
  { label: 'Putting', emoji: 'â³', description: 'Focused on the green', modifier: 'in a precise putting stance, leaning over putter, intense focused expression on the green', category: 'golf' },
  { label: 'Tee Shot', emoji: 'ð¯', description: 'Ready at the tee', modifier: 'at address position about to tee off, gripping driver confidently, ready to swing', category: 'golf' },
  { label: 'Chip Shot', emoji: 'ðª', description: 'Short game precision', modifier: 'in a chip shot stance, pitching wedge in hand, precision short game pose', category: 'golf' },
  { label: 'Hole in One!', emoji: 'ð', description: 'Celebrating victory', modifier: 'jumping and celebrating a hole in one, fist pump in the air, ecstatic joyful expression, confetti', category: 'golf' },
  { label: 'Walking', emoji: 'ð¶', description: 'Strolling the fairway', modifier: 'walking confidently along a golf course fairway with a golf bag, relaxed and confident stride', category: 'golf' },
  // Action
  { label: 'Running', emoji: 'ð', description: 'Full speed ahead', modifier: 'running at full speed with dynamic action pose and motion lines', category: 'action' },
  { label: 'Jumping', emoji: 'ð¦', description: 'Airborne excitement', modifier: 'jumping high in the air with arms raised and an excited expression', category: 'action' },
  { label: 'Pointing', emoji: 'ð', description: 'Bold and confident', modifier: 'pointing finger directly at the viewer with a bold confident expression and strong stance', category: 'action' },
  { label: 'Waving', emoji: 'ð', description: 'Friendly greeting', modifier: 'waving enthusiastically with a big warm smile and welcoming gesture', category: 'action' },
  { label: 'Thumbs Up', emoji: 'ð', description: 'Big approval', modifier: 'giving a big thumbs up with a wide confident grin and upbeat energy', category: 'action' },
  { label: 'Arms Crossed', emoji: 'ðª', description: 'Strong and cool', modifier: 'arms crossed with a cool confident expression and strong powerful stance', category: 'action' },
];

function ImageDropZone({
  label, hint, file, preview, onChange, optional,
}: {
  label: string; hint: string; file: File | null; preview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; optional?: boolean;
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
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [selectedPose, setSelectedPose] = useState<number | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void, setPreview: (url: string | null) => void) {
    const file = e.target.files?.[0] || null;
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function buildPrompt(styleIdx: number | null, poseIdx: number | null): string {
    const stylePart = styleIdx !== null ? STYLE_PRESETS[styleIdx].prompt : '';
    const posePart = poseIdx !== null ? `Show the character ${POSE_PRESETS[poseIdx].modifier}.` : '';
    return [stylePart, posePart].filter(Boolean).join(' ');
  }

  function handleStyleClick(idx: number) {
    setSelectedStyle(idx);
    setCustomPrompt(buildPrompt(idx, selectedPose));
  }

  function handlePoseClick(idx: number) {
    const newPose = selectedPose === idx ? null : idx;
    setSelectedPose(newPose);
    setCustomPrompt(buildPrompt(selectedStyle, newPose));
  }

  async function handleGenerate() {
    if (!targetFile) { setError('Please upload a photo first.'); return; }
    if (!customPrompt.trim()) { setError('Please pick a style to generate.'); return; }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const formData = new FormData();
      formData.append('target', targetFile);
      if (styleFile) formData.append('style', styleFile);
      formData.append('prompt', customPrompt);

      const res = await fetch('/api/generate', { method: 'POST', body: formData });
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
  const golfPoses = POSE_PRESETS.filter(p => p.category === 'golf');
  const actionPoses = POSE_PRESETS.filter(p => p.category === 'action');

  return (
    <main style={styles.main}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>ð¨ Mascot Generator</h1>
        <p style={styles.subtitle}>Turn any photo into a cartoon mascot using AI</p>
      </div>

      {/* Step 1: Upload */}
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

      {/* Step 2: Style */}
      <div style={styles.stepSection}>
        <div style={styles.stepHeader}>
          <span style={styles.stepBadge}>2</span>
          <span style={styles.stepTitle}>Pick a style</span>
        </div>
        <div style={styles.styleGrid}>
          {STYLE_PRESETS.map((preset, idx) => (
            <button key={idx} onClick={() => handleStyleClick(idx)} style={{
              ...styles.styleCard,
              borderColor: selectedStyle === idx ? '#6366f1' : '#e5e7eb',
              boxShadow: selectedStyle === idx ? '0 0 0 3px rgba(99,102,241,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {selectedStyle === idx && <div style={styles.selectedTick}>â</div>}
              <div style={{ ...styles.stylePreview, background: preset.bg }}>
                <img src={preset.exampleUrl} alt={preset.label} style={styles.exampleImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const el = document.createElement('span');
                    el.style.fontSize = '44px';
                    el.textContent = preset.emoji;
                    (e.target as HTMLImageElement).parentElement?.appendChild(el);
                  }} />
              </div>
              <div style={styles.styleInfo}>
                <p style={styles.styleName}>{preset.emoji} {preset.label}</p>
                <p style={styles.styleDesc}>{preset.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Pose */}
      <div style={styles.stepSection}>
        <div style={styles.stepHeader}>
          <span style={styles.stepBadge}>3</span>
          <span style={styles.stepTitle}>Pick a pose <span style={styles.optionalText}>(optional)</span></span>
        </div>

        <p style={styles.poseGroupLabel}>â³ Golf poses</p>
        <div style={styles.poseGrid}>
          {golfPoses.map((pose, i) => {
            const idx = POSE_PRESETS.indexOf(pose);
            return (
              <button key={i} onClick={() => handlePoseClick(idx)} style={{
                ...styles.poseCard,
                borderColor: selectedPose === idx ? '#10b981' : '#e5e7eb',
                background: selectedPose === idx ? '#ecfdf5' : 'white',
                boxShadow: selectedPose === idx ? '0 0 0 3px rgba(16,185,129,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <span style={styles.poseEmoji}>{pose.emoji}</span>
                <span style={styles.poseName}>{pose.label}</span>
                <span style={styles.poseDesc}>{pose.description}</span>
              </button>
            );
          })}
        </div>

        <p style={{ ...styles.poseGroupLabel, marginTop: 16 }}>ð¬ Action poses</p>
        <div style={styles.poseGrid}>
          {actionPoses.map((pose, i) => {
            const idx = POSE_PRESETS.indexOf(pose);
            return (
              <button key={i} onClick={() => handlePoseClick(idx)} style={{
                ...styles.poseCard,
                borderColor: selectedPose === idx ? '#10b981' : '#e5e7eb',
                background: selectedPose === idx ? '#ecfdf5' : 'white',
                boxShadow: selectedPose === idx ? '0 0 0 3px rgba(16,185,129,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <span style={styles.poseEmoji}>{pose.emoji}</span>
                <span style={styles.poseName}>{pose.label}</span>
                <span style={styles.poseDesc}>{pose.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4: Customise */}
      <div style={styles.stepSection}>
        <div style={styles.stepHeader}>
          <span style={{ ...styles.stepBadge, background: '#9ca3af' }}>4</span>
          <span style={styles.stepTitle}>Customise <span style={styles.optionalText}>(optional)</span></span>
        </div>
        <textarea
          value={customPrompt}
          onChange={(e) => { setCustomPrompt(e.target.value); setSelectedStyle(null); }}
          placeholder="Edit the prompt or write your ownâ¦"
          rows={3}
          style={styles.textarea}
        />
        <details style={styles.details}>
          <summary style={styles.summary}>ð¼ Upload a style reference image instead</summary>
          <div style={{ marginTop: 12 }}>
            <ImageDropZone
              label="Style Reference" hint="A cartoon or mascot showing the art style you want"
              file={styleFile} preview={stylePreview}
              onChange={(e) => handleFile(e, setStyleFile, setStylePreview)}
              optional
            />
          </div>
        </details>
      </div>

      {/* Generate */}
      <button onClick={handleGenerate} disabled={!canGenerate} style={{
        ...styles.generateBtn,
        background: canGenerate ? 'linear-gradient(135deg, #6366f1, #a855f7)' : '#d1d5db',
        cursor: canGenerate ? 'pointer' : 'not-allowed',
      }}>
        {loading ? 'â³  Generating your mascotâ¦' : 'â¨  Generate Mascot'}
      </button>

      {!targetFile && <p style={styles.hintText}>Upload a photo and pick a style to get started</p>}
      {targetFile && !customPrompt.trim() && <p style={styles.hintText}>Pick a style above to generate</p>}

      {loading && (
        <p style={styles.loadingNote}>Powered by fal.ai â usually done in under 15 seconds. Don't refresh!</p>
      )}

      {error && <div style={styles.errorBox}>â {error}</div>}

      {resultImage && (
        <div style={styles.resultSection}>
          <h2 style={styles.resultTitle}>Your Mascot ð</h2>
          {selectedStyle !== null && selectedPose !== null && (
            <p style={styles.resultMeta}>
              {STYLE_PRESETS[selectedStyle].emoji} {STYLE_PRESETS[selectedStyle].label} Â· {POSE_PRESETS[selectedPose].emoji} {POSE_PRESETS[selectedPose].label}
            </p>
          )}
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
            <a href={resultImage} download="mascot.jpg" style={styles.downloadBtn}>ð¥ Download</a>
            <button onClick={() => { setResultImage(null); setError(null); }} style={styles.resetBtn}>
              ð Try another
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111' },
  header: { textAlign: 'center', marginBottom: 40 },
  title: { fontSize: 36, fontWeight: 800, margin: '0 0 8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { color: '#666', fontSize: 16, margin: 0 },
  stepSection: { marginBottom: 32 },
  stepHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 },
  stepBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#6366f1', color: 'white', fontWeight: 800, fontSize: 14, flexShrink: 0 },
  stepTitle: { fontWeight: 700, fontSize: 17, color: '#111' },
  optionalText: { fontWeight: 400, fontSize: 14, color: '#9ca3af' },
  singleUpload: { maxWidth: 360 },
  styleGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  styleCard: { position: 'relative', border: '2px solid', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', background: 'white', padding: 0, transition: 'all 0.15s ease', textAlign: 'left' },
  selectedTick: { position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, zIndex: 2 },
  stylePreview: { width: '100%', height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  exampleImg: { width: 80, height: 80, objectFit: 'contain' },
  styleInfo: { padding: '10px 12px 12px' },
  styleName: { margin: '0 0 2px', fontWeight: 700, fontSize: 14, color: '#111' },
  styleDesc: { margin: 0, fontSize: 12, color: '#6b7280' },
  poseGroupLabel: { fontWeight: 700, fontSize: 13, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 10px' },
  poseGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  poseCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: '2px solid', borderRadius: 12, padding: '12px 8px', cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'center' },
  poseEmoji: { fontSize: 28 },
  poseName: { fontWeight: 700, fontSize: 13, color: '#111' },
  poseDesc: { fontSize: 11, color: '#6b7280' },
  details: { marginTop: 12, border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', background: '#fafafa' },
  summary: { fontWeight: 600, fontSize: 14, color: '#6b7280', cursor: 'pointer', userSelect: 'none' },
  dropZone: { border: '2px dashed #c7d2fe', borderRadius: 14, padding: '20px 16px', textAlign: 'center', background: '#fafaff', minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  dropLabel: { fontWeight: 700, fontSize: 15, margin: 0, display: 'flex', alignItems: 'center', gap: 8 },
  optionalBadge: { fontSize: 11, fontWeight: 600, background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: 20 },
  dropHint: { fontSize: 13, color: '#888', margin: 0 },
  uploadIcon: { fontSize: 36, margin: '8px 0' },
  previewImg: { width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 4 },
  filename: { fontSize: 12, color: '#666', margin: '4px 0 0' },
  uploadBtn: { display: 'inline-block', background: '#6366f1', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  textarea: { width: '100%', borderRadius: 10, border: '1.5px solid #ddd', padding: '12px 14px', fontSize: 14, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none', color: '#333', marginBottom: 0 },
  generateBtn: { display: 'block', width: '100%', padding: '16px 0', fontSize: 18, fontWeight: 800, color: 'white', border: 'none', borderRadius: 12, transition: 'opacity 0.2s', letterSpacing: 0.3 },
  hintText: { textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 10 },
  loadingNote: { textAlign: 'center', color: '#888', fontSize: 13, marginTop: 12 },
  errorBox: { marginTop: 20, padding: '14px 18px', background: '#fff1f1', border: '1px solid #fca5a5', borderRadius: 10, color: '#b91c1c', fontWeight: 500, fontSize: 14 },
  resultSection: { marginTop: 40, textAlign: 'center' },
  resultTitle: { fontSize: 24, fontWeight: 800, marginBottom: 6 },
  resultMeta: { color: '#6366f1', fontWeight: 600, fontSize: 15, marginBottom: 20 },
  compareRow: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  compareItem: { flex: '0 0 auto', width: 280 },
  compareLabel: { fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 8 },
  compareImg: { width: '100%', borderRadius: 14, boxShadow: '0 6px 24px rgba(0,0,0,0.12)' },
  actions: { marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' },
  downloadBtn: { display: 'inline-block', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', padding: '10px 22px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' },
  resetBtn: { background: 'white', border: '1.5px solid #ddd', padding: '10px 22px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', color: '#444' },
};
