/* =========================
   HEART PARTICLES CREATION
========================= */
const particles = document.querySelector(".particles");
for (let i = 0; i < 50; i++) {
    const s = document.createElement("span");
    particles.appendChild(s);
}

/* =========================
   GSAP TIMELINE
========================= */
gsap.set(".heart", { scale: 0, opacity: 0 });
gsap.set(".book", { scale: 0.6, rotationX: 75 });
gsap.set(".quote", { y: 10 });
gsap.set(".title-main", { y: 10 });

const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.to(".heart", { scale: 1, opacity: 1, duration: 1.6 });

/* 4 HEARTBEATS */
for (let i = 0; i < 4; i++) {
    tl.to(".heart", { scale: 1.28, duration: 0.22 }).to(".heart", { scale: 1, duration: 0.32 });
}

/* HEART → PARTICLES */
tl.to(".heart", { scale: 0.2, opacity: 0, duration: 0.4 });

tl.to(
    ".particles span",
    {
        opacity: 0.5,
        x: () => gsap.utils.random(-500, 500),
        y: () => gsap.utils.random(-500, -500),
        rotation: () => gsap.utils.random(-180, 180),
        scale: () => gsap.utils.random(0.6, 1.2),
        duration: 2.5,
        ease: "power1.out",
        stagger: 0.05,
    },
    "-=0.3"
);

tl.to(".particles span", { opacity: 0, duration: 0.8 });

/* QUOTE */
tl.to(".quote", {
    opacity: 1,
    y: 0,
    duration: 1.4,
});

tl.to(".quote", {
    opacity: 0,
    duration: 1.2,
    delay: 1.4,
});

/* BOOK */
tl.to(
    ".book",
    {
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1.4,
    },
    "-=0.6"
);

tl.to(".cover.left", { rotateY: 28, duration: 1.4 }).to(".cover.right", { rotateY: -28, duration: 1.4 }, "<");

tl.to(".title-main", {
    clipPath: "inset(0 0% 0 0)",
    duration: 1.2,
    ease: "power2.out",
})
    .to(
        ".title-accent",
        {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "power2.out",
        },
        "+=0.3"
    )
    .to(
        ".cover.left img ",
        {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
        },
        "+=0.3"
    );

tl.to(
    ".cover.right img",
    {
        opacity: 1,
        scale: 1,
        duration: 1,
    },
    "-=1"
);

/* BOOK IDLE */
gsap.to(".book", {
    rotationY: 8,
    rotationX: -4,
    scale: 1.02,
    duration: 4,
    yoyo: true,
    ease: "sine.inOut",
});

/* =========================
   THREE.JS FLOATING PARTICLES
========================= */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 200;

const renderer = new THREE.WebGLRenderer({ canvas: bg, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.SphereGeometry(10, 32, 32);
const count = 600;
const positions = [];

for (let i = 0; i < count; i++) {
    positions.push((Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800);
}

geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

function createParticleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Center is opaque white
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Edges are fully transparent

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
}

const material = new THREE.PointsMaterial({
    map: createParticleTexture(),
    color: 0xff4500,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    size: 0.5,
    sizeAttenuation: true,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

function animate() {
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0003;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
