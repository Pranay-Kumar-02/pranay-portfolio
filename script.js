/**
 * PRANAY KUMAR VONAMALA — PLATFORM INTERACTION & INTELLIGENCE ENGINE
 * Features:
 * - Smart Hide-on-Scroll Glass Navigation Header
 * - Editorial Portrait Frame 1.5° 3D Mouse Tilt Engine (0.06 Exponential Lerp)
 * - 60 FPS GPU Scroll Parallax & IntersectionObserver Scroll Reveals
 * - High-Speed Recruiter Mode Toggle Switch
 * - Interactive Skill Pill Inspection Modal Engine
 * - Raycast / Linear-Grade Command Palette Engine (Smart Search Tagging, Keyboard Navigation)
 * - Interactive Developer Terminal Console Command Processor
 * - Conversational AI Portfolio Assistant (First-Person Authentic Persona, Zero Hallucinations)
 * - Interactive Case Study Modal Drawer Controllers
 */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const navHeader = document.getElementById('navHeader');
  const heroSection = document.getElementById('hero');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll Tracking
  let lastScrollY = 0;
  let currentScrollY = 0;
  const scrollThreshold = 80;

  // 1.5° Mouse Tilt State
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  /**
   * 1. Smart Navbar Scroll Controller
   */
  function handleNavbarScroll() {
    if (!navHeader) return;

    if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY) {
      navHeader.classList.add('nav-hidden');
    } else {
      navHeader.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  }

  /**
   * 2. Editorial Portrait 1.5° Mouse Tilt Handler
   */
  function onMouseMove(e) {
    if (prefersReducedMotion || document.body.classList.contains('recruiter-mode')) return;

    const windowWidth = window.innerWidth || 1920;
    const windowHeight = window.innerHeight || 1080;

    const normalizedX = (e.clientX / windowWidth) - 0.5;
    const normalizedY = (e.clientY / windowHeight) - 0.5;

    targetTiltX = -normalizedY * 3.0;
    targetTiltY = normalizedX * 3.0;
  }

  /**
   * 3. Main 60 FPS Rendering Loop
   */
  function renderFrame() {
    currentScrollY = window.scrollY || window.pageYOffset;

    handleNavbarScroll();

    if (heroSection && !prefersReducedMotion && !document.body.classList.contains('recruiter-mode')) {
      const heroHeight = heroSection.offsetHeight;

      if (currentScrollY <= heroHeight * 1.2) {
        currentTiltX += (targetTiltX - currentTiltX) * 0.06;
        currentTiltY += (targetTiltY - currentTiltY) * 0.06;

        const bgParallax = currentScrollY * 0.2;
        const fadeProgress = Math.max(0, Math.min(1, currentScrollY / (heroHeight * 0.8)));
        const contentOpacity = (1 - fadeProgress).toFixed(3);

        root.style.setProperty('--tilt-x', `${currentTiltX.toFixed(3)}deg`);
        root.style.setProperty('--tilt-y', `${currentTiltY.toFixed(3)}deg`);
        root.style.setProperty('--parallax-y', `${bgParallax.toFixed(2)}px`);
        root.style.setProperty('--hero-opacity', contentOpacity);
      }
    }

    requestAnimationFrame(renderFrame);
  }

  /**
   * 4. Scroll Observer for Reveal Animations
   */
  function initScrollObserver() {
    if (prefersReducedMotion) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translate3d(0, 0, 0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(
      '.philosophy-card, .skill-domain-card, .growth-item, .product-showcase-card, .cert-card, .education-hero-card, .telemetry-card, .principle-card'
    );
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translate3d(0, 25px, 0)';
      el.style.transition = 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }

  /**
   * 5. Recruiter Mode Toggle Switch
   */
  const recruiterBtn = document.getElementById('recruiterToggle');
  if (recruiterBtn) {
    recruiterBtn.addEventListener('click', () => {
      document.body.classList.toggle('recruiter-mode');
      const isRecruiter = document.body.classList.contains('recruiter-mode');
      recruiterBtn.style.background = isRecruiter ? '#6366f1' : '';
      recruiterBtn.style.color = isRecruiter ? '#ffffff' : '';
    });
  }

  /**
   * 6. Interactive Skill Pill Inspection Modal Engine
   */
  const skillModal = document.getElementById('skillModal');
  const skillTitle = document.getElementById('skillTitle');
  const skillCat = document.getElementById('skillCat');
  const skillDesc = document.getElementById('skillDesc');
  const skillUsage = document.getElementById('skillUsage');
  const skillProjects = document.getElementById('skillProjects');

  window.openSkillModal = function(el) {
    if (!skillModal || !el) return;
    const title = el.getAttribute('data-title') || el.innerText;
    const cat = el.getAttribute('data-cat') || 'ENGINEERING CAPABILITY';
    const desc = el.getAttribute('data-desc') || 'Technical capability utilized across software development.';
    const usage = el.getAttribute('data-usage') || 'Applied in full-stack, AI, or cybersecurity system architectures.';
    const projects = el.getAttribute('data-projects') || 'Flagship Applications';

    skillTitle.innerText = title;
    skillCat.innerText = cat.toUpperCase();
    skillDesc.innerText = desc;
    skillUsage.innerText = usage;
    skillProjects.innerText = projects;

    skillModal.classList.add('modal-open');
    skillModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeSkillModal = function() {
    if (!skillModal) return;
    skillModal.classList.remove('modal-open');
    skillModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /**
   * 7. Raycast / Linear-Grade Command Palette & Smart Search Engine
   */
  const cmdPalette = document.getElementById('cmdPalette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResults = document.getElementById('cmdResults');
  const cmdTrigger = document.getElementById('cmdTrigger');

  let selectedIndex = 0;
  let currentFlatItems = [];

  const cmdItems = [
    // CATEGORY: NAVIGATION
    { category: 'Navigation', icon: '📍', title: 'Overview', desc: 'Hero section, portrait, and platform summary', action: () => scrollToSection('hero'), keywords: ['hero', 'overview', 'pranay', 'top', 'start'] },
    { category: 'Navigation', icon: '📖', title: 'Story & Mindset', desc: 'Personal background, athletics discipline, and mindset', action: () => scrollToSection('story'), keywords: ['story', 'mindset', 'about', 'gym', 'hyderabad', 'background'] },
    { category: 'Navigation', icon: '💡', title: 'Engineering Philosophy', desc: '5 core foundational beliefs guiding software design', action: () => scrollToSection('philosophy'), keywords: ['philosophy', 'principles', 'beliefs', 'simplicity', 'modular'] },
    { category: 'Navigation', icon: '🛠️', title: 'Technical Capabilities', desc: '8-domain engineering capability matrix and skill pills', action: () => scrollToSection('skills'), keywords: ['skills', 'capabilities', 'matrix', 'python', 'react', 'fastapi', 'c++', 'java', 'sql', 'linux', 'security', 'cti'] },
    { category: 'Navigation', icon: '🔬', title: 'Currently Learning & Exploring', desc: 'Hugging Face, Transformers, Agentic AI, LangGraph, Vector DBs', action: () => scrollToSection('learning'), keywords: ['learning', 'exploring', 'huggingface', 'transformers', 'vector', 'fine-tuning', 'langgraph', 'llm'] },
    { category: 'Navigation', icon: '🚀', title: 'Featured Projects', desc: 'Spendly, Sentinel AI, and SupportFlow AI showcases', action: () => scrollToSection('projects'), keywords: ['projects', 'flagship', 'showcase', 'spendly', 'sentinel', 'supportflow'] },
    { category: 'Navigation', icon: '⏳', title: 'Engineering Journey', desc: 'Academic and technical progression timeline', action: () => scrollToSection('journey'), keywords: ['journey', 'timeline', 'progression', 'academics', 'history'] },
    { category: 'Navigation', icon: '📊', title: 'GitHub & LeetCode Telemetry', desc: 'Open-source codebases and algorithm topic roadmap', action: () => scrollToSection('telemetry'), keywords: ['telemetry', 'github', 'leetcode', 'algorithms', 'code', 'repos'] },
    { category: 'Navigation', icon: '🎓', title: 'Education & Certifications', desc: 'VIT Vellore B.Tech CS & InfoSec (CGPA 8.27) and verified certificates', action: () => scrollToSection('education'), keywords: ['education', 'vit', 'vellore', 'cgpa', 'degree', 'certifications', 'ibm', 'deloitte', 'infosys', 'iit'] },
    { category: 'Navigation', icon: '📬', title: 'Contact & Collaboration', desc: 'Email addresses, phone, location, and social links', action: () => scrollToSection('contact'), keywords: ['contact', 'email', 'phone', 'location', 'reach', 'hire'] },

    // CATEGORY: PROJECTS
    { category: 'Projects', icon: '💳', title: 'Spendly — AI Personal Finance Platform', desc: 'React, FastAPI, Firebase, OpenRouter AI financial advisor', action: () => openCaseStudy('spendlyModal'), keywords: ['spendly', 'fintech', 'finance', 'budget', 'react', 'fastapi', 'firebase', 'openrouter'] },
    { category: 'Projects', icon: '🛡️', title: 'Sentinel AI — Cyber Threat Intelligence (CTI)', desc: 'Python, OSINT recon, VirusTotal API, WHOIS, IOC management', action: () => openCaseStudy('sentinelModal'), keywords: ['sentinel', 'cybersecurity', 'security', 'cti', 'threat', 'ioc', 'virustotal', 'whois', 'python', 'fastapi'] },
    { category: 'Projects', icon: '🤖', title: 'SupportFlow AI — Enterprise Agentic AI Platform', desc: 'LangGraph stateful graphs, LangChain, Ollama local LLMs, RAG', action: () => openCaseStudy('supportflowModal'), keywords: ['supportflow', 'agentic', 'agent', 'langgraph', 'langchain', 'ollama', 'local llm', 'rag', 'vector'] },

    // CATEGORY: QUICK ACTIONS
    { category: 'Quick Actions', icon: '📄', title: 'Download Resume (PDF)', desc: 'Official resume document (Pranay_Kumar_Vonamala_Resume.pdf)', action: () => window.open('Pranay_Kumar_Vonamala_Resume.pdf', '_blank'), keywords: ['resume', 'cv', 'pdf', 'download', 'bio'] },
    { category: 'Quick Actions', icon: '📧', title: 'Send Primary Email', desc: 'vonamala.pranay.official@gmail.com', action: () => window.location.href = 'mailto:vonamala.pranay.official@gmail.com', keywords: ['email', 'mail', 'contact', 'reach'] },
    { category: 'Quick Actions', icon: '🐙', title: 'Open GitHub Profile', desc: 'https://github.com/Pranay-Kumar-02', action: () => window.open('https://github.com/Pranay-Kumar-02', '_blank'), keywords: ['github', 'profile', 'git', 'repos'] },
    { category: 'Quick Actions', icon: '💼', title: 'Open LinkedIn Profile', desc: 'https://www.linkedin.com/in/pranay-kumar-vonamala/', action: () => window.open('https://www.linkedin.com/in/pranay-kumar-vonamala/', '_blank'), keywords: ['linkedin', 'profile', 'network', 'connect'] },
    { category: 'Quick Actions', icon: '⚡', title: 'Open LeetCode Profile', desc: 'https://leetcode.com/u/Pranayyy_/', action: () => window.open('https://leetcode.com/u/Pranayyy_/', '_blank'), keywords: ['leetcode', 'profile', 'problems', 'algorithms', 'coding'] }
  ];

  function openCmdPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.add('cmd-open');
    cmdPalette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cmdInput.value = '';
    selectedIndex = 0;
    filterAndRenderCmd('');
    setTimeout(() => cmdInput.focus(), 50);
  }

  window.closeCmdPalette = function() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove('cmd-open');
    cmdPalette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.clearCmdInput = function() {
    if (!cmdInput) return;
    cmdInput.value = '';
    filterAndRenderCmd('');
    cmdInput.focus();
  };

  function filterAndRenderCmd(query) {
    const q = query.trim().toLowerCase();
    
    let filtered = cmdItems;
    if (q) {
      filtered = cmdItems.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const descMatch = item.desc.toLowerCase().includes(q);
        const categoryMatch = item.category.toLowerCase().includes(q);
        const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(q));
        return titleMatch || descMatch || categoryMatch || keywordMatch;
      });
    }

    currentFlatItems = filtered;
    if (selectedIndex >= currentFlatItems.length) selectedIndex = 0;

    renderCategorizedResults(filtered);
  }

  function renderCategorizedResults(items) {
    if (!cmdResults) return;
    cmdResults.innerHTML = '';

    if (items.length === 0) {
      cmdResults.innerHTML = '<div class="cmd-group-title" style="text-align:center; padding: 2rem;">No matching commands or projects found</div>';
      return;
    }

    const categories = ['Navigation', 'Projects', 'Quick Actions'];
    let globalIdx = 0;

    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat);
      if (catItems.length === 0) return;

      const header = document.createElement('div');
      header.className = 'cmd-group-title';
      header.innerText = cat;
      cmdResults.appendChild(header);

      catItems.forEach(item => {
        const itemIdx = globalIdx++;
        const isSelected = itemIdx === selectedIndex;

        const div = document.createElement('div');
        div.className = `cmd-item ${isSelected ? 'selected' : ''}`;
        div.setAttribute('data-idx', itemIdx);
        div.innerHTML = `
          <span class="cmd-item-icon">${item.icon}</span>
          <div class="cmd-item-info">
            <span class="cmd-item-title">${item.title}</span>
            <span class="cmd-item-desc">${item.desc}</span>
          </div>
          <span class="cmd-item-arrow">↵</span>
        `;

        div.onclick = () => {
          item.action();
          closeCmdPalette();
        };

        cmdResults.appendChild(div);
      });
    });

    updateActiveSelectionScroll();
  }

  function updateActiveSelectionScroll() {
    const selectedEl = cmdResults.querySelector(`.cmd-item[data-idx="${selectedIndex}"]`);
    if (selectedEl) {
      const allItems = cmdResults.querySelectorAll('.cmd-item');
      allItems.forEach(el => el.classList.remove('selected'));
      selectedEl.classList.add('selected');
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openCmdPalette);

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      selectedIndex = 0;
      filterAndRenderCmd(e.target.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (currentFlatItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentFlatItems.length;
        updateActiveSelectionScroll();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentFlatItems.length) % currentFlatItems.length;
        updateActiveSelectionScroll();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFlatItems[selectedIndex]) {
          currentFlatItems[selectedIndex].action();
          closeCmdPalette();
        }
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('cmd-open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
  });

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * 8. Developer Terminal Console Command Processor
   */
  const terminalModal = document.getElementById('terminalModal');
  const terminalInput = document.getElementById('terminalInput');
  const terminalHistory = document.getElementById('terminalHistory');
  const terminalTrigger = document.getElementById('terminalTrigger');

  function openTerminal() {
    if (!terminalModal) return;
    terminalModal.classList.add('term-open');
    terminalModal.setAttribute('aria-hidden', 'false');
    terminalInput.focus();
  }

  window.closeTerminal = function() {
    if (!terminalModal) return;
    terminalModal.classList.remove('term-open');
    terminalModal.setAttribute('aria-hidden', 'true');
  };

  if (terminalTrigger) terminalTrigger.addEventListener('click', openTerminal);

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        processTerminalCommand(cmd);
      }
    });
  }

  function processTerminalCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line';

    switch (cmd) {
      case 'whoami':
        line.innerHTML = '<span class="term-hl">Pranay Kumar Vonamala</span> — 3rd Year CS & Information Security Student at VIT Vellore (CGPA 8.27, Grad 2028). Based in Hyderabad, India.';
        break;
      case 'skills':
        line.innerHTML = '<span class="term-hl">8 Domains:</span> AI/LLMs (LangChain, LangGraph, Ollama), Frontend (React, CSS), Backend (Python, FastAPI), Languages (C++, Python, Java, JS), Databases (Firestore, SQL), Tools (Git, Linux, Vercel), Core CS (DS & Algo), Security (CTI, OSINT).';
        break;
      case 'projects':
        line.innerHTML = '<span class="term-hl">Projects:</span> 1. Spendly (FinTech) | 2. Sentinel AI (CTI) | 3. SupportFlow AI (Agentic AI)';
        break;
      case 'cgpa':
        line.innerHTML = '<span class="term-hl">CGPA:</span> 8.27 (Vellore Institute of Technology, Vellore - B.Tech CS & InfoSec)';
        break;
      case 'contact':
        line.innerHTML = '<span class="term-hl">Email:</span> vonamala.pranay.official@gmail.com | Phone: +91 6301905015';
        break;
      case 'resume':
        window.open('Pranay_Kumar_Vonamala_Resume.pdf', '_blank');
        line.innerHTML = 'Opening Pranay_Kumar_Vonamala_Resume.pdf...';
        break;
      case 'github':
        window.open('https://github.com/Pranay-Kumar-02', '_blank');
        line.innerHTML = 'Opening GitHub @Pranay-Kumar-02...';
        break;
      case 'leetcode':
        window.open('https://leetcode.com/u/Pranayyy_/', '_blank');
        line.innerHTML = 'Opening LeetCode @Pranayyy_...';
        break;
      case 'clear':
        terminalHistory.innerHTML = '';
        return;
      case 'help':
      default:
        line.innerHTML = 'Available commands: <span class="term-hl">whoami, skills, projects, cgpa, contact, resume, github, leetcode, clear, help</span>';
        break;
    }
    terminalHistory.appendChild(line);
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
  }

  /**
   * 9. Conversational AI Portfolio Assistant (First-Person Authentic Persona)
   */
  const aiDrawer = document.getElementById('aiDrawer');
  const aiChatBody = document.getElementById('aiChatBody');
  const aiInput = document.getElementById('aiInput');

  window.toggleAiAssistant = function() {
    if (!aiDrawer) return;
    aiDrawer.classList.toggle('ai-open');
  };

  window.sendQuickPrompt = function(promptText) {
    if (aiInput) {
      aiInput.value = promptText;
      sendAiMessage();
    }
  };

  window.sendAiMessage = function() {
    const text = aiInput.value.trim();
    if (!text) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg ai-msg-user';
    userMsg.innerText = text;
    aiChatBody.appendChild(userMsg);
    aiInput.value = '';

    // Typing Indicator Simulation
    const typingMsg = document.createElement('div');
    typingMsg.className = 'ai-msg ai-msg-bot';
    typingMsg.innerText = 'Typing...';
    aiChatBody.appendChild(typingMsg);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;

    setTimeout(() => {
      aiChatBody.removeChild(typingMsg);
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-msg ai-msg-bot';
      botMsg.innerText = getAiKnowledgeResponse(text.toLowerCase());
      aiChatBody.appendChild(botMsg);
      aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }, 450);
  };

  function getAiKnowledgeResponse(q) {
    if (q.includes('spendly') || q.includes('finance')) {
      return 'Spendly is an AI-powered personal finance platform I built to help users track expenses, analyze spending habits, and receive intelligent financial recommendations. The application combines React, Firebase, FastAPI, and OpenRouter AI insights to create a smarter budgeting experience.';
    } else if (q.includes('sentinel') || q.includes('cyber') || q.includes('security') || q.includes('cti')) {
      return 'Sentinel AI is India’s AI-powered Cyber Threat Intelligence (CTI) platform I architected to aggregate raw threat feeds, automate OSINT recon (VirusTotal, WHOIS, Google Safe Browsing), and present explainable AI threat scoring for rapid incident triage.';
    } else if (q.includes('supportflow') || q.includes('agent') || q.includes('langgraph') || q.includes('ollama')) {
      return 'SupportFlow AI is an enterprise Agentic AI platform I engineered using LangChain, LangGraph stateful graph orchestration, and Ollama local LLMs. It executes multi-step reasoning, persistent memory, and dynamic tool calling with zero data leakage.';
    } else if (q.includes('who') || q.includes('pranay') || q.includes('about') || q.includes('background')) {
      return 'I am Pranay Kumar Vonamala, a 3rd-year Computer Science Engineering student specializing in Information Security at VIT Vellore (CGPA 8.27). Based in Hyderabad, I am passionate about building software products across AI, Cybersecurity, and Full-Stack development.';
    } else if (q.includes('cgpa') || q.includes('grade') || q.includes('vit') || q.includes('college') || q.includes('education')) {
      return 'I am currently pursuing my B.Tech in Computer Science Engineering (Information Security) at Vellore Institute of Technology (VIT), Vellore, maintaining a CGPA of 8.27 with expected graduation in 2028.';
    } else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
      return 'You can reach me directly via email at vonamala.pranay.official@gmail.com or vonamala.pranay@gmail.com, or call me at +91 6301905015. I am always open to conversations about software engineering internships and AI research roles.';
    } else if (q.includes('skills') || q.includes('tech') || q.includes('stack')) {
      return 'My core stack is organized into 8 domains: AI & LLMs (LangChain, LangGraph, Ollama), Frontend (React, CSS), Backend (Python, FastAPI), Languages (C++, Python, Java, JS), Databases (Firestore, SQL), Tools (Git, Linux, Vercel), Core CS (DS & Algo), and Cybersecurity (CTI, OSINT).';
    } else if (q.includes('certif')) {
      return 'I hold verified certifications from IBM SkillsBuild (Cybersecurity Fundamentals), Deloitte (Cyber Job Simulation), Infosys Springboard (AI & Data Science), and IIT Madras (Cyber Ninjas with Ethical Hacking).';
    } else {
      return 'I am a 3rd-year CS & InfoSec student at VIT Vellore (CGPA 8.27) passionate about building AI, security, and full-stack software. Feel free to ask about Spendly, Sentinel AI, SupportFlow AI, or my contact info!';
    }
  }

  /**
   * 10. Case Study Modal Drawer Controllers
   */
  window.openCaseStudy = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCaseStudy = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('modal-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.case-study-modal.modal-open, .cmd-palette-modal.cmd-open, .terminal-modal.term-open');
      openModals.forEach(modal => {
        modal.classList.remove('modal-open', 'cmd-open', 'term-open');
        modal.setAttribute('aria-hidden', 'true');
      });
      const themeMenu = document.getElementById('themeMenu');
      if (themeMenu) {
        themeMenu.classList.add('hidden');
        themeMenu.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }
  });

  /**
   * 11. Multi-Theme Engine Manager
   */
  const themePickerBtn = document.getElementById('themePickerBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeOptionBtns = document.querySelectorAll('.theme-option-btn');
  const themeActiveIcon = document.getElementById('themeActiveIcon');
  const themeQuickToggleHeader = document.getElementById('themeQuickToggleHeader');
  const themeHeaderToggleText = document.getElementById('themeHeaderToggleText');

  let currentTheme = localStorage.getItem('portfolio_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark-slate');

  const themeIconsMap = {
    'light': '☀️',
    'dark-slate': '🌙',
    'obsidian': '🌌',
    'emerald': '🌲',
    'cobalt': '💎',
    'warm-gold': '👑'
  };

  function applyTheme(themeId) {
    currentTheme = themeId;
    root.setAttribute('data-theme', themeId);
    localStorage.setItem('portfolio_theme', themeId);

    // Update active state in theme menu
    themeOptionBtns.forEach(btn => {
      if (btn.dataset.themeId === themeId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update icon on the nav theme select button
    if (themeActiveIcon) {
      themeActiveIcon.textContent = themeIconsMap[themeId] || '🎨';
    }

    // Update Header quick toggle button text
    if (themeHeaderToggleText) {
      if (themeId === 'light') {
        themeHeaderToggleText.textContent = '🌙 Dark';
      } else {
        themeHeaderToggleText.textContent = '☀️ Light';
      }
    }

    // Refresh Canvas Particle Colors
    if (window.updateParticleColors) {
      window.updateParticleColors();
    }
  }

  // Initialize saved or default theme
  applyTheme(currentTheme);

  // Quick Toggle in Header Handler (Switches Light <-> Dark Slate / Last active dark theme)
  if (themeQuickToggleHeader) {
    themeQuickToggleHeader.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentTheme === 'light') {
        const lastDark = localStorage.getItem('portfolio_dark_theme') || 'dark-slate';
        applyTheme(lastDark);
      } else {
        localStorage.setItem('portfolio_dark_theme', currentTheme);
        applyTheme('light');
      }
    });
  }

  // Popover Menu Handler
  if (themePickerBtn && themeMenu) {
    themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = themeMenu.classList.contains('hidden');
      if (isHidden) {
        themeMenu.classList.remove('hidden');
        themeMenu.setAttribute('aria-hidden', 'false');
      } else {
        themeMenu.classList.add('hidden');
        themeMenu.setAttribute('aria-hidden', 'true');
      }
    });

    themeOptionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selected = btn.dataset.themeId;
        if (selected) {
          applyTheme(selected);
          themeMenu.classList.add('hidden');
          themeMenu.setAttribute('aria-hidden', 'true');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!themeMenu.contains(e.target) && e.target !== themePickerBtn) {
        themeMenu.classList.add('hidden');
        themeMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /**
   * 12. Interactive Background Particle Canvas Engine
   */
  function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particleColor = 'rgba(99, 102, 241, 0.35)';
    let lineColor = 'rgba(99, 102, 241, 0.15)';

    window.updateParticleColors = function() {
      const style = getComputedStyle(document.documentElement);
      particleColor = style.getPropertyValue('--particle-color').trim() || 'rgba(99, 102, 241, 0.35)';
      lineColor = style.getPropertyValue('--particle-line-color').trim() || 'rgba(99, 102, 241, 0.15)';
    };
    window.updateParticleColors();

    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.6 + 1.0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);

    function animate() {
      if (document.hidden || prefersReducedMotion) {
        requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render Particles & Inter-particle Connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.8 * (1 - dist / 115);
            ctx.stroke();
          }
        }

        // Connect to mouse cursor
        if (mouseX > 0 && mouseY > 0) {
          const mdx = p1.x - mouseX;
          const mdy = p1.y - mouseY;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1.2 * (1 - mdist / 140);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  initParticleCanvas();

  // Attach Event Listeners
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  initScrollObserver();
  requestAnimationFrame(renderFrame);
});
