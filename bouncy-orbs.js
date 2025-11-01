// Bouncy Orbs Physics Engine
// Makes the floating orbs bounce off each other and the edges of the viewport

// Constants
const TARGET_FRAME_TIME = 16.67; // 60fps in milliseconds
const RESIZE_DEBOUNCE_DELAY = 250; // milliseconds
const TOGGLE_DELAY = 100; // milliseconds

class BouncyOrb {
  constructor(element, index) {
    this.element = element;
    this.index = index;
    
    // Get initial size and increase it slightly
    const rect = element.getBoundingClientRect();
    this.radius = Math.max(rect.width, rect.height) / 2;
    
    // Initial position (convert from fixed positioning to absolute pixel values)
    this.x = rect.left + this.radius;
    this.y = rect.top + this.radius;
    
    // Random velocity
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    
    // Physics properties
    this.mass = Math.PI * this.radius * this.radius; // Area-based mass for realistic physics
    this.damping = 0.98; // Slight energy loss on bounce
    this.restitution = 0.85; // Bounciness (0 = no bounce, 1 = perfect bounce)
  }
  
  update(dt) {
    // Update position based on velocity
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    // Apply damping
    this.vx *= this.damping;
    this.vy *= this.damping;
    
    // Check boundary collisions
    const minX = this.radius;
    const maxX = window.innerWidth - this.radius;
    const minY = this.radius;
    const maxY = window.innerHeight - this.radius;
    
    if (this.x < minX) {
      this.x = minX;
      this.vx = Math.abs(this.vx) * this.restitution;
    } else if (this.x > maxX) {
      this.x = maxX;
      this.vx = -Math.abs(this.vx) * this.restitution;
    }
    
    if (this.y < minY) {
      this.y = minY;
      this.vy = Math.abs(this.vy) * this.restitution;
    } else if (this.y > maxY) {
      this.y = maxY;
      this.vy = -Math.abs(this.vy) * this.restitution;
    }
    
    // Update element position
    this.element.style.left = `${this.x - this.radius}px`;
    this.element.style.top = `${this.y - this.radius}px`;
  }
  
  checkCollision(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = this.radius + other.radius;
    
    if (distance < minDistance) {
      return { dx, dy, distance, minDistance };
    }
    return null;
  }
  
  resolveCollision(other, collision) {
    const { dx, dy, distance, minDistance } = collision;
    
    // Normalize collision vector
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Separate overlapping orbs
    const overlap = minDistance - distance;
    const separationX = nx * overlap * 0.5;
    const separationY = ny * overlap * 0.5;
    
    this.x -= separationX;
    this.y -= separationY;
    other.x += separationX;
    other.y += separationY;
    
    // Calculate relative velocity
    const dvx = other.vx - this.vx;
    const dvy = other.vy - this.vy;
    
    // Calculate relative velocity in collision normal direction
    const velocityAlongNormal = dvx * nx + dvy * ny;
    
    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return;
    
    // Calculate impulse scalar
    const restitution = Math.min(this.restitution, other.restitution);
    const impulse = -(1 + restitution) * velocityAlongNormal;
    const totalMass = this.mass + other.mass;
    const impulseScalar = impulse / totalMass;
    
    // Apply impulse
    const impulseX = impulseScalar * nx;
    const impulseY = impulseScalar * ny;
    
    this.vx -= impulseX * other.mass;
    this.vy -= impulseY * other.mass;
    other.vx += impulseX * this.mass;
    other.vy += impulseY * this.mass;
  }
}

class BouncyOrbsEngine {
  constructor() {
    this.orbs = [];
    this.lastTime = 0;
    this.animationId = null;
  }
  
  init() {
    // Get all orb elements
    const orbElements = document.querySelectorAll('.page-blob');
    
    if (orbElements.length === 0) {
      console.warn('No orb elements found');
      return;
    }
    
    // Create BouncyOrb instances
    orbElements.forEach((element, index) => {
      // Add physics-enabled class for styling
      element.classList.add('physics-enabled');
      
      this.orbs.push(new BouncyOrb(element, index));
    });
    
    // Start animation loop
    this.lastTime = performance.now();
    this.animate();
  }
  
  animate() {
    const currentTime = performance.now();
    const dt = Math.min((currentTime - this.lastTime) / TARGET_FRAME_TIME, 2); // Cap dt to prevent large jumps
    this.lastTime = currentTime;
    
    // Update all orbs
    this.orbs.forEach(orb => orb.update(dt));
    
    // Check collisions between all orbs
    // Note: O(n²) complexity is acceptable for small number of orbs (10)
    // For larger numbers, consider spatial partitioning (quadtree)
    for (let i = 0; i < this.orbs.length; i++) {
      for (let j = i + 1; j < this.orbs.length; j++) {
        const collision = this.orbs[i].checkCollision(this.orbs[j]);
        if (collision) {
          this.orbs[i].resolveCollision(this.orbs[j], collision);
        }
      }
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize when DOM is ready
let bouncyEngine = null;

function initBouncyOrbs() {
  // Check if reduce-motion is enabled
  if (document.body.classList.contains('reduce-motion')) {
    return; // Don't start physics if animations are disabled
  }
  
  if (bouncyEngine) {
    bouncyEngine.stop();
  }
  
  bouncyEngine = new BouncyOrbsEngine();
  bouncyEngine.init();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBouncyOrbs);
} else {
  initBouncyOrbs();
}

// Re-initialize on window resize to adjust boundaries
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initBouncyOrbs, RESIZE_DEBOUNCE_DELAY);
});

// Handle reduce-motion toggle
const toggleAnimBtn = document.getElementById('toggle-anim-btn');
if (toggleAnimBtn) {
  toggleAnimBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (document.body.classList.contains('reduce-motion')) {
        if (bouncyEngine) {
          bouncyEngine.stop();
        }
      } else {
        initBouncyOrbs();
      }
    }, TOGGLE_DELAY);
  });
}
