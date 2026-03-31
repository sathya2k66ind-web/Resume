import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Mail, Phone } from 'lucide-react';

// Custom SVG icons for social media
const GithubIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

gsap.registerPlugin(ScrollTrigger);

// Resume Data
const resumeData = {
  name: "SATHYA NARAYANAN K",
  title: "B.E. Computer Science & Engineering · Kumaraguru College of Technology",
  contact: {
    phone: "+91 99436 85218",
    email: "sathya2k66ind@gmail.com",
    location: "Coimbatore, Tamil Nadu",
    github: "https://github.com/sathya2k66ind-web",
    linkedin: "https://linkedin.com/in/sathya-narayanan-k-901b79386/"
  },
  education: {
    degree: "B.E. Computer Science & Engineering",
    institution: "Kumaraguru College of Technology, Coimbatore",
    duration: "2025 – 2029",
    cgpa: "8.16 Provisional (Sem 1)",
    current: "Semester 2, 2025–26",
    coursework: ["Multivariate Calculus", "Python Programming", "Embedded Systems", "Data Structures & Algorithms"]
  },
  projects: [
    {
      title: "Network Intrusion Detection System",
      category: "ML / Cybersecurity",
      year: "2025",
      tech: ["Python", "Scikit-learn", "Random Forest", "Flask", "Streamlit"],
      highlights: [
        "Trained Random Forest classifier with >98% test accuracy",
        "Built military HUD-aesthetic real-time threat dashboard"
      ],
      url: "https://sathya-nids-project.streamlit.app/"
    },
    {
      title: "YouTube Comment Sentiment Analyzer",
      category: "NLP / Full-Stack",
      year: "2025",
      tech: ["Python", "RoBERTa", "YouTube Data API v3", "Flask", "Streamlit"],
      highlights: [
        "Upgraded from TextBlob to fine-tuned RoBERTa transformer",
        "Real-time comment ingestion with interactive visualizations"
      ],
      url: "https://youtube-comments-esxz.onrender.com/"
    },
    {
      title: "Content-Based Recommendation System",
      category: "NLP / ML",
      year: "2025",
      tech: ["Python", "TF-IDF", "Cosine Similarity", "Streamlit"],
      highlights: [
        "Movie recommendation engine using TF-IDF vectorization",
        "Clean Streamlit UI, fully deployed"
      ],
      url: "https://sathya-recommender.streamlit.app/"
    },
    {
      title: "Slotify – Smart Parking App",
      category: "Full-Stack · Team Project",
      year: "2024 – 2025",
      tech: ["React", "Vite", "Node.js", "Express", "MongoDB Atlas", "JWT"],
      highlights: [
        "QR-based vehicle entry with JWT-secured authentication",
        "Field-tested at KCT campus, led backend API design"
      ],
      url: "https://pp-app-frontend.vercel.app/"
    }
  ],
  skills: {
    languages: ["Python", "JavaScript (ES6+)", "C (basics)", "HTML / CSS"],
    mlNlp: ["Scikit-learn", "HuggingFace Transformers", "TF-IDF", "Random Forest", "Pandas", "NumPy"],
    webApis: ["Flask", "React", "Vite", "Node.js / Express", "REST APIs", "JWT Auth"],
    databases: ["MongoDB Atlas", "MySQL"],
    devops: ["Git / GitHub", "Streamlit", "Render", "Vercel", "Postman", "Notion"],
    embedded: ["Arduino", "LED control", "LCD I2C display interfacing"]
  },
  research: [
    {
      title: "Smart Parking System Using IoT & QR Code Integration",
      type: "Team Project",
      status: "Scopus-Targeted · In Progress",
      year: "2025",
      collaborators: "Co-authored with Rahul, Zaara, Akhshaya, Caroline, Jashan",
      description: "Documents architecture of a real-time campus parking management system: QR-based entry, live slot availability, and JWT-secured mobile access. Targets Scopus-indexed conference/journal."
    },
    {
      title: "DAW Workflows & Cognitive Creativity in Trap/Hip-Hop Production",
      type: "Solo Research",
      status: "Solo · Scopus-Targeted",
      year: "2024 – 2025",
      collaborators: "Target: IASPM Journal · Journal of Music, Technology & Education",
      description: "Solo literature review examining how Digital Audio Workstation design influences creative cognition in modern trap/hip-hop production. Passed AI-detection remediation (GPTZero: 70% → 6%)."
    }
  ]
};

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  locations?: number[];
}

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 6;
  
  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  // Initialize Three.js
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;
      
      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      // Create scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();
      getLocation();

      // Start animation
      animate();
      
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      const starCount = 5000;
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8);
          } else {
            color.setHSL(0.6, 0.5, 0.8);
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene!.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;
      
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene!.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;
      
      const layers = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 }
      ];

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 50;
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y = Math.sin(i * 0.1) * layer.height + 
                   Math.sin(i * 0.05) * layer.height * 0.5 +
                   Math.random() * layer.height * 0.2 - 100;
          points.push(new THREE.Vector2(x, y));
        }
        
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene!.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene!.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        if ((starField.material as THREE.ShaderMaterial).uniforms) {
          (starField.material as THREE.ShaderMaterial).uniforms.time.value = time;
        }
      });

      if (refs.nebula && (refs.nebula.material as THREE.ShaderMaterial).uniforms) {
        (refs.nebula.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.5;
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * smoothingFactor;
        
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;
        
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    initThree();

    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const { current: refs } = threeRefs;
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      });

      refs.mountains.forEach(mountain => {
        mountain.geometry.dispose();
        (mountain.material as THREE.Material).dispose();
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  const getLocation = () => {
    const { current: refs } = threeRefs;
    const locations: number[] = [];
    refs.mountains.forEach((mountain, i) => {
      locations[i] = mountain.position.z;
    });
    refs.locations = locations;
  };

  // GSAP Animations
  useEffect(() => {
    if (!isReady) return;
    
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }

    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.title-char');
      tl.from(titleChars, {
        y: 200,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out"
      }, "-=0.5");
    }

    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
      tl.from(subtitleLines, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.8");
    }

    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      setScrollProgress(progress);
      const newSection = Math.min(Math.floor(progress * totalSections), totalSections - 1);
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;
      
      const totalProgress = progress * totalSections;
      const sectionProgress = totalProgress % 1;
      
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 35, z: 200 },
        { x: 0, y: 40, z: 100 },
        { x: 0, y: 45, z: 0 },
        { x: 0, y: 50, z: -100 },
        { x: 0, y: 55, z: -200 }
      ];
      
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;
      
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;
        if (refs.nebula) {
          refs.nebula.position.z = (targetZ + progress * speed * 0.01) - 100;
        }
        
        mountain.userData.targetZ = targetZ;
        if (progress > 0.7) {
          mountain.position.z = 600000;
        }
        if (progress < 0.7 && refs.locations) {
          mountain.position.z = refs.locations[i];
        }
      });
      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="title-char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="hero-container">
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Persistent name visible across all sections */}
      <div className="persistent-name">
        <p className="persistent-name-text">{resumeData.name}</p>
      </div>
      
      {/* Side menu */}
      <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="vertical-text">PORTFOLIO</div>
      </div>

      {/* Section 1: Contact Hero */}
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title-large">
          {splitTitle(resumeData.name)}
        </h1>
        
        <div ref={subtitleRef} className="hero-subtitle">
          <p className="subtitle-line glass-text">
            {resumeData.title}
          </p>
          <p className="subtitle-line glass-text location-text">
            {resumeData.contact.location}
          </p>
          
          {/* Contact Icons */}
          <div className="contact-icons">
            <a 
              href={`mailto:${resumeData.contact.email}`} 
              className="contact-icon-link"
              title={resumeData.contact.email}
            >
              <Mail className="contact-icon" />
              <span className="icon-tooltip">{resumeData.contact.email}</span>
            </a>
            <a 
              href={`tel:${resumeData.contact.phone}`} 
              className="contact-icon-link"
              title={resumeData.contact.phone}
            >
              <Phone className="contact-icon" />
              <span className="icon-tooltip">{resumeData.contact.phone}</span>
            </a>
            <a 
              href={resumeData.contact.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-icon-link"
              title="GitHub"
            >
              <GithubIcon className="contact-icon" />
              <span className="icon-tooltip">GitHub</span>
            </a>
            <a 
              href={resumeData.contact.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-icon-link"
              title="LinkedIn"
            >
              <LinkedinIcon className="contact-icon" />
              <span className="icon-tooltip">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter">
          {String(currentSection + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </div>
      </div>

      {/* Scroll sections */}
      <div className="scroll-sections">
        {/* Section 2: Education */}
        <section className="content-section">
          <div className="glass-card-dark">
            <h2 className="section-title-bold">EDUCATION</h2>
            <div className="education-content">
              <h3 className="hover-text-bold">{resumeData.education.degree}</h3>
              <p className="hover-text-bold institution">{resumeData.education.institution}</p>
              <p className="hover-text-bold duration">{resumeData.education.duration}</p>
              <p className="hover-text-bold cgpa">CGPA: {resumeData.education.cgpa}</p>
              <p className="hover-text-bold current">{resumeData.education.current}</p>
              <div className="coursework">
                <h4 className="hover-text-bold">Coursework:</h4>
                <div className="coursework-tags">
                  {resumeData.education.coursework.map((course, i) => (
                    <span key={i} className="course-tag hover-text-bold">{course}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: All Projects in 2x2 Grid */}
        <section className="content-section projects-section">
          <div className="glass-card-dark projects-full">
            <h2 className="section-title-bold">PROJECTS</h2>
            <div className="projects-grid-square">
              {resumeData.projects.map((project, i) => (
                <div key={i} className="project-card-compact">
                  <div className="project-header">
                    <h3 className="hover-text-bold project-title">{project.title}</h3>
                    <span className="hover-text-bold project-category">{project.category} · {project.year}</span>
                  </div>
                  <div className="tech-stack-compact">
                    {project.tech.slice(0, 3).map((tech, j) => (
                      <span key={j} className="tech-tag-compact hover-text-bold">{tech}</span>
                    ))}
                  </div>
                  <ul className="project-highlights-compact">
                    {project.highlights.slice(0, 2).map((highlight, j) => (
                      <li key={j} className="hover-text-bold">{highlight}</li>
                    ))}
                  </ul>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link-hover"
                  >
                    <span className="live-text">LIVE</span>
                    <span className="url-text">→ View Project</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Research & Publications */}
        <section className="content-section research-section">
          <div className="glass-card-dark">
            <h2 className="section-title-bold">RESEARCH & PUBLICATIONS</h2>
            <div className="research-grid-full">
              {resumeData.research.map((paper, i) => (
                <div key={i} className="research-card-full">
                  <div className="research-type-badge">{paper.type}</div>
                  <h3 className="hover-text-bold research-title">{paper.title}</h3>
                  <span className="hover-text-bold research-status">{paper.status} · {paper.year}</span>
                  <p className="hover-text-bold research-collaborators">{paper.collaborators}</p>
                  <p className="hover-text-bold research-description">{paper.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Skills */}
        <section className="content-section skills-section">
          <div className="glass-card-dark">
            <h2 className="section-title-bold">SKILLS</h2>
            <div className="skills-container-full">
              <div className="skill-category">
                <h4 className="hover-text-bold skill-category-title">Languages</h4>
                <div className="skill-tags">
                  {resumeData.skills.languages.map((skill, i) => (
                    <span key={i} className="skill-tag-dark hover-text-bold">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skill-category">
                <h4 className="hover-text-bold skill-category-title">ML / NLP</h4>
                <div className="skill-tags">
                  {resumeData.skills.mlNlp.map((skill, i) => (
                    <span key={i} className="skill-tag-dark hover-text-bold">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skill-category">
                <h4 className="hover-text-bold skill-category-title">Web & APIs</h4>
                <div className="skill-tags">
                  {resumeData.skills.webApis.map((skill, i) => (
                    <span key={i} className="skill-tag-dark hover-text-bold">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skill-category">
                <h4 className="hover-text-bold skill-category-title">Databases</h4>
                <div className="skill-tags">
                  {resumeData.skills.databases.map((skill, i) => (
                    <span key={i} className="skill-tag-dark hover-text-bold">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skill-category">
                <h4 className="hover-text-bold skill-category-title">DevOps & Tools</h4>
                <div className="skill-tags">
                  {resumeData.skills.devops.map((skill, i) => (
                    <span key={i} className="skill-tag-dark hover-text-bold">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skill-category">
                <h4 className="hover-text-bold skill-category-title">Embedded Systems</h4>
                <div className="skill-tags">
                  {resumeData.skills.embedded.map((skill, i) => (
                    <span key={i} className="skill-tag-dark hover-text-bold">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Contact Footer */}
        <section className="content-section contact-footer-section">
          <div className="glass-card-dark contact-footer">
            <h2 className="section-title-bold">GET IN TOUCH</h2>
            <h3 className="footer-name">{resumeData.name}</h3>
            <p className="hover-text-bold footer-title">{resumeData.title}</p>
            <p className="hover-text-bold footer-location">{resumeData.contact.location}</p>
            
            {/* Contact Icons Footer */}
            <div className="contact-icons-footer">
              <a 
                href={`mailto:${resumeData.contact.email}`} 
                className="contact-icon-link-footer"
              >
                <Mail className="contact-icon-footer" />
                <span className="contact-label">{resumeData.contact.email}</span>
              </a>
              <a 
                href={`tel:${resumeData.contact.phone}`} 
                className="contact-icon-link-footer"
              >
                <Phone className="contact-icon-footer" />
                <span className="contact-label">{resumeData.contact.phone}</span>
              </a>
              <a 
                href={resumeData.contact.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-icon-link-footer"
              >
                <GithubIcon className="contact-icon-footer" />
                <span className="contact-label">GitHub</span>
              </a>
              <a 
                href={resumeData.contact.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-icon-link-footer"
              >
                <LinkedinIcon className="contact-icon-footer" />
                <span className="contact-label">LinkedIn</span>
              </a>
            </div>
            
            <p className="footer-copyright">© 2025 Sathya Narayanan K. All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Component;
