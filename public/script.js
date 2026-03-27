// Initialize Lenis for buttery smooth scrolling (Apple style)
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Ensure GSAP ScrollTrigger updates with Lenis
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
});
gsap.ticker.lagSmoothing(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Canvas Image Sequence Setup
    const canvas = document.getElementById("hero-canvas");
    const context = canvas.getContext("2d");

    // Initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(); // re-render on resize
    });

    const frameCount = 240;
    const currentFrame = index => (
      `assets/images/herosection/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`
    );

    const images = [];
    const watchState = {
      frame: 0
    };

    // Preload images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    images[0].onload = render;

    function render() {
        if (!images[watchState.frame]) return;
        const img = images[watchState.frame];
        
        // Calculate scaling to cover or fit the canvas
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        // Center the image
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    // 2. Hero Scroll Animation (Sequence Scrub and Text Overlay)
    const heroScrollTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-sequence-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5, // buttery smooth scrub
            pin: ".hero-section"
        }
    });

    // Tie the frame update to the scroll timeline
    heroScrollTl.to(watchState, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
        duration: 10 // Arbitrary relative duration for mapping overlays
    }, 0);

    // Initial load animation for the first feature text
    gsap.to('.title-text', {
        y: '0%',
        duration: 1.4,
        stagger: 0.15,
        ease: "expo.out",
        delay: 0.5
    });
    gsap.to('#feature-1', {
        opacity: 1,
        duration: 1.4,
        ease: "power2.out",
        delay: 0.5
    });

    // Initial states for the text elements to slide upwards
    gsap.set('#feature-2', { y: 40 });
    gsap.set('#feature-3', { y: 40 });

    // Text Reveal/Hide Timeline synced with the canvas sequence
    
    // Fade out first featured text (moves up slightly)
    heroScrollTl.to('#feature-1', {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: "power1.inOut"
    }, 1.5); 

    // Fade in second feature text (Bottom-left)
    heroScrollTl.to('#feature-2', {
        opacity: 1,
        y: 0, // Slides up to its original position
        duration: 1,
        ease: "power1.out"
    }, 3.5);
    
    // Fade out second feature text (moves up)
    heroScrollTl.to('#feature-2', {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: "power1.inOut"
    }, 5.5);

    // Fade in third feature text (Top-left again)
    heroScrollTl.to('#feature-3', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.out"
    }, 7.5);
    
    // Fade out third feature text as sequence ends
    heroScrollTl.to('#feature-3', {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: "power1.inOut"
    }, 9);

    // 3. Apple-like Reveal Effect for text elements
    const revealElements = gsap.utils.toArray('.apple-reveal');
    revealElements.forEach(el => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // appear slightly before they get into viewport
                toggleActions: "play none none reverse"
            }
        });
    });

    // 4. Reveal Image container using clip-path for that premium look
    const revealImages = gsap.utils.toArray('.apple-reveal-img');
    revealImages.forEach(el => {
        gsap.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.8,
            ease: "expo.inOut",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // 5. Marquee Text Parallax
    gsap.to('.marquee-text', {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
            trigger: ".details-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
        }
    });

    // 6. Specs Inner Image Parallax
    gsap.to('.spec-img', {
        scale: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".specs-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

});
