const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateResumePDF(outputPath) {
    // Standard A4 dimensions: 595.28 x 841.89 points
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 32, bottom: 30, left: 40, right: 40 },
        autoFirstPage: true,
        bufferPages: true
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Classic Executive ATS Palette (Clean & Legible)
    const primaryColor = '#111827'; // Dark charcoal / near black
    const secondaryColor = '#374151'; // Slate 700
    const textColor = '#1F2937';    // Slate 800
    const mutedColor = '#4B5563';   // Slate 600
    const linkColor = '#0369A1';    // Deep sky blue
    const lineColor = '#D1D5DB';    // Light gray rule

    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;
    const contentWidth = right - left;

    function addSectionHeader(title) {
        doc.y += 9;
        const y = doc.y;
        doc.font('Times-Bold')
           .fontSize(10)
           .fillColor(primaryColor)
           .text(title.toUpperCase(), left, y, { characterSpacing: 0.8 });
        
        const lineY = doc.y + 2;
        doc.moveTo(left, lineY)
           .lineTo(right, lineY)
           .strokeColor(lineColor)
           .lineWidth(0.6)
           .stroke();
        doc.y = lineY + 5;
    }

    function renderBullet(bulletText, bottomPad = 2.5) {
        const indent = 12;
        const bulletY = doc.y;
        doc.font('Times-Roman').fontSize(8.8).fillColor(primaryColor).text('•', left + 3, bulletY, { width: indent });
        doc.font('Times-Roman').fontSize(8.8).fillColor(textColor).text(bulletText, left + indent, bulletY, {
            width: contentWidth - indent,
            lineGap: 1.6
        });
        doc.y += bottomPad;
    }

    // =========================================================================
    // 1. HEADER (Spacious & Authoritative)
    // =========================================================================
    doc.font('Times-Bold')
       .fontSize(19)
       .fillColor(primaryColor)
       .text('Hrishikesh S Shetty', left, doc.y, { align: 'center', characterSpacing: 0.3 });

    doc.y += 3;
    doc.font('Times-Roman')
       .fontSize(8.9)
       .fillColor(mutedColor)
       .text('+91-8217482716   |   hrishikeshshetty9o@gmail.com   |   Bangalore, India', { align: 'center' });

    doc.y += 2.5;

    // Links line
    const linksY = doc.y;
    const links = [
        { label: 'Portfolio Website', url: 'https://resume-hrishi9os-projects.vercel.app' },
        { label: 'LinkedIn: hrishikesh-shetty-86779o', url: 'https://www.linkedin.com/in/hrishikesh-shetty-86779o/' },
        { label: 'GitHub: Hrishi9o', url: 'https://github.com/Hrishi9o' }
    ];

    const sep = '   |   ';
    doc.font('Times-Roman').fontSize(8.9);
    const linkWidths = links.map(l => doc.widthOfString(l.label));
    const sepWidth = doc.widthOfString(sep);
    const totalLinksWidth = linkWidths.reduce((a, b) => a + b, 0) + sepWidth * (links.length - 1);
    let curX = (doc.page.width - totalLinksWidth) / 2;

    for (let i = 0; i < links.length; i++) {
        doc.font('Times-Roman').fontSize(8.9).fillColor(linkColor)
           .text(links[i].label, curX, linksY, { link: links[i].url, underline: false });
        curX += linkWidths[i];
        if (i < links.length - 1) {
            doc.font('Times-Roman').fontSize(8.9).fillColor(mutedColor)
               .text(sep, curX, linksY);
            curX += sepWidth;
        }
    }

    doc.y = linksY + 11;

    // =========================================================================
    // 2. PROFESSIONAL SUMMARY
    // =========================================================================
    addSectionHeader('Professional Summary');
    doc.font('Times-Roman')
       .fontSize(8.9)
       .fillColor(textColor)
       .text(
           'Information Science Engineering undergraduate (9.53 CGPA) at Ramaiah Institute of Technology with a strong foundation in software development, system architecture, and full-stack engineering. Experienced in architecting high-impact web platforms with Next.js 14 and React, enterprise systems with Java, PostgreSQL, and JDBC, and secure payment integrations with Razorpay. Passionate about resilient systems and clean, scalable code.',
           left, doc.y, { align: 'justify', lineGap: 1.8, width: contentWidth }
       );

    // =========================================================================
    // 3. EXPERIENCE
    // =========================================================================
    addSectionHeader('Experience');
    const expY = doc.y;
    doc.font('Times-Bold').fontSize(9.3).fillColor(primaryColor).text('Hewlett Packard Enterprise (HPE)', left, expY, { width: contentWidth - 120 });
    doc.font('Times-Roman').fontSize(9).fillColor(primaryColor).text('July 2026 – Present', right - 110, expY, { width: 110, align: 'right' });

    const expSubY = doc.y + 1;
    doc.font('Times-Italic').fontSize(8.9).fillColor(secondaryColor).text('Career Preview Program (CPP2) Intern', left, expSubY, { width: contentWidth - 120 });
    doc.font('Times-Roman').fontSize(8.9).fillColor(mutedColor).text('Bangalore, India', right - 110, expSubY, { width: 110, align: 'right' });
    doc.y = expSubY + 12;

    renderBullet('Participating in the Career Preview Program, gaining hands-on exposure to enterprise software development lifecycles and HPE’s edge-to-cloud architecture.');
    renderBullet('Shadowing senior engineering teams in an Agile environment to assist in designing, testing, and debugging scalable software solutions, aiming to improve system efficiency by 15%.');
    renderBullet('Engaging in technical workshops and cross-functional collaboration to bridge academic concepts with enterprise software production standards.');

    // =========================================================================
    // 4. EDUCATION
    // =========================================================================
    addSectionHeader('Education');

    function renderEduItem(leftText, dateText, rightSubText = '') {
        const y = doc.y;
        doc.font('Times-Bold').fontSize(9.1).fillColor(primaryColor).text(leftText.split('|')[0], left, y, { continued: true });
        if (leftText.includes('|')) {
            doc.font('Times-Roman').fontSize(8.9).fillColor(textColor).text(' | ' + leftText.split('|')[1].trim(), { continued: false });
        }
        doc.font('Times-Roman').fontSize(8.9).fillColor(primaryColor).text(dateText, right - 85, y, { width: 85, align: 'right' });
        doc.y = y + 12.5;
    }

    renderEduItem('Ramaiah Institute of Technology | B.E. Information Science (GPA: 9.53/10.0)', '2024 – 2028');
    renderEduItem('Jnana Sudha PU College | Pre-University (Class XII - PCMB) (Aggregate: 97.83%)', '2022 – 2024');
    renderEduItem('Don Bosco English Medium School | Secondary (Class X) (Aggregate: 90.8%)', '2022');

    // =========================================================================
    // 5. TECHNICAL SKILLS
    // =========================================================================
    addSectionHeader('Technical Skills');

    function renderSkillRow(label, skillsList) {
        const y = doc.y;
        const indent = 12;
        doc.font('Times-Roman').fontSize(8.8).fillColor(primaryColor).text('•', left + 3, y, { width: indent });
        doc.font('Times-Bold').fontSize(8.9).fillColor(primaryColor).text(label + ': ', left + indent, y, { continued: true });
        doc.font('Times-Roman').fontSize(8.9).fillColor(textColor).text(skillsList, { continued: false });
        doc.y = y + 12.5;
    }

    renderSkillRow('Languages', 'Java, C, C++, JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3');
    renderSkillRow('Databases & Systems', 'PostgreSQL (15-Table 3NF), MongoDB Atlas, MySQL, Relational Database Design');
    renderSkillRow('Frameworks & Tools', 'Next.js 14, React.js 18, Node.js, Express.js, Java Swing, JDBC, Tailwind CSS, Git, GitHub');
    renderSkillRow('CS Fundamentals', 'Data Structures & Algorithms, DBMS, Object-Oriented Programming, Multithreading');

    // =========================================================================
    // 6. PROJECTS
    // =========================================================================
    addSectionHeader('Projects');

    function renderProjectHeader(title, techStack, links) {
        const y = doc.y;
        doc.font('Times-Bold').fontSize(9.3).fillColor(primaryColor).text(title, left, y, { continued: true });
        doc.font('Times-Italic').fontSize(8.9).fillColor(mutedColor).text(' | ' + techStack, { continued: false });

        if (links && links.length > 0) {
            let linkStr = links.map(l => l.label).join(' | ');
            doc.font('Times-Roman').fontSize(8.8).fillColor(linkColor).text(linkStr, right - 100, y, { width: 100, align: 'right' });
        }
        doc.y = y + 12;
    }

    // 1. Get-Me-Chai
    renderProjectHeader(
        'Get-Me-Chai',
        'Next.js 14, React 18, Razorpay API, MongoDB Atlas, NextAuth, Tailwind CSS',
        [{ label: 'Live App', url: 'https://get-me-chai-tawny-five.vercel.app/' }, { label: 'GitHub', url: 'https://github.com/Hrishi9o/Get-Me-Chai' }]
    );
    renderBullet('Architected a full-stack creator patronage platform enabling supporters to fund creators via secure Razorpay payment gateway integration with server-side HMAC-SHA256 signature verification.');
    renderBullet('Implemented NextAuth.js OAuth 2.0 authentication, dynamic creator profile dashboards, and high-throughput MongoDB Atlas schemas for real-time transaction ledgers and patron message feeds.');

    doc.y += 2;

    // 2. SurakshaSetu
    renderProjectHeader(
        'SurakshaSetu',
        'Java, PostgreSQL, JDBC, Swing, Multithreading',
        []
    );
    renderBullet('Designed an academic digital identity and trust management platform for gig workers utilizing a 15-table normalized PostgreSQL database with foreign keys maintaining data integrity.');
    renderBullet('Implemented a multi-factor rating algorithm to compute worker trust scores based on client feedback, job completion rates, and transaction history with audit logs.');
    renderBullet('Developed a Java Swing desktop interface with JDBC and PreparedStatements for secure CRUD operations, worker profile management, and role-based access control.');

    doc.y += 2;

    // 3. Spotify Clone
    renderProjectHeader(
        'Spotify Clone',
        'JavaScript (ES6+), HTML5 Audio, Web Audio API, Tailwind CSS',
        [{ label: 'Live Demo', url: 'https://spotify-pi-six-14.vercel.app/' }]
    );
    renderBullet('Built a responsive music streaming interface implementing custom logic for real-time audio controls, seekbar scrubbing, volume modulation, dynamic playlists, and mobile dark mode.');
    renderBullet('Delivered a responsive design optimized for performance and cross-browser compatibility, achieving 95+ scores on web accessibility audits.');

    // =========================================================================
    // 7. ACHIEVEMENTS & PARTICIPATION
    // =========================================================================
    addSectionHeader('Achievements & Participation');

    const ach1Y = doc.y;
    doc.font('Times-Bold').fontSize(9.1).fillColor(primaryColor).text('Participant | Google x DeepStation x MSRIT Hackathon', left, ach1Y);
    doc.font('Times-Roman').fontSize(8.9).fillColor(primaryColor).text('May 2026', right - 65, ach1Y, { width: 65, align: 'right' });
    doc.y = ach1Y + 11.5;
    renderBullet('Participated in a hackathon organized by the Dept. of CSE (AI&ML / Cyber Security) at Ramaiah Institute of Technology; completed intensive technical workshop on emerging developer tools.', 2);

    const ach2Y = doc.y;
    doc.font('Times-Bold').fontSize(9.1).fillColor(primaryColor).text('Finalist | BLACKBOX AI: Trick The System | RIT TechFest', left, ach2Y);
    doc.font('Times-Roman').fontSize(8.9).fillColor(primaryColor).text('2026', right - 65, ach2Y, { width: 65, align: 'right' });
    doc.y = ach2Y + 11.5;
    renderBullet('Selected as a finalist among 50+ participants in a technical competition focused on testing and identifying vulnerabilities in AI logic systems.', 2);

    const ach3Y = doc.y;
    doc.font('Times-Bold').fontSize(9.1).fillColor(primaryColor).text('Top Academic Performer (9.53 CGPA) | Ramaiah Institute of Technology', left, ach3Y);
    doc.font('Times-Roman').fontSize(8.9).fillColor(primaryColor).text('2024 – Present', right - 75, ach3Y, { width: 75, align: 'right' });
    doc.y = ach3Y + 11.5;
    renderBullet('Maintained highest percentile academic standing across the Information Science & Engineering cohort at RIT.', 0);

    const pageCount = doc.bufferedPageRange().count;
    if (pageCount !== 1) {
        throw new Error(`CRITICAL ERROR: Resume must be exactly 1 page! Current page count: ${pageCount}`);
    }
    console.log(`Verified: Resume is strictly ${pageCount} page. Final Y: ${doc.y.toFixed(1)} / ${doc.page.height}`);
    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(true));
        stream.on('error', reject);
    });
}

const targetPath = path.join(__dirname, 'Hrishi.pdf');
generateResumePDF(targetPath)
    .then(() => {
        console.log('Successfully re-generated Hrishi.pdf at:', targetPath);
    })
    .catch(err => {
        console.error('Error generating PDF:', err);
    });
