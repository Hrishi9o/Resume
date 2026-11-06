const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateResumePDF(outputPath) {
    // Standard A4 dimensions in points: 595.28 x 841.89
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 30, bottom: 28, left: 36, right: 36 },
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
        doc.moveDown(0.42);
        const y = doc.y;
        doc.font('Helvetica-Bold')
           .fontSize(10)
           .fillColor(primaryColor)
           .text(title.toUpperCase(), left, y, { characterSpacing: 1.2 });
        
        const lineY = doc.y + 2;
        doc.moveTo(left, lineY)
           .lineTo(right, lineY)
           .strokeColor(lineColor)
           .lineWidth(0.75)
           .stroke();
        doc.y = lineY + 3.5;
    }

    // --- HEADER ---
    doc.font('Helvetica-Bold')
       .fontSize(19)
       .fillColor(primaryColor)
       .text('HRISHIKESH S SHETTY', left, doc.y, { align: 'center', characterSpacing: 0.6 });

    doc.moveDown(0.18);
    doc.font('Helvetica')
       .fontSize(8.5)
       .fillColor(mutedColor)
       .text('Bangalore, India   •   +91-82174 82716   •   hrishikeshshetty9o@gmail.com', { align: 'center' });

    doc.moveDown(0.12);

    // Clickable links line
    const linksY = doc.y;
    const links = [
        { label: 'Portfolio Website', url: 'https://resume-hrishi9os-projects.vercel.app' },
        { label: 'GitHub: Hrishi9o', url: 'https://github.com/Hrishi9o' },
        { label: 'LinkedIn: hrishikesh-shetty-86779o', url: 'https://www.linkedin.com/in/hrishikesh-shetty-86779o/' }
    ];

    const sep = '   •   ';
    doc.font('Helvetica-Bold').fontSize(8.5);
    const linkWidths = links.map(l => doc.widthOfString(l.label));
    const sepWidth = doc.font('Helvetica').fontSize(8.5).widthOfString(sep);
    const totalLinksWidth = linkWidths.reduce((a, b) => a + b, 0) + sepWidth * (links.length - 1);
    let curX = (doc.page.width - totalLinksWidth) / 2;

    for (let i = 0; i < links.length; i++) {
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor(linkColor)
           .text(links[i].label, curX, linksY, { link: links[i].url, underline: false });
        curX += linkWidths[i];
        if (i < links.length - 1) {
            doc.font('Helvetica').fontSize(8.5).fillColor(mutedColor)
               .text(sep, curX, linksY);
            curX += sepWidth;
        }
    }

    doc.y = linksY + 12;

    // --- PROFESSIONAL SUMMARY ---
    addSectionHeader('Professional Summary');
    doc.font('Helvetica')
       .fontSize(8.3)
       .fillColor(textColor)
       .text(
           'High-performing Information Science Engineering undergraduate (9.65 CGPA) at Ramaiah Institute of Technology with proven hands-on experience architecting full-stack web platforms using Next.js 14, React, Node.js, and MongoDB, alongside production offline-first mobile applications with Flutter. Strong background in Razorpay fintech integrations, HMAC cryptographic validations, NoSQL/SQL modeling, and high-fidelity UI/UX design.',
           left, doc.y, { align: 'justify', lineGap: 1.5, width: contentWidth }
       );

    // --- EDUCATION ---
    addSectionHeader('Education');

    function renderEduItem(institution, degree, location, dates, score) {
        const y = doc.y;
        doc.font('Helvetica-Bold').fontSize(8.8).fillColor(primaryColor).text(institution, left, y, { width: contentWidth - 100 });
        doc.font('Helvetica').fontSize(8.3).fillColor(mutedColor).text(dates, right - 95, y, { width: 95, align: 'right' });

        const subY = doc.y + 1;
        doc.font('Helvetica-Oblique').fontSize(8.2).fillColor(textColor)
           .text(degree + (score ? `  —  ${score}` : ''), left, subY, { width: contentWidth - 100 });
        doc.font('Helvetica').fontSize(8.2).fillColor(mutedColor).text(location, right - 95, subY, { width: 95, align: 'right' });
        doc.y = subY + 11;
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
        doc.font('Helvetica-Bold').fontSize(8.3).fillColor(primaryColor).text(label + ': ', left, y, { continued: true });
        doc.font('Helvetica').fontSize(8.3).fillColor(textColor).text(skillsList, { continued: false });
        doc.y = y + 10.5;
    }

    renderSkillRow('Languages', 'JavaScript (ES6+), Dart, TypeScript, Java, C, C++, SQL, HTML5, CSS3');
    renderSkillRow('Frameworks & UI', 'Next.js 14, React.js, Node.js, Flutter, Tailwind CSS, IndexedDB, Web Audio API');
    renderSkillRow('Databases & Cloud', 'MongoDB (Atlas & Mongoose), Firebase RTDB, Hive (NoSQL), MySQL, Vercel');
    renderSkillRow('Tools & APIs', 'Razorpay API, NextAuth.js, Git, GitHub, VS Code, Android Studio, Postman, PWA');
    renderSkillRow('CS Fundamentals', 'Data Structures & Algorithms (DSA), OOP, DBMS, RESTful APIs, Secure Web Auth');

    // --- FEATURED PROJECTS ---
    addSectionHeader('Featured Projects');

    function renderProjectHeader(title, techStack, links) {
        const y = doc.y;
        doc.font('Helvetica-Bold').fontSize(8.8).fillColor(primaryColor).text(title, left, y, { width: contentWidth - 130 });

        // Render Action links on the right
        if (links && links.length > 0) {
            let linkStr = '';
            links.forEach((l, idx) => {
                linkStr += (idx > 0 ? '  |  ' : '') + l.label;
            });
            doc.font('Helvetica-Bold').fontSize(8).fillColor(linkColor).text(linkStr, right - 130, y, { width: 130, align: 'right' });
        }

        // Subline with tech stack
        const subY = y + 10.5;
        doc.font('Helvetica-Oblique').fontSize(8).fillColor(headerBlue).text(techStack, left, subY, { width: contentWidth });
        doc.y = subY + 10;
    }

    function renderBullet(bulletText) {
        const indent = 11;
        const bulletY = doc.y;
        doc.font('Helvetica').fontSize(8.2).fillColor(primaryColor).text('•', left + 2, bulletY, { width: indent });
        doc.font('Helvetica').fontSize(8.1).fillColor(textColor).text(bulletText, left + indent, bulletY, {
            width: contentWidth - indent,
            lineGap: 1.2
        });
        doc.y = doc.y + 1.5;
    }

    // 1. Get-Me-Chai (FLAGSHIP FOCUS #1)
    renderProjectHeader(
        'Get-Me-Chai — Creator Crowdfunding & Patronage Web Platform',
        'Next.js 14, React 18, Razorpay API, MongoDB Atlas, Mongoose, NextAuth, Tailwind CSS',
        [{ label: 'Live App', url: 'https://get-me-chai-tawny-five.vercel.app/' }, { label: 'GitHub', url: 'https://github.com/Hrishi9o/Get-Me-Chai' }]
    );
    renderBullet('Architected a full-stack creator patronage platform enabling fans to support creators via secure Razorpay payment gateway integration with server-side HMAC-SHA256 signature verification and webhooks.');
    renderBullet('Integrated NextAuth.js for OAuth 2.0 authentication, dynamic creator profile dashboards, and responsive glassmorphic UI using Tailwind CSS with celebratory particle physics animations.');
    renderBullet('Engineered high-throughput MongoDB Atlas schemas with Mongoose models for instant transaction ledgers, real-time patron comments, and creator revenue aggregation pipelines.');

    // 2. Aquajaal POS
    doc.y += 2;
    renderProjectHeader(
        'Aquajaal POS — Drinking Water Distribution & Billing System',
        'Flutter, Dart, Hive (NoSQL), Firebase RTDB, IndexedDB, PWA, Android APK',
        [{ label: 'Web Demo', url: 'https://aquajaal-hrishi9os-projects.vercel.app' }, { label: 'GitHub', url: 'https://github.com/Hrishi9o/Aquajaal' }]
    );
    renderBullet('Engineered a production offline-first Point of Sale (POS) and inventory tracker for Yashodhar Enterprises (packaged drinking water distributor) supporting desktop web, PWA, and release Android APK.');
    renderBullet('Architected bidirectional cloud synchronization with Firebase RTDB across multiple counter terminals while preserving 100% offline persistence using local binary Hive NoSQL storage.');
    renderBullet('Implemented Indian GST tax invoices (YE-YYYY-MMDD-XXXX), price immutability, automated currency amount-in-words conversion, and UTF-8 BOM CSV/PDF analytics with 15+ automated tests.');

    // 3. Task Buddy
    doc.y += 2;
    renderProjectHeader(
        'Task Buddy — Cross-Platform Productivity & Gamification Suite',
        'Flutter, Dart, Shared Preferences, Clean Architecture, Material 3',
        [{ label: 'GitHub', url: 'https://github.com/Hrishi9o/Todo_List' }]
    );
    renderBullet('Created a cross-platform mobile task productivity suite featuring dynamic category sorting, priority filters, local database persistence, secure OTP authentication, and dynamic theme switching.');
    renderBullet('Engineered gamification mechanics with interactive mini-games to boost daily user engagement and task completion rates.');

    // 4. Spotify Clone & Twitter Clone
    doc.y += 2;
    renderProjectHeader(
        'Spotify Web Clone & X (Twitter) Clone — Interactive Web Applications',
        'JavaScript (ES6+), Tailwind CSS, HTML5, Web Audio API, Responsive Design',
        [{ label: 'Spotify Demo', url: 'https://spotify-pi-six-14.vercel.app/' }, { label: 'Twitter Demo', url: 'https://twitter-red.vercel.app/' }]
    );
    renderBullet('Constructed a responsive Spotify web player with real-time audio playback, seekbar scrubbing, volume modulation, song queue navigation, and mobile-first dark mode styling.');
    renderBullet('Recreated Twitter/X platform UI with utility-first Tailwind CSS, featuring fluid responsive sidebars, tweet layouts, and trending widgets.');

    // --- ACHIEVEMENTS & MILESTONES ---
    addSectionHeader('Achievements & Milestones');
    renderBullet('Finalist — BLACKBOX AI: Trick The System at RIT TechFest 2026 for engineering intelligent workflow automation.');
    renderBullet('Top Academic Performer (9.65 CGPA) — Maintained top ranking within the Information Science Engineering cohort at RIT.');
    renderBullet('State Distinction (97.3%) — Pre-University Examination (Class XII) with top percentiles in PCMB coursework.');

    // --- EXTRACURRICULAR & INTERESTS ---
    addSectionHeader('Extracurricular Activities & Interests');
    renderBullet('Leadership & Activities: Active participant in coding hackathons; School Marching Band Vocalist & live performer.');
    renderBullet('Languages: English (Professional Working Proficiency), Hindi, Kannada, Tulu (Native).');
    renderBullet('Interests: Full-Stack Web Architecture, Payment Systems, Offline-First Mobile Engineering, UI/UX Interaction Design.');

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(true));
        stream.on('error', reject);
    });
}

const targetPath = path.join(__dirname, 'Hrishi.pdf');
generateResumePDF(targetPath)
    .then(() => {
        console.log('Successfully re-generated Hrishi.pdf with Get-Me-Chai as flagship focus at:', targetPath);
    })
    .catch(err => {
        console.error('Error generating PDF:', err);
    });
