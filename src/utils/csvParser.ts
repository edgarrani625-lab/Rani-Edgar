import { DemographicRow, StatisticalAudit } from '../types/fairhire';

export function parseOutcomeCsv(csvContent: string): StatisticalAudit {
  if (!csvContent || !csvContent.trim()) {
    return {
      hasData: false,
      message: 'Qualitative review only, not a statistical validation. To run a statistical adverse impact audit, upload historical interview outcome data.',
    };
  }

  try {
    const lines = csvContent
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));

    if (lines.length < 2) {
      return {
        hasData: false,
        message: 'CSV file must have a header row and at least one data row (format: group,interviewed,selected).',
      };
    }

    const header = lines[0].toLowerCase().split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    
    // Find index of group, interviewed, selected
    const groupIdx = header.findIndex(h => h.includes('group') || h.includes('demo') || h.includes('category') || h.includes('gender') || h.includes('ethnicity'));
    const interviewedIdx = header.findIndex(h => h.includes('interview') || h.includes('app') || h.includes('total') || h.includes('screened'));
    const selectedIdx = header.findIndex(h => h.includes('select') || h.includes('hire') || h.includes('pass') || h.includes('offer'));

    const effectiveGroupIdx = groupIdx !== -1 ? groupIdx : 0;
    const effectiveInterviewedIdx = interviewedIdx !== -1 ? interviewedIdx : 1;
    const effectiveSelectedIdx = selectedIdx !== -1 ? selectedIdx : 2;

    const rows: Array<{ groupName: string; interviewed: number; selected: number }> = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 2) continue;

      const groupName = parts[effectiveGroupIdx] || `Group ${i}`;
      const interviewed = parseInt(parts[effectiveInterviewedIdx], 10);
      const selected = parseInt(parts[effectiveSelectedIdx], 10);

      if (!isNaN(interviewed) && interviewed > 0 && !isNaN(selected) && selected >= 0) {
        rows.push({
          groupName,
          interviewed,
          selected: Math.min(selected, interviewed),
        });
      }
    }

    if (rows.length === 0) {
      return {
        hasData: false,
        message: 'Could not parse valid numerical outcome data from CSV. Expected columns: group, interviewed, selected.',
      };
    }

    // Calculate selection rates
    const calculatedRowsWithRates = rows.map(r => ({
      ...r,
      selectionRate: r.selected / r.interviewed,
    }));

    // Find highest selection rate as benchmark
    let benchmarkGroup = calculatedRowsWithRates[0].groupName;
    let benchmarkRate = calculatedRowsWithRates[0].selectionRate;

    for (const r of calculatedRowsWithRates) {
      if (r.selectionRate > benchmarkRate) {
        benchmarkRate = r.selectionRate;
        benchmarkGroup = r.groupName;
      }
    }

    let adverseImpactDetected = false;

    const finalRows: DemographicRow[] = calculatedRowsWithRates.map(r => {
      // Adverse impact ratio = selectionRate / benchmarkRate
      const adverseImpactRatio = benchmarkRate > 0 ? r.selectionRate / benchmarkRate : 1.0;
      // 4/5ths rule: ratio < 0.80 indicates potential adverse impact
      const isAdverseImpact = adverseImpactRatio < 0.80 && r.groupName !== benchmarkGroup;
      if (isAdverseImpact) {
        adverseImpactDetected = true;
      }

      return {
        groupName: r.groupName,
        interviewed: r.interviewed,
        selected: r.selected,
        selectionRate: r.selectionRate,
        adverseImpactRatio,
        isAdverseImpact,
      };
    });

    const totalInterviewed = rows.reduce((acc, curr) => acc + curr.interviewed, 0);
    const totalSelected = rows.reduce((acc, curr) => acc + curr.selected, 0);

    return {
      hasData: true,
      message: adverseImpactDetected
        ? `Adverse impact detected under the EEOC Four-Fifths (80%) Rule. One or more demographic groups have selection rates below 80% of the benchmark group (${benchmarkGroup}).`
        : `Statistical audit complete. No adverse impact detected under the EEOC 80% rule based on provided data.`,
      groups: finalRows,
      benchmarkGroup,
      benchmarkRate,
      adverseImpactDetected,
      totalInterviewed,
      totalSelected,
    };
  } catch (error) {
    return {
      hasData: false,
      message: `Failed to parse CSV outcome data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
