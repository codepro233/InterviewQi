import jsPDF from "jspdf";

// ── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

const C = {
  navy:       hexToRgb("#0A0F1E"),
  navyCard:   hexToRgb("#111827"),
  navyBorder: hexToRgb("#1E2A3A"),
  blue:       hexToRgb("#4F8EF7"),
  success:    hexToRgb("#34D399"),
  warning:    hexToRgb("#FBBF24"),
  danger:     hexToRgb("#F87171"),
  white:      hexToRgb("#F0F4FF"),
  muted:      hexToRgb("#8A9BB5"),
  dimmed:     hexToRgb("#3A4A6A"),
};

function scoreColor(score) {
  return score >= 75 ? C.success : score >= 55 ? C.warning : C.danger;
}

// Wrap text and return lines
function splitText(doc, text, maxWidth) {
  return doc.splitTextToSize(String(text ?? ""), maxWidth);
}

// Draw a filled rounded rect (jsPDF native roundedRect)
function fillRect(doc, x, y, w, h, rgb, r = 3) {
  doc.setFillColor(...rgb);
  doc.roundedRect(x, y, w, h, r, r, "F");
}

// Draw a border-only rounded rect
function strokeRect(doc, x, y, w, h, rgb, r = 3, lw = 0.3) {
  doc.setDrawColor(...rgb);
  doc.setLineWidth(lw);
  doc.roundedRect(x, y, w, h, r, r, "S");
}

