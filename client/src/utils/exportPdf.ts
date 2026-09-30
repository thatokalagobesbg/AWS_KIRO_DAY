import { jsPDF } from 'jspdf';
import { ProjectDetail } from '../api/squadlyApi';

// Standard Bank brand colors
const SB_BLUE = [0, 51, 102] as const; // #003366
const SB_LIGHT_BLUE = [0, 114, 188] as const; // #0072BC

export function exportProjectToPdf(project: ProjectDetail) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, yPos: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, yPos);
    return yPos + (lines.length * fontSize * 0.4);
  };

  // Helper to check page break
  const checkPageBreak = (height: number) => {
    if (y + height > 280) {
      doc.addPage();
      y = 20;
    }
  };

  // ===== HEADER =====
  doc.setFillColor(...SB_BLUE);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SQUADLY', margin, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Squad Assembly Report', margin, 28);
  
  // Date on right
  doc.setFontSize(9);
  const dateStr = new Date().toLocaleDateString('en-ZA', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - 50, 28);

  y = 55;

  // ===== PROJECT DETAILS SECTION =====
  doc.setTextColor(...SB_BLUE);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Overview', margin, y);
  
  // Underline
  doc.setDrawColor(...SB_LIGHT_BLUE);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  
  y += 12;

  // Project Name
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(project.projectName, margin, y);
  y += 8;

  // Status & Urgency badges
  doc.setFontSize(9);
  
  // Status badge
  const statusColor = project.status === 'Active' ? [34, 197, 94] : [156, 163, 175];
  doc.setFillColor(...(statusColor as [number, number, number]));
  doc.roundedRect(margin, y, 30, 6, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(project.status, margin + 3, y + 4.5);

  // Urgency badge
  const urgencyColors: Record<string, [number, number, number]> = {
    HIGH: [239, 68, 68],
    MEDIUM: [245, 158, 11],
    LOW: [34, 197, 94],
  };
  const urgencyColor = urgencyColors[project.urgency] || [156, 163, 175];
  doc.setFillColor(...urgencyColor);
  doc.roundedRect(margin + 35, y, 35, 6, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(`${project.urgency} Urgency`, margin + 38, y + 4.5);

  y += 15;

  // Description
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  if (project.projectDescription) {
    y = addWrappedText(project.projectDescription, margin, y, pageWidth - margin * 2, 10);
    y += 5;
  }

  // Info boxes
  checkPageBreak(40);
  
  const boxWidth = (pageWidth - margin * 2 - 10) / 3;
  
  // Start Date box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, boxWidth, 25, 3, 3, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text('START DATE', margin + 5, y + 8);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(new Date(project.startDate).toLocaleDateString('en-ZA'), margin + 5, y + 18);

  // End Date box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin + boxWidth + 5, y, boxWidth, 25, 3, 3, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('END DATE', margin + boxWidth + 10, y + 8);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(new Date(project.endDate).toLocaleDateString('en-ZA'), margin + boxWidth + 10, y + 18);

  // Duration box
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeks = Math.ceil(days / 7);
  const sprints = Math.ceil(weeks / 2);
  
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin + (boxWidth + 5) * 2, y, boxWidth, 25, 3, 3, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('DURATION', margin + (boxWidth + 5) * 2 + 5, y + 8);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${weeks} weeks (${sprints} sprints)`, margin + (boxWidth + 5) * 2 + 5, y + 18);

  y += 40;

  // ===== SQUAD MEMBERS SECTION =====
  checkPageBreak(30);
  
  doc.setTextColor(...SB_BLUE);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Squad Members', margin, y);
  
  doc.setDrawColor(...SB_LIGHT_BLUE);
  doc.line(margin, y + 2, pageWidth - margin, y + 2);
  
  y += 10;
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${project.projectMembers.length} team members assigned`, margin, y);
  
  y += 10;

  if (project.projectMembers.length === 0) {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('No squad members assigned yet.', margin, y);
    y += 15;
  } else {
    // Group members by role
    const membersByRole = new Map<string, typeof project.projectMembers>();
    for (const member of project.projectMembers) {
      if (!membersByRole.has(member.role)) {
        membersByRole.set(member.role, []);
      }
      membersByRole.get(member.role)!.push(member);
    }

    // Role colors
    const roleColors: Record<string, [number, number, number]> = {
      'Feature Analyst': [147, 51, 234],
      'UX/UI Designer': [236, 72, 153],
      'Frontend Developer': [59, 130, 246],
      'Backend Developer': [34, 197, 94],
      'Quality Engineer': [249, 115, 22],
    };

    for (const [role, members] of membersByRole.entries()) {
      checkPageBreak(15 + members.length * 25);

      // Role header
      const roleColor = roleColors[role] || [100, 100, 100];
      doc.setFillColor(...roleColor);
      doc.roundedRect(margin, y, 5, 5, 1, 1, 'F');
      
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${role} (${members.length})`, margin + 10, y + 4);
      y += 12;

      // Member cards
      for (const member of members) {
        checkPageBreak(25);
        
        // Card background
        doc.setFillColor(250, 250, 252);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 3, 3, 'F');
        
        // Initials circle
        doc.setFillColor(...roleColor);
        doc.circle(margin + 12, y + 11, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const initials = member.empName.split(' ').map(n => n[0]).join('');
        doc.text(initials, margin + 12 - (initials.length * 2), y + 13);
        
        // Name and ID
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text(member.empName, margin + 25, y + 9);
        doc.setTextColor(120, 120, 120);
        doc.setFontSize(8);
        doc.text(member.empId, margin + 25, y + 16);
        
        // Availability
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(`${member.capacity}/40 hrs`, pageWidth - margin - 30, y + 9);
        
        // Match score if available
        if (member.matchScore) {
          doc.setFillColor(...SB_LIGHT_BLUE);
          doc.roundedRect(pageWidth - margin - 30, y + 12, 25, 6, 2, 2, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.text(`Score: ${member.matchScore}`, pageWidth - margin - 28, y + 16);
        }
        
        y += 26;
      }
      
      y += 5;
    }
  }

  // ===== FOOTER =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 285, pageWidth, 15, 'F');
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2 - 10, 292);
    doc.text('Squadly - Standard Bank Hackathon', margin, 292);
  }

  // Save PDF
  const fileName = `${project.projectName.replace(/[^a-z0-9]/gi, '_')}_Squad_Report.pdf`;
  doc.save(fileName);
}
