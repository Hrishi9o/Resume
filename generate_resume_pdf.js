const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateResumePDF(outputPath) {
    // Standard A4 dimensions in points: 595.28 x 841.89
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 28, bottom: 26, left: 36, right: 36 },
        autoFirstPage: true,
        bufferPages: true
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const primaryColor = '#0F172A'; // Slate 900
    const headerBlue = '#0369A1';   // Deep Sky 700
    const textColor = '#1E293B';    // Slate 800
    const mutedColor = '#475569';   // Slate 600
    const linkColor = '#0284C7';    // Sky 600
    const lineColor = '#CBD5E1';    // Slate 300

    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;
    const contentWidth = right - left;

    function addSectionHeader(title) {
        doc.moveDown(0.38);
        const y = doc.y;
        doc.font('Helvetica-Bold')
           .fontSize(9.5)
           .fillColor(primaryColor)
           .text(title.toUpperCase(), left, y, { characterSpacing: 1.1 });
        
        const lineY = doc.y + 2;
        doc.moveTo(left, lineY)
           .lineTo(right, lineY)
           .strokeColor(lineColor)
           .lineWidth(0.75)
           .stroke();
        doc.y = lineY + 3;
    }

    // --- HEADER ---
    doc.font('Helvetica-Bold')
       .fontSize(18)
       .fillColor(primaryColor)
       .text('HRISHIKESH S SHETTY', left, doc.y, { align: 'center', characterSpacing: 0.5 });

    doc.moveDown(0.16);
    doc.font('Helvetica')
       .fontSize(8.3)
       .fillColor(mutedColor)
       .text('Bangalore, India   •   +91-82174 82716   •   hrishikeshshetty9o@gmail.com', { align: 'center' });

    doc.moveDown(0.1);

    // Clickable links line
    const linksY = doc.y;
    const links = [
        { label: 'Portfolio Website', url: 'https://resume-hrishi9os-projects.vercel.app' },
        { label: 'GitHub: Hrishi9o', url: 'https://github.com/Hrishi9o' },
        { label: 'LinkedIn: hrishikesh-shetty-86779o', url: 'https://www.linkedin.com/in/hrishikesh-shetty-86779o/' }
    ];

    const sep = '   •   ';
    doc.font('Helvetica-Bold').fontSize(8.3);
    const linkWidths = links.map(l => doc.widthOfString(l.label));
    const sepWidth = doc.font('Helvetica').fontSize(8.3).widthOfString(sep);
    const totalLinksWidth = linkWidths.reduce((a, b) => a + b, 0) + sepWidth * (links.length - 1);
    let curX = (doc.page.width - totalLinksWidth) / 2;

    for (let i = 0; i < links.length; i++) {
        doc.font('Helvetica-Bold').fontSize(8.3).fillColor(linkColor)
           .text(links[i].label, curX, linksY, { link: links[i].url, underline: false });
        curX += linkWidths[i];
        if (i < links.length - 1) {
            doc.font('Helvetica').fontSize(8.3).fillColor(mutedColor)
               .text(sep, curX, linksY);
            curX += sepWidth;
        }
    }

    doc.y = linksY + 11;

    // --- PROFESSIONAL SUMMARY ---
    addSectionHeader('Professional Summary');
    doc.font('Helvetica')
       .fontSize(8.2)
       .fillColor(textColor)
       .text(
           'Information Science Engineering undergraduate (9.65 CGPA) at Ramaiah Institute of Technology with proven expertise in architecting full-stack web platforms using Next.js 14, React, Node.js, and enterprise systems with Java, PostgreSQL, and JDBC. Experienced in Razorpay fintech payment workflows, normalized relational database schemas, multi-threaded application design, and secure OAuth architectures.',
           left, doc.y, { align: 'justify', lineGap: 1.4, width: contentWidth }
       );

    // --- EXPERIENCE ---
    addSectionHeader('Experience');
    const expY = doc.y;
    doc.font('Helvetica-Bold').fontSize(8.8).fillColor(primaryColor).text('Hewlett Packard Enterprise (HPE)', left, expY, { width: contentWidth - 120 });
    doc.font('Helvetica').fontSize(8.2).fillColor(mutedColor).text('July 2026 – Present', right - 110, expY, { width: 110, align: 'right' });

    const expSubY = doc.y + 1;
    doc.font('Helvetica-Oblique').fontSize(8.2).fillColor(textColor).text('Career Preview Program (CPP2) Intern', left, expSubY, { width: contentWidth - 120 });
    doc.font('Helvetica').fontSize(8.2).fillColor(mutedColor).text('Bangalore, India', right - 110, expSubY, { width: 110, align: 'right' });
    doc.y = expSubY + 10;

    function renderBullet(bulletText) {
        const indent = 11;
        const bulletY = doc.y;
        doc.font('Helvetica').fontSize(8).fillColor(primaryColor).text('•', left + 2, bulletY, { width: indent });
        doc.font('Helvetica').fontSize(8).fillColor(textColor).text(bulletText, left + indent, bulletY, {
            width: contentWidth - indent,
            lineGap: 1.2
        });
        doc.y = doc.y + 1.2;
    }

    renderBullet('Participating in the Career Preview Program, gaining hands-on exposure to enterprise software development lifecycles and HPE’s edge-to-cloud architecture.');
    renderBullet('Shadowing senior engineering teams in an Agile environment to assist in designing, testing, and debugging scalable software solutions, aiming to improve system efficiency by 15%.');

    // --- EDUCATION ---
    addSectionHeader('Education');

    function renderEduItem(institution, degree, location, dates, score) {
        const y = doc.y;
        doc.font('Helvetica-Bold').fontSize(8.6).fillColor(primaryColor).text(institution, left, y, { width: contentWidth - 100 });
        doc.font('Helvetica').fontSize(8.2).fillColor(mutedColor).text(dates, right - 95, y, { width: 95, align: 'right' });

        const subY = doc.y + 1;
        doc.font('Helvetica-Oblique').fontSize(8.1).fillColor(textColor)
           .text(degree + (score ? `  —  ${score}` : ''), left, subY, { width: contentWidth - 100 });
        doc.font('Helvetica').fontSize(8.1).fillColor(mutedColor).text(location, right - 95, subY, { width: 95, align: 'right' });
        doc.y = subY + 10;
    }

    renderEduItem(
        'Ramaiah Institute of Technology',
        'Bachelor of Engineering in Information Science & Engineering',
        'Bangalore, India',
        '2024 – 2028',
        'CGPA: 9.65 / 10.0 (Top Performer in ISE)'
    );

    renderEduItem(
        'Jnana Sudha PU College',
        'Pre-University Education (Class XII - PCMB)',
        'Karnataka, India',
        '2022 – 2024',
        'Aggregate: 97.3%'
    );

    // --- TECHNICAL SKILLS ---
    addSectionHeader('Technical Skills');

    function renderSkillRow(label, skillsList) {
        const y = doc.y;
        doc.font('Helvetica-Bold').fontSize(8.2).fillColor(primaryColor).text(label + ': ', left, y, { continued: true });
        doc.font('Helvetica').fontSize(8.2).fillColor(textColor).text(skillsList, { continued: false });
        doc.y = y + 10;
    }

    renderSkillRow('Languages', 'Java, C, C++, JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3');
    renderSkillRow('Frameworks & UI', 'Next.js 14, React.js 18, Node.js, Express.js, Java Swing, JDBC, Tailwind CSS, Web Audio API');
    renderSkillRow('Databases & Systems', 'PostgreSQL (Relational Design), MongoDB (Atlas & Mongoose), MySQL, Firebase RTDB');
    renderSkillRow('Tools & Security', 'Git, GitHub, VS Code, Razorpay API, NextAuth.js (OAuth 2.0), Postman, Rolling-Hash Security');
    renderSkillRow('CS Fundamentals', 'Data Structures & Algorithms (DSA), Relational DBMS, Concurrency & Multithreading, OOP');

    // --- FEATURED PROJECTS ---
    addSectionHeader('Featured Projects');

    function renderProjectHeader(title, techStack, links) {
        const y = doc.y;
        doc.font('Helvetica-Bold').fontSize(8.6).fillColor(primaryColor).text(title, left, y, { width: contentWidth - 130 });

        if (links && links.length > 0) {
            let linkStr = '';
            links.forEach((l, idx) => {
                linkStr += (idx > 0 ? '  |  ' : '') + l.label;
            });
            doc.font('Helvetica-Bold').fontSize(7.8).fillColor(linkColor).text(linkStr, right - 130, y, { width: 130, align: 'right' });
        }

        const subY = y + 10;
        doc.font('Helvetica-Oblique').fontSize(7.9).fillColor(headerBlue).text(techStack, left, subY, { width: contentWidth });
        doc.y = subY + 9.5;
    }

    // 1. Get-Me-Chai
    renderProjectHeader(
        'Get-Me-Chai — Creator Crowdfunding & Patronage Platform',
        'Next.js 14, React 18, Razorpay API, MongoDB Atlas, Mongoose, NextAuth, Tailwind CSS',
        [{ label: 'Live App', url: 'https://get-me-chai-tawny-five.vercel.app/' }, { label: 'GitHub', url: 'https://github.com/Hrishi9o/Get-Me-Chai' }]
    );
    renderBullet('Architected a full-stack creator patronage platform enabling supporters to fund creators via secure Razorpay payment gateway integration with server-side HMAC-SHA256 signature verification and webhooks.');
    renderBullet('Integrated NextAuth.js for OAuth 2.0 authentication, dynamic creator profile dashboards, and responsive glassmorphic UI using Tailwind CSS with celebratory particle physics animations.');
    renderBullet('Engineered high-throughput MongoDB Atlas schemas with Mongoose models for instant transaction ledgers, real-time patron comments, and creator revenue aggregation pipelines.');

    // 2. SurakshaSetu
    doc.y += 2;
    renderProjectHeader(
        'SurakshaSetu — Digital Identity & Trust Management System',
        'Java, PostgreSQL, JDBC, Swing, Multithreading, Relational Architecture',
        []
    );
    renderBullet('Architected a digital identity and trust management platform for gig economy workers utilizing a 15-table normalized PostgreSQL database, maintaining 100% data integrity across concurrent transactions.');
    renderBullet('Implemented a custom mathematical trust score algorithm factoring consistency, ratings, and income, persisting score changes via atomic database transactions and comprehensive audit trails.');
    renderBullet('Developed a multi-threaded GUI application featuring role-based access control (RBAC) and custom rolling-hash security without external libraries, minimizing application dependency overhead.');

    // 3. Spotify Clone & Twitter Clone
    doc.y += 2;
    renderProjectHeader(
        'Spotify Web Clone & X (Twitter) Clone — Interactive Web Applications',
        'JavaScript (ES6+), HTML5 Audio, Web Audio API, Tailwind CSS, Responsive Design',
        [{ label: 'Spotify Demo', url: 'https://spotify-pi-six-14.vercel.app/' }, { label: 'Twitter Demo', url: 'https://twitter-red.vercel.app/' }]
    );
    renderBullet('Constructed a responsive Spotify web player with real-time audio playback, seekbar scrubbing, volume modulation, song queue navigation, and mobile-first dark mode styling.');
    renderBullet('Recreated Twitter/X platform UI with utility-first Tailwind CSS, featuring fluid responsive sidebars, tweet layouts, and trending widgets.');

    // --- ACHIEVEMENTS & PARTICIPATION ---
    addSectionHeader('Achievements & Technical Participation');
    renderBullet('Participant — Google x DeepStation x MSRIT Hackathon (May 2026): Participated in hackathon organized by Dept. of CSE (AI&ML / Cyber Security); completed intensive technical workshop exploring emerging tools.');
    renderBullet('Finalist — BLACKBOX AI: Trick The System at RIT TechFest 2026: Selected as finalist among 50+ participants in a competition focused on testing and identifying vulnerabilities in AI logic systems.');
    renderBullet('Top Academic Performer (9.65 CGPA) — Maintained highest percentile ranking within the Information Science Engineering cohort at RIT.');

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(true));
        stream.on('error', reject);
    });
}

const targetPath = path.join(__dirname, 'Hrishi.pdf');
generateResumePDF(targetPath)
    .then(() => {
        console.log('Successfully re-generated Hrishi.pdf with HPE, Get-Me-Chai, and SurakshaSetu at:', targetPath);
    })
    .catch(err => {
        console.error('Error generating PDF:', err);
    });