// Render wrapped text, returns new Y after text
function renderText(doc, lines, x, y, lineHeight = 5) {
  lines.forEach((line) => {
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateSessionPDF(sessionData) {
  const {
    role,
    level,
    interviewType,
    report,
    exchanges,
    createdAt,
    durationSeconds,
  } = sessionData;

  const doc   = new jsPDF({ unit: "mm", format: "a4" });
  const PW    = 210; // page width
  const PH    = 297; // page height
  const ML    = 16;  // margin left
  const MR    = 16;  // margin right
  const CW    = PW - ML - MR; // content width

  let y = 0; // current Y cursor

  // ── Page background ────────────────────────────────────────────────────────
  const addPageBg = () => {
    fillRect(doc, 0, 0, PW, PH, C.navy, 0);
  };

  addPageBg();

  // ── Header bar ─────────────────────────────────────────────────────────────
  fillRect(doc, 0, 0, PW, 28, C.navyCard, 0);
  doc.setDrawColor(...C.navyBorder);
  doc.setLineWidth(0.3);
  doc.line(0, 28, PW, 28);

  // Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.white);
  doc.text("Interview", ML, 17);

  // "IQ" in blue
  const logoW = doc.getTextWidth("Interview");
  doc.setTextColor(...C.blue);
  doc.text("IQ", ML + logoW, 17);

  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("AI Interview Coach — Session Report", ML, 23);

  // Date top-right
  const dateStr = new Date(createdAt).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text(dateStr, PW - MR, 17, { align: "right" });

  y = 36;

  // ── Role + meta ────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.white);
  doc.text(role, ML, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.muted);
  doc.text(
    `${level}  ·  ${interviewType}  ·  ${exchanges?.length ?? 0} questions`,
    ML,
    y
  );
  y += 12;

  // ── Score + verdict row ────────────────────────────────────────────────────
  const overallScore = report?.overallScore ?? 0;
  const verdict      = report?.verdict      ?? "—";
  const readiness    = report?.readinessLevel ?? "—";
  const duration     = durationSeconds
    ? `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`
    : "—";

  // Score card
  fillRect(doc, ML, y, 42, 30, C.navyCard);
  strokeRect(doc, ML, y, 42, 30, C.navyBorder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...scoreColor(overallScore));
  doc.text(String(overallScore), ML + 21, y + 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("OVERALL SCORE", ML + 21, y + 21, { align: "center" });
  doc.text("/ 100", ML + 21, y + 26, { align: "center" });

  // Verdict card
  fillRect(doc, ML + 46, y, 46, 30, C.navyCard);
  strokeRect(doc, ML + 46, y, 46, 30, C.navyBorder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(verdict, ML + 46 + 23, y + 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("VERDICT", ML + 46 + 23, y + 21, { align: "center" });

  // Readiness card
  fillRect(doc, ML + 96, y, 46, 30, C.navyCard);
  strokeRect(doc, ML + 96, y, 46, 30, C.navyBorder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(readiness, ML + 96 + 23, y + 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("READINESS", ML + 96 + 23, y + 21, { align: "center" });

  // Duration card
  fillRect(doc, ML + 146, y, 32, 30, C.navyCard);
  strokeRect(doc, ML + 146, y, 32, 30, C.navyBorder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(duration, ML + 146 + 16, y + 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("DURATION", ML + 146 + 16, y + 21, { align: "center" });

  y += 38;

  // ── Score bar chart ────────────────────────────────────────────────────────
  if (exchanges?.length > 0) {
    // Section label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.text("SCORE PER QUESTION", ML, y);
    y += 5;

    const barAreaH = 20;
    const barW     = CW / exchanges.length;
    const maxScore = 100;

    exchanges.forEach((ex, i) => {
      const s      = ex.feedback?.score ?? 0;
      const barH   = (s / maxScore) * barAreaH;
      const bx     = ML + i * barW + barW * 0.15;
      const bw     = barW * 0.7;
      const by     = y + barAreaH - barH;

      // Track
      fillRect(doc, bx, y, bw, barAreaH, C.navyBorder, 1);
      // Bar
      fillRect(doc, bx, by, bw, barH, scoreColor(s), 1);

      // Score label above bar
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(...scoreColor(s));
      doc.text(String(s), bx + bw / 2, by - 1.5, { align: "center" });

      // Q label below
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(...C.muted);
      doc.text(`Q${i + 1}`, bx + bw / 2, y + barAreaH + 4, { align: "center" });
    });

    y += barAreaH + 10;
  }

  // ── Strengths + Growth ─────────────────────────────────────────────────────
  const halfW = (CW - 4) / 2;

  // Top Strength
  fillRect(doc, ML, y, halfW, 28, C.navyCard);
  strokeRect(doc, ML, y, halfW, 28, C.navyBorder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.success);
  doc.text("✓  TOP STRENGTH", ML + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  const strengthLines = splitText(doc, report?.topStrength ?? "—", halfW - 8);
  renderText(doc, strengthLines.slice(0, 3), ML + 4, y + 12, 4.5);

  // Growth Area
  const gx = ML + halfW + 4;
  fillRect(doc, gx, y, halfW, 28, C.navyCard);
  strokeRect(doc, gx, y, halfW, 28, C.navyBorder);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.warning);
  doc.text("↑  GROWTH AREA", gx + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  const growthLines = splitText(doc, report?.topGrowthArea ?? "—", halfW - 8);
  renderText(doc, growthLines.slice(0, 3), gx + 4, y + 12, 4.5);

  y += 34;

  // ── Action Plan ────────────────────────────────────────────────────────────
  if (report?.actionPlan?.length) {
    fillRect(doc, ML, y, CW, 8, C.navyCard);
    fillRect(doc, ML, y, CW, 8, C.navyCard);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.blue);
    doc.text("YOUR ACTION PLAN", ML + 4, y + 5.5);
    y += 10;

    report.actionPlan.forEach((action, i) => {
      // Number circle
      fillRect(doc, ML, y, 6, 6, C.blue, 3);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(...C.white);
      doc.text(String(i + 1), ML + 3, y + 4.3, { align: "center" });

      // Action text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.muted);
      const actionLines = splitText(doc, action, CW - 12);
      renderText(doc, actionLines.slice(0, 2), ML + 9, y + 4.5, 4.5);

      y += 10;
    });

    y += 4;
  }

  // ── Divider ────────────────────────────────────────────────────────────────
  doc.setDrawColor(...C.navyBorder);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  y += 8;

  // ── Per-question breakdown ─────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text("Answer Breakdown", ML, y);
  y += 8;

  exchanges?.forEach((ex, i) => {
    // Check if we need a new page
    if (y > PH - 60) {
      doc.addPage();
      addPageBg();

      // Mini header on new pages
      fillRect(doc, 0, 0, PW, 14, C.navyCard, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...C.blue);
      doc.text("InterviewIQ", ML, 9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.muted);
      doc.text("Session Report (continued)", ML + 22, 9);
      y = 22;
    }

    const score    = ex.feedback?.score ?? 0;
    const sc       = scoreColor(score);
    const cardH    = 52;

    fillRect(doc, ML, y, CW, cardH, C.navyCard);
    strokeRect(doc, ML, y, CW, cardH, C.navyBorder);

    // Q number + score
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.text(`Q${i + 1}`, ML + 4, y + 7);

    // Score badge
    fillRect(doc, ML + CW - 22, y + 2.5, 18, 7, sc.map ? [...sc] : sc, 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.navy);
    doc.text(`${score}/100`, ML + CW - 13, y + 7.5, { align: "center" });

    // Question text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.white);
    const qClean = ex.question.replace(/```json[\s\S]*?```/g, "").trim();
    const qLines = splitText(doc, qClean, CW - 30);
    renderText(doc, qLines.slice(0, 2), ML + 12, y + 7, 4);

    // Divider
    doc.setDrawColor(...C.navyBorder);
    doc.setLineWidth(0.2);
    doc.line(ML + 4, y + 15, ML + CW - 4, y + 15);

    // Answer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    const aLines = splitText(doc, ex.answer, CW - 12);
    renderText(doc, aLines.slice(0, 2), ML + 4, y + 21, 4);

    // Divider
    doc.line(ML + 4, y + 30, ML + CW - 4, y + 30);

    // Feedback row
    const fbY = y + 36;

    // Strength
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...C.success);
    doc.text("STRENGTH", ML + 4, fbY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    const sLines = splitText(doc, ex.feedback?.strength ?? "—", CW / 3 - 4);
    renderText(doc, sLines.slice(0, 2), ML + 4, fbY + 4.5, 3.5);

    // Improvement
    const impX = ML + CW / 3 + 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...C.warning);
    doc.text("IMPROVE", impX, fbY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    const iLines = splitText(doc, ex.feedback?.improvement ?? "—", CW / 3 - 4);
    renderText(doc, iLines.slice(0, 2), impX, fbY + 4.5, 3.5);

    // Pro tip
    const tipX = ML + (CW / 3) * 2 + 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...C.blue);
    doc.text("PRO TIP", tipX, fbY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    const tLines = splitText(doc, ex.feedback?.tip ?? "—", CW / 3 - 8);
    renderText(doc, tLines.slice(0, 2), tipX, fbY + 4.5, 3.5);

    y += cardH + 5;
  });

  // ── Footer on last page ────────────────────────────────────────────────────
  if (y < PH - 20) {
    y = PH - 16;
  } else {
    if (y > PH - 20) {
      doc.addPage();
      addPageBg();
      y = PH - 16;
    }
  }

  doc.setDrawColor(...C.navyBorder);
  doc.setLineWidth(0.3);
  doc.line(ML, PH - 18, PW - MR, PH - 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.dimmed);
  doc.text("Generated by InterviewIQ — AI Interview Coach", ML, PH - 12);
  doc.text(
    `interviewiq.vercel.app  ·  ${new Date().getFullYear()}`,
    PW - MR,
    PH - 12,
    { align: "right" }
  );

  // ── Save ───────────────────────────────────────────────────────────────────
  const slug = role.replace(/\s+/g, "-").toLowerCase();
  const timestamp = new Date(createdAt)
    .toISOString()
    .slice(0, 10);

  doc.save(`interviewiq-${slug}-${timestamp}.pdf`);
}