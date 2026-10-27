import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { InterviewKit } from '../types/fairhire';

export async function exportKitToDocx(kit: InterviewKit): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'FairHire Interview Assistant - Structured Interview Kit',
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Target Role: ', bold: true }),
              new TextRun(`${kit.jobTitle} (${kit.seniority})`),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Approval Status: ', bold: true }),
              new TextRun(kit.approved ? 'APPROVED' : 'NOT APPROVED'),
              new TextRun(` | Approved At: ${kit.approvedAt || 'Pending'}`),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Audit Status: ', bold: true }),
              new TextRun(kit.auditStatus),
            ],
            spacing: { after: 200 },
          }),

          // Section 1: Bias Audit
          new Paragraph({
            text: '1. Executive Bias Audit Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            text: kit.auditSummary,
            spacing: { after: 200 },
          }),

          // Flagged items table
          ...(kit.flaggedItems.length > 0
            ? [
                new Paragraph({
                  text: 'Flagged Risk Items & Remediation',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 100 },
                }),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Item / Section', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Issue Type', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Groups Affected', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Risk', bold: true })] })] }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Fix Applied', bold: true })] })] }),
                      ],
                    }),
                    ...kit.flaggedItems.map(
                      item =>
                        new TableRow({
                          children: [
                            new TableCell({ children: [new Paragraph(String(item.questionNum))] }),
                            new TableCell({ children: [new Paragraph(item.issueType)] }),
                            new TableCell({ children: [new Paragraph(item.groupsAffected)] }),
                            new TableCell({ children: [new Paragraph(item.risk)] }),
                            new TableCell({ children: [new Paragraph(item.fixApplied)] }),
                          ],
                        })
                    ),
                  ],
                }),
                new Paragraph({ text: '', spacing: { after: 200 } }),
              ]
            : []),

          // Statistical Audit Note
          new Paragraph({
            text: 'Statistical Outcome Audit (Four-Fifths Rule)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: kit.statisticalAudit.message,
            spacing: { after: 200 },
          }),

          // Section 2: Questions & Rubrics
          new Paragraph({
            text: '2. Structured Interview Questions & Scoring Rubrics',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          ...kit.questions.flatMap((q, idx) => [
            new Paragraph({
              text: `Question ${idx + 1}: ${q.category} [${q.status.toUpperCase()}]`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Question: ', bold: true }),
                new TextRun(`"${q.question}"`),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Competency: ', bold: true }),
                new TextRun(q.competency),
              ],
              spacing: { after: 100 },
            }),
            ...(q.status === 'Changed' && q.originalQuestion
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Original Formulation: ', italics: true }),
                      new TextRun(`"${q.originalQuestion}"`),
                    ],
                    spacing: { after: 60 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Reason for Revision: ', italics: true }),
                      new TextRun(q.changeRationale || ''),
                    ],
                    spacing: { after: 100 },
                  }),
                ]
              : []),
            new Paragraph({
              children: [new TextRun({ text: 'Strong Answer Indicators (Look For):', bold: true })],
              spacing: { after: 60 },
            }),
            ...q.strongAnswerIndicators.map(
              ind =>
                new Paragraph({
                  bullet: { level: 0 },
                  text: ind,
                })
            ),
            new Paragraph({
              children: [new TextRun({ text: '5-Point Behaviorally Anchored Rating Scale (BARS):', bold: true })],
              spacing: { before: 100, after: 60 },
            }),
            new Paragraph({ text: `1 - Unsatisfactory: ${q.scoringRubric[1]}` }),
            new Paragraph({ text: `2 - Needs Improvement: ${q.scoringRubric[2]}` }),
            new Paragraph({ text: `3 - Meets Expectations: ${q.scoringRubric[3]}` }),
            new Paragraph({ text: `4 - Exceeds Expectations: ${q.scoringRubric[4]}` }),
            new Paragraph({ text: `5 - Outstanding: ${q.scoringRubric[5]}` }),
            new Paragraph({
              children: [new TextRun({ text: 'Follow-up Probes:', bold: true })],
              spacing: { before: 100, after: 60 },
            }),
            ...q.followUpProbes.map(
              probe =>
                new Paragraph({
                  bullet: { level: 0 },
                  text: `"${probe}"`,
                })
            ),
            new Paragraph({ text: '', spacing: { after: 200 } }),
          ]),

          // Legal Disclaimer
          new Paragraph({
            text: 'Decision Support Disclaimer: This tool lowers bias risk but does not guarantee fairness or legal compliance. Have HR/legal review for your jurisdiction (e.g., NYC Local Law 144, EU AI Act).',
            spacing: { before: 300 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FairHire_Interview_Kit_${kit.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printOrExportPdf(): void {
  window.print();
}

export function downloadMarkdownFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
