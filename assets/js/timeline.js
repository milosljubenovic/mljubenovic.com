// Character Sprite Animation with Individual Frames
class SpriteCharacter {
  constructor(canvasId, framesPath) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Load individual frame images
    this.frames = [
      '/assets/timeline/walking/standing.png',
      '/assets/timeline/walking/walkin_1.png',
      '/assets/timeline/walking/walking_2.png',
      '/assets/timeline/walking/walking_3.png',
    ];
    this.images = [];
    this.imagesLoaded = 0;
    
    // Animation configuration
    this.scale = 1;         // Scale the character
    this.currentFrame = 0;
    this.frameDelay = 10;   // Frames to wait before switching sprite (increased from 5)
    this.frameCounter = 0;
    
    // Position (world position, not screen position)
    this.worldX = 0;
    this.targetWorldX = 0;
    this.speed = 3;
    this.speedMultiplier = 1;
    this.isWalking = false;
    this.facingRight = true; // Track direction character is facing
    
    // Load all frame images
    this.loadImages();
  }
  
  loadImages() {
    console.log('Loading character images...');
    this.frames.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        this.imagesLoaded++;
        console.log(`Image ${index} loaded (${this.imagesLoaded}/${this.frames.length})`);
        if (this.imagesLoaded === this.frames.length) {
          // All images loaded, setup canvas and draw
          const firstImage = this.images[0];
          this.canvas.width = firstImage.width * this.scale;
          this.canvas.height = firstImage.height * this.scale;
          console.log('All images loaded, canvas size:', this.canvas.width, 'x', this.canvas.height);
          this.draw();
        }
      };
      img.onerror = () => {
        console.error('Failed to load image:', src);
      };
      img.src = src;
      this.images[index] = img;
    });
  }
  
  draw() {
    if (this.images.length === 0 || !this.images[this.currentFrame].complete) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const currentImage = this.images[this.currentFrame];
    
    // Save context state
    this.ctx.save();
    
    // Mirror horizontally if facing left
    if (!this.facingRight) {
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        currentImage,
        -this.canvas.width, 0,
        this.canvas.width, this.canvas.height
      );
    } else {
      this.ctx.drawImage(
        currentImage,
        0, 0,
        this.canvas.width, this.canvas.height
      );
    }
    
    // Restore context state
    this.ctx.restore();
  }
  
  update() {
    // Character just animates in place, doesn't move
    if (this.isWalking) {
      // Animate sprite (cycle through frames 1, 2, 3)
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frameCounter = 0;
        // Cycle through walking frames (1, 2, 3)
        this.currentFrame = ((this.currentFrame - 1 + 1) % 3) + 1;
      }
      
      this.draw();
    }
  }
  
  startWalking() {
    if (!this.isWalking) {
      this.isWalking = true;
      // Only set to frame 1 if we're starting from standing
      if (this.currentFrame === 0) {
        this.currentFrame = 1;
      }
    }
  }
  
  stopWalking() {
    this.isWalking = false;
    this.currentFrame = 0; // Return to standing frame
    this.draw();
  }
  
  standStill() {
    // Use this when we actually want to return to standing
    this.isWalking = false;
    this.currentFrame = 0;
    this.draw();
  }
  
  reset() {
    this.standStill();
  }
  
  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }
  
  setFacing(facingRight) {
    if (this.facingRight !== facingRight) {
      this.facingRight = facingRight;
      this.draw();
    }
  }
}

// Timeline Manager
class Timeline {
  constructor() {
    this.character = new SpriteCharacter('characterCanvas', '/assets/timeline/walking_sprites.png');
    
    // Use injected data from Jekyll, or fall back to empty array
    this.milestones = window.timelineData || [];
    
    if (this.milestones.length === 0) {
      console.error('No timeline data found! Make sure window.timelineData is defined.');
    }
    
    this.currentMilestone = 0;
    this.speeds = [
      { name: '0.5x', value: 0.5 },
      { name: 'Normal', value: 1 },
      { name: '2x', value: 2}
    ];
    this.currentSpeed = 2; // Start at Slow (0.15x)
    this.worldContainer = document.getElementById('worldContainer');
    this.gameContainer = document.getElementById('gameContainer');
    this.worldOffset = 0;
    this.targetWorldOffset = 0;
    this.scrollSpeed = 2;
    this.isScrolling = false;
    
    // Infinite generation tracking
    this.clouds = [];
    this.trees = [];
    this.rocks = [];
    this.jobCards = [];
    this.totalDistance = 0;
    this.nextCloudX = 0;
    this.nextTreeX = 0;
    this.nextRockX = 0;
    
    // Job card physics
    this.currentJobCard = null;
    this.characterPositionPercent = 30; // Character is at 30% from left
    
    // Manual movement tracking
    this.manualDistanceTraveled = 0;
    this.visitedMilestones = new Set();
    this.welcomeCard = null;
    this.welcomeCardDismissed = false;
    
    this.init();
  }
  
  init() {
    console.log('Timeline initializing...');
    console.log('World container:', this.worldContainer);
    console.log('Game container:', this.gameContainer);
    this.renderTimelinePoints();
    this.setupControls();
    this.setupManualControls();
    this.animate();
    console.log('Timeline initialized with', this.milestones.length, 'milestones');
    
    // Spawn initial dynamic elements
    this.spawnInitialElements();
    
    // Spawn all job cards at their positions in the world
    this.spawnAllJobCards();
    
    // Show welcome card
    this.showWelcomeCard();
  }
  
  setupManualControls() {
    // Manual movement with D-pad
    this.isManualMode = false;
    this.baseManualSpeed = 2; // Base speed for manual movement (reduced from 3)
    this.movingLeft = false;
    this.movingRight = false;
    
    // Listen for D-pad presses
    document.addEventListener('manualControl', (e) => {
      const action = e.detail.action;
      
      if (action === 'right-press') {
        this.movingLeft = true;
        this.isManualMode = true;
        this.character.setFacing(false); // Face left
        this.character.startWalking();
        this.dismissWelcomeCard();
      } else if (action === 'right-release') {
        this.movingLeft = false;
        if (!this.movingRight) {
          this.character.stopWalking();
        }
      } else if (action === 'left-press') {
        this.movingRight = true;
        this.isManualMode = true;
        this.character.setFacing(true); // Face right
        this.character.startWalking();
        this.dismissWelcomeCard();
      } else if (action === 'left-release') {
        this.movingRight = false;
        if (!this.movingLeft) {
          this.character.stopWalking();
        }
      }
    });
  }
  
  spawnInitialElements() {
    const containerWidth = this.gameContainer.offsetWidth;
    
    // Spawn initial clouds spread across the screen
    for (let i = 0; i < 5; i++) {
      const x = (containerWidth / 5) * i + Math.random() * 100;
      this.createCloud(x);
    }
    
    // Spawn initial trees
    for (let i = 0; i < 3; i++) {
      const x = containerWidth * 0.3 + (i * containerWidth * 0.25);
      this.createTree(x);
    }
    
    // Spawn initial rocks
    for (let i = 0; i < 3; i++) {
      const x = containerWidth * 0.4 + (i * containerWidth * 0.25);
      this.createRock(x);
    }
    
    this.nextCloudX = 0;
    this.nextTreeX = 0;
    this.nextRockX = 0;
  }
  
  spawnAllJobCards() {
    const containerWidth = this.gameContainer.offsetWidth;
    const characterX = containerWidth * (this.characterPositionPercent / 100);
    const milestoneInterval = 800;
    
    // Create all job cards at their milestone positions
    this.milestones.forEach((milestone, index) => {
      // Calculate world position: character starts at characterX, first milestone is 800px away
      const worldPosition = (index + 1) * milestoneInterval;
      const cardX = characterX + worldPosition;
      
      const jobCard = this.createJobCard(milestone, cardX, worldPosition);
      jobCard.milestoneIndex = index;
      jobCard.isPermanent = true; // Mark as permanent world element
      this.jobCards.push(jobCard);
    });
    
    console.log('Spawned', this.jobCards.length, 'job cards in the world');
  }
  
  createCloud(xPosition) {
    const cloud = document.createElement('div');
    const scale = 0.8 + Math.random() * 0.6; // 0.8 to 1.4
    const top = 40 + Math.random() * 120;
    const opacity = 0.6 + Math.random() * 0.2;
    
    cloud.className = 'cloud absolute';
    cloud.style.left = xPosition + 'px';
    cloud.style.top = top + 'px';
    cloud.style.zIndex = '2';
    
    // Create puffy cloud with multiple overlapping circles
    const baseSize = 30 * scale;
    cloud.innerHTML = `
      <div class="relative" style="width: ${baseSize * 3}px; height: ${baseSize * 1.2}px;">
        <!-- Main body circles -->
        <div class="absolute rounded-full" style="width: ${baseSize}px; height: ${baseSize}px; background: rgba(255, 255, 255, ${opacity}); left: 0; bottom: 0;"></div>
        <div class="absolute rounded-full" style="width: ${baseSize * 1.3}px; height: ${baseSize * 1.3}px; background: rgba(255, 255, 255, ${opacity}); left: ${baseSize * 0.6}px; bottom: ${baseSize * 0.1}px;"></div>
        <div class="absolute rounded-full" style="width: ${baseSize * 1.1}px; height: ${baseSize * 1.1}px; background: rgba(255, 255, 255, ${opacity}); left: ${baseSize * 1.6}px; bottom: 0;"></div>
        <!-- Top puffs -->
        <div class="absolute rounded-full" style="width: ${baseSize * 0.7}px; height: ${baseSize * 0.7}px; background: rgba(255, 255, 255, ${opacity * 0.9}); left: ${baseSize * 0.3}px; bottom: ${baseSize * 0.6}px;"></div>
        <div class="absolute rounded-full" style="width: ${baseSize * 0.8}px; height: ${baseSize * 0.8}px; background: rgba(255, 255, 255, ${opacity * 0.9}); left: ${baseSize * 1.2}px; bottom: ${baseSize * 0.8}px;"></div>
      </div>
    `;
    
    document.getElementById('cloudsContainer').appendChild(cloud);
    this.clouds.push({ element: cloud, x: xPosition });
  }
  
  createTree(xPosition) {
    const tree = document.createElement('div');
    const isLarge = Math.random() > 0.5;
    const height = isLarge ? 96 : 80;
    
    tree.className = 'tree absolute';
    tree.style.left = xPosition + 'px';
    tree.style.bottom = '0';
    tree.style.zIndex = '5';
    tree.innerHTML = `
      <div class="relative" style="height: ${height}px">
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 ${isLarge ? 'w-5 h-20' : 'w-4 h-16'} bg-amber-800 dark:bg-amber-900 rounded-sm"></div>
        <div class="absolute ${isLarge ? 'bottom-14' : 'bottom-10'} left-1/2 -translate-x-1/2">
          <div class="${isLarge ? 'w-24 h-24' : 'w-20 h-20'} bg-green-600 dark:bg-green-800 rounded-full"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 ${isLarge ? 'w-18 h-18' : 'w-16 h-16'} bg-green-500 dark:bg-green-700 rounded-full"></div>
        </div>
      </div>
    `;
    
    document.getElementById('treesContainer').appendChild(tree);
    this.trees.push({ element: tree, x: xPosition });
    console.log('Tree created at x:', xPosition, 'Total trees:', this.trees.length);
  }
  
  createRock(xPosition) {
    const rock = document.createElement('div');
    const size = 20 + Math.random() * 30; // 20-50px
    const rotation = (Math.random() - 0.5) * 60; // -30 to 30 degrees
    const hasHighlight = Math.random() > 0.5;
    
    rock.className = 'rock absolute';
    rock.style.left = xPosition + 'px';
    rock.style.bottom = '0';
    rock.innerHTML = `
      <div class="relative">
        <div class="bg-gradient-to-br from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 rounded-full shadow-lg" style="width: ${size}px; height: ${size * 0.7}px; transform: rotate(${rotation}deg)"></div>
        ${hasHighlight ? `<div class="absolute top-1 left-1 w-3 h-2 bg-gray-400/50 dark:bg-gray-500/50 rounded-full"></div>` : ''}
      </div>
    `;
    
    document.getElementById('rocksContainer').appendChild(rock);
    this.rocks.push({ element: rock, x: xPosition });
  }
  
  createJobCard(milestone, xPosition, worldPosition = null) {
    const card = document.createElement('div');
    card.className = 'job-card absolute';
    card.style.left = xPosition + 'px';
    card.style.bottom = '40px';
    card.style.zIndex = '6';
    card.style.imageRendering = 'pixelated';
    
    // Create 8-bit style card
    card.innerHTML = `
      <div class="relative" style="width: 280px; animation: cardFloat 3s ease-in-out infinite;">
        <!-- 8-bit border frame -->
        <div class="absolute inset-0 bg-gray-900 dark:bg-gray-100" style="clip-path: polygon(
          0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px,
          100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%,
          8px calc(100% - 8px), 0 calc(100% - 8px)
        );"></div>
        
        <!-- Inner content -->
        <div class="relative bg-white dark:bg-gray-800 m-2 p-4" style="
          clip-path: polygon(
            0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px,
            100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%,
            6px calc(100% - 6px), 0 calc(100% - 6px)
          );
          box-shadow: inset 4px 4px 0 rgba(0,0,0,0.2), inset -4px -4px 0 rgba(255,255,255,0.1);
        ">
          <!-- Logo/Icon section -->
          <div class="flex items-start gap-3 mb-3">
            ${milestone.logo ? `
              <img src="${milestone.logo}" alt="${milestone.company}" 
                class="w-12 h-12 object-cover border-2 border-gray-900 dark:border-gray-100" 
                style="image-rendering: pixelated; image-rendering: crisp-edges;" />
            ` : `
              <div class="w-12 h-12 bg-indigo-600 border-2 border-gray-900 dark:border-gray-100 flex items-center justify-center">
                <span class="text-white text-xl font-bold" style="font-family: 'Courier New', monospace;">${milestone.company.charAt(0)}</span>
              </div>
            `}
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-yellow-500 mb-1" style="font-family: 'Courier New', monospace; text-shadow: 2px 2px 0 rgba(0,0,0,0.3);">${milestone.year}</div>
              <div class="text-sm font-bold text-gray-900 dark:text-white truncate" style="font-family: 'Courier New', monospace;">${milestone.company}</div>
            </div>
          </div>
          
          <!-- Job title with 8-bit style -->
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight" style="font-family: 'Courier New', monospace;">
            ${milestone.title}
          </div>
          
          <!-- Location with pixel icon -->
          <div class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400" style="font-family: 'Courier New', monospace;">
            <span style="display: inline-block; width: 8px; height: 8px; background: currentColor;"></span>
            <span class="truncate">${milestone.location}</span>
          </div>
          
          <!-- 8-bit corner decorations -->
          <div class="absolute top-1 left-1 w-2 h-2 bg-yellow-400"></div>
          <div class="absolute top-1 right-1 w-2 h-2 bg-yellow-400"></div>
          <div class="absolute bottom-1 left-1 w-2 h-2 bg-yellow-400"></div>
          <div class="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400"></div>
        </div>
      </div>
    `;
    
    document.getElementById('jobCardsContainer').appendChild(card);
    
    // Physics properties
    return { 
      element: card, 
      x: xPosition, 
      worldPosition: worldPosition !== null ? worldPosition : this.manualDistanceTraveled,
      velocity: 0,
      acceleration: -0.5, // Negative to move left
      maxVelocity: -8,
      friction: 0.98,
      targetX: null,
      isDecelerating: false,
      isPermanent: false, // Will be set to true for world-spawned cards
      milestone: milestone,
      milestoneIndex: this.milestones.indexOf(milestone)
    };
  }
  
  showWelcomeCard() {
    const containerWidth = this.gameContainer.offsetWidth;
    const characterX = containerWidth * (this.characterPositionPercent / 100);
    const cardWidth = 300;
    const xPosition = characterX + cardWidth + 20;
    
    const card = document.createElement('div');
    card.id = 'welcomeCard';
    card.className = 'job-card absolute';
    card.style.left = xPosition + 'px';
    card.style.bottom = '40px';
    card.style.zIndex = '6';
    card.style.imageRendering = 'pixelated';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    
    card.innerHTML = `
      <div class="relative" style="width: 280px; animation: cardFloat 3s ease-in-out infinite;">
        <!-- 8-bit border frame -->
        <div class="absolute inset-0 bg-gray-900 dark:bg-gray-100" style="clip-path: polygon(
          0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px,
          100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%,
          8px calc(100% - 8px), 0 calc(100% - 8px)
        );"></div>
        
        <!-- Inner content -->
        <div class="relative bg-white dark:bg-gray-800 m-2 p-4" style="
          clip-path: polygon(
            0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px,
            100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%,
            6px calc(100% - 6px), 0 calc(100% - 6px)
          );
          box-shadow: inset 4px 4px 0 rgba(0,0,0,0.2), inset -4px -4px 0 rgba(255,255,255,0.1);
        ">
          <!-- Welcome Icon -->
          <div class="flex items-start gap-3 mb-3">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-gray-900 dark:border-gray-100 flex items-center justify-center">
              <span class="text-white text-2xl" style="font-family: 'Courier New', monospace;">🎮</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-gray-900 dark:text-white" style="font-family: 'Courier New', monospace;">Welcome!</div>
              <div class="text-xs text-yellow-500 font-bold" style="font-family: 'Courier New', monospace; text-shadow: 2px 2px 0 rgba(0,0,0,0.3);">Career Journey</div>
            </div>
          </div>
          
          <!-- Instructions -->
          <div class="text-xs text-gray-700 dark:text-gray-300 mb-2 leading-relaxed" style="font-family: 'Courier New', monospace;">
            <div class="mb-2">🕹️ Use the NES controller below to navigate:</div>
            <div class="ml-3 space-y-1">
              <div>• D-Pad ←→: Move character</div>
              <div>• START: Begin journey</div>
              <div>• A: Next milestone</div>
              <div>• B: Reset</div>
              <div>• Port buttons: Adjust speed</div>
            </div>
          </div>
          
          <!-- Call to action -->
          <div class="text-center mt-3 text-xs font-bold text-purple-600 dark:text-purple-400" style="font-family: 'Courier New', monospace;">
            Press START to begin!
          </div>
          
          <!-- 8-bit corner decorations -->
          <div class="absolute top-1 left-1 w-2 h-2 bg-purple-400"></div>
          <div class="absolute top-1 right-1 w-2 h-2 bg-purple-400"></div>
          <div class="absolute bottom-1 left-1 w-2 h-2 bg-purple-400"></div>
          <div class="absolute bottom-1 right-1 w-2 h-2 bg-purple-400"></div>
        </div>
      </div>
    `;
    
    document.getElementById('jobCardsContainer').appendChild(card);
    this.welcomeCard = card;
  }
  
  dismissWelcomeCard() {
    if (this.welcomeCard && !this.welcomeCardDismissed) {
      this.welcomeCardDismissed = true;
      this.welcomeCard.style.opacity = '0';
      this.welcomeCard.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (this.welcomeCard && this.welcomeCard.parentNode) {
          this.welcomeCard.remove();
          this.welcomeCard = null;
        }
      }, 500);
    }
  }
  
  renderTimelinePoints() {
    const container = document.getElementById('timelinePoints');
    const worldWidth = container.offsetWidth;
    
    // Space points evenly to match logos
    const spacing = worldWidth / (this.milestones.length + 1);
    
    this.milestones.forEach((milestone, index) => {
      // Store world position for each milestone
      milestone.worldX = spacing * (index + 1);
      
      const point = document.createElement('div');
      point.className = 'absolute';
      point.style.left = `${spacing * (index + 1)}px`;
      
      point.innerHTML = `
        <div class="relative group cursor-pointer">
          <div class="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-1 border-3 border-white dark:border-gray-700 shadow-xl transition-all group-hover:scale-150 group-hover:rotate-180 duration-300" id="point-${index}"></div>
          <div class="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-2xl border-2 border-gray-200 dark:border-gray-700 min-w-[200px] z-50">
            <div class="font-bold text-gray-900 dark:text-white">${milestone.title}</div>
            <div class="text-[10px] text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              ${milestone.location}
            </div>
            <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-gray-200 dark:border-gray-700"></div>
          </div>
          <div class="text-xs font-bold text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">${milestone.year}</div>
        </div>
      `;
      
      container.appendChild(point);
    });
  }
  
  setupControls() {
    // Controls are now handled by the joystick controller
    // This method is kept for potential future use
    console.log('Timeline controls initialized (using joystick controller)');
  }
  
  goToNextMilestone() {
    if (this.currentMilestone < this.milestones.length) {
      const milestone = this.milestones[this.currentMilestone];
      console.log('Going to milestone:', milestone.title);
      
      // Dismiss welcome card when auto journey starts
      this.dismissWelcomeCard();
      
      // Start animations
      this.isScrolling = true;
      this.journeyStartTime = Date.now();
      this.journeyDuration = 3000 / this.speeds[this.currentSpeed].value; // 3 seconds base duration
      
      // Start character walking animation
      this.character.startWalking();
      
      this.currentMilestone++;
    }
  }
  
  updateProgress() {
    const progressBar = document.getElementById('progressBar');
    // Calculate progress based on distance traveled
    const milestoneInterval = 800;
    const totalDistance = this.milestones.length * milestoneInterval;
    const progress = Math.min(100, Math.max(0, (this.manualDistanceTraveled / totalDistance) * 100));
    progressBar.style.width = progress + '%';
  }
  
  highlightEvent(index) {
    const milestone = this.milestones[index];
    
    // Highlight the point with a permanent green color
    const point = document.getElementById(`point-${index}`);
    if (point) {
      point.classList.remove('from-yellow-400', 'to-orange-500');
      point.classList.add('from-green-400', 'to-emerald-500', 'scale-125', 'ring-4', 'ring-green-300');
      setTimeout(() => {
        point.classList.remove('scale-125');
      }, 500);
    }
    
    console.log(`Reached milestone: ${milestone.title}`);
  }
  
  reset() {
    this.character.standStill();
    this.currentMilestone = 0;
    this.isScrolling = false;
    this.totalDistance = 0;
    this.nextCloudX = 0;
    this.nextTreeX = 0;
    this.nextRockX = 0;
    this.manualDistanceTraveled = 0;
    this.visitedMilestones.clear();
    this.welcomeCardDismissed = false;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';
    
    // Remove all dynamically generated elements
    this.clouds.forEach(cloud => cloud.element.remove());
    this.clouds = [];
    
    this.trees.forEach(tree => tree.element.remove());
    this.trees = [];
    
    this.rocks.forEach(rock => rock.element.remove());
    this.rocks = [];
    
    this.jobCards.forEach(card => {
      if (card && card.element && card.element.parentNode) {
        card.element.remove();
      }
    });
    this.jobCards = [];
    this.currentJobCard = null;
    
    if (this.welcomeCard && this.welcomeCard.parentNode) {
      this.welcomeCard.remove();
      this.welcomeCard = null;
    }
    
    // Respawn initial elements
    this.spawnInitialElements();
    this.spawnAllJobCards();
    this.showWelcomeCard();
    
    // Reset timeline points
    const points = document.querySelectorAll('#timelinePoints > div');
    points.forEach(point => {
      point.style.transform = 'translateX(0px)';
    });
    
    // Reset all milestone points
    this.milestones.forEach((_, index) => {
      const point = document.getElementById(`point-${index}`);
      if (point) {
        point.classList.remove('bg-green-500', 'from-green-400', 'to-emerald-500', 'ring-4', 'ring-green-300');
        point.classList.add('from-yellow-400', 'to-orange-500');
      }
    });
  }
  
  animate() {
    this.character.update();
    
    // Manual character movement
    if (this.isManualMode && (this.movingLeft || this.movingRight)) {
      const currentSpeedMultiplier = this.speeds[this.currentSpeed].value;
      const speed = (this.movingRight ? this.baseManualSpeed : -this.baseManualSpeed) * currentSpeedMultiplier;
      this.updateManualMovement(speed);
    }
    
    // Update job card physics (but don't stop character in manual mode)
    if (this.currentJobCard) {
      this.updateJobCardPhysics(!this.isManualMode); // Pass flag to control stopping
    }
    
    if (this.isScrolling) {
      this.updateInfiniteElements();
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  updateManualMovement(speed) {
    const containerWidth = this.gameContainer.offsetWidth;
    
    // Track distance traveled (can go backward)
    if (this.movingRight) {
      this.manualDistanceTraveled += Math.abs(speed);
    } else if (this.movingLeft) {
      this.manualDistanceTraveled = Math.max(0, this.manualDistanceTraveled - Math.abs(speed));
    }
    
    // Update progress bar based on current position
    this.updateProgress();
    
    // Check if we've reached any milestone distances
    this.checkMilestoneProximity();
    
    // Move all elements (clouds, trees, rocks) to create movement effect
    // When moving right (forward), world moves left (negative)
    // When moving left (backward), world moves right (positive)
    for (let cloud of this.clouds) {
      cloud.x -= speed * 0.3; // Slower for parallax
      cloud.element.style.left = cloud.x + 'px';
      
      // Wrap around if off screen
      if (cloud.x < -100) {
        cloud.x = containerWidth + 100;
      } else if (cloud.x > containerWidth + 100) {
        cloud.x = -100;
      }
    }
    
    for (let tree of this.trees) {
      tree.x -= speed;
      tree.element.style.left = tree.x + 'px';
      
      // Wrap around if off screen
      if (tree.x < -100) {
        tree.x = containerWidth + 100;
      } else if (tree.x > containerWidth + 100) {
        tree.x = -100;
      }
    }
    
    for (let rock of this.rocks) {
      rock.x -= speed;
      rock.element.style.left = rock.x + 'px';
      
      // Wrap around if off screen
      if (rock.x < -50) {
        rock.x = containerWidth + 50;
      } else if (rock.x > containerWidth + 50) {
        rock.x = -50;
      }
    }
    
    // Move job cards with character movement
    for (let jobCard of this.jobCards) {
      if (jobCard && jobCard.element && jobCard.element.parentNode) {
        jobCard.x -= speed;
        jobCard.element.style.left = jobCard.x + 'px';
      }
    }
    
    // Spawn new elements if needed
    if (this.movingRight) {
      // Moving forward - spawn on the right
      if (this.clouds.length < 5 && Math.random() < 0.02) {
        this.createCloud(containerWidth + 100);
      }
      if (this.trees.length < 3 && Math.random() < 0.015) {
        this.createTree(containerWidth + 100);
      }
      if (this.rocks.length < 4 && Math.random() < 0.03) {
        this.createRock(containerWidth + 50);
      }
    } else if (this.movingLeft) {
      // Moving backward - spawn on the left
      if (this.clouds.length < 5 && Math.random() < 0.02) {
        this.createCloud(-100);
      }
      if (this.trees.length < 3 && Math.random() < 0.015) {
        this.createTree(-100);
      }
      if (this.rocks.length < 4 && Math.random() < 0.03) {
        this.createRock(-50);
      }
    }
  }
  
  checkMilestoneProximity() {
    // Calculate milestone intervals based on distance traveled
    const milestoneInterval = 800; // Distance between milestones
    
    // Check each milestone for highlighting when character passes
    for (let i = 0; i < this.milestones.length; i++) {
      const milestoneDistance = (i + 1) * milestoneInterval;
      const distanceToMilestone = this.manualDistanceTraveled - milestoneDistance;
      
      // If we're close to a milestone and haven't visited it yet (moving forward)
      if (distanceToMilestone >= 0 && distanceToMilestone < 50 && !this.visitedMilestones.has(i)) {
        this.visitedMilestones.add(i);
        this.highlightEvent(i);
      }
      
      // If moving backward, check if we've moved away from a milestone
      if (this.movingLeft && this.visitedMilestones.has(i)) {
        // If we're now significantly before this milestone, unmark it as visited
        if (this.manualDistanceTraveled < milestoneDistance - 100) {
          this.visitedMilestones.delete(i);
          // Remove the highlight from the point
          const point = document.getElementById(`point-${i}`);
          if (point) {
            point.classList.remove('from-green-400', 'to-emerald-500', 'ring-4', 'ring-green-300');
            point.classList.add('from-yellow-400', 'to-orange-500');
          }
        }
      }
    }
  }
  
  triggerMilestoneCard(milestoneIndex) {
    // Cards already exist in the world, this method is kept for compatibility
    const milestone = this.milestones[milestoneIndex];
    console.log('Reached milestone:', milestone.title);
    
    // Highlight the milestone
    this.highlightEvent(milestoneIndex);
    
    // Update progress
    if (milestoneIndex + 1 > this.currentMilestone) {
      this.currentMilestone = milestoneIndex + 1;
      this.updateProgress();
    }
  }
  
  updateJobCardPhysics(shouldStopCharacter = true) {
    const card = this.currentJobCard;
    const containerWidth = this.gameContainer.offsetWidth;
    const characterX = containerWidth * (this.characterPositionPercent / 100);
    const cardWidth = 300;
    
    // Calculate distance to character
    const distanceToCharacter = card.x - characterX;
    const stoppingDistance = cardWidth + 50; // Stop when card is near character
    
    // Deceleration logic: start slowing down when approaching character
    if (distanceToCharacter < stoppingDistance * 2 && !card.isDecelerating) {
      card.isDecelerating = true;
      card.targetX = characterX + cardWidth + 20; // Target position next to character
    }
    
    if (card.isDecelerating) {
      // Smooth deceleration toward target
      const dx = card.targetX - card.x;
      const distance = Math.abs(dx);
      
      if (distance > 1) {
        // Ease-out motion: slower as it gets closer
        card.velocity = dx * 0.08; // Smooth spring-like motion
        card.x += card.velocity;
      } else {
        // Snap to final position and complete milestone
        card.x = card.targetX;
        card.velocity = 0;
        
        // Only stop character and scrolling if not in manual mode
        if (shouldStopCharacter) {
          this.isScrolling = false;
          this.character.stopWalking();
        }
        
        this.highlightEvent(this.currentMilestone - 1);
        this.updateProgress();
        this.currentJobCard = null; // Clear reference
      }
    } else {
      // Acceleration phase: speed up from start
      if (Math.abs(card.velocity) < Math.abs(card.maxVelocity)) {
        card.velocity += card.acceleration;
      }
      card.x += card.velocity;
    }
    
    // Update DOM
    card.element.style.left = card.x + 'px';
  }
  
  updateInfiniteElements() {
    const speed = this.speeds[this.currentSpeed].value * 3; // Reduced multiplier from 5 to 3
    this.totalDistance += speed;
    const containerWidth = this.gameContainer.offsetWidth;
    
    // Move and clean up clouds
    for (let i = this.clouds.length - 1; i >= 0; i--) {
      const cloud = this.clouds[i];
      cloud.x -= speed * 0.3; // Slower for parallax
      cloud.element.style.left = cloud.x + 'px';
      
      // Remove if off screen
      if (cloud.x < -100) {
        cloud.element.remove();
        this.clouds.splice(i, 1);
      }
    }
    
    // Move and clean up trees
    for (let i = this.trees.length - 1; i >= 0; i--) {
      const tree = this.trees[i];
      tree.x -= speed;
      tree.element.style.left = tree.x + 'px';
      
      // Remove if off screen
      if (tree.x < -100) {
        tree.element.remove();
        this.trees.splice(i, 1);
      }
    }
    
    // Spawn new clouds (max 5 on screen)
    if (this.clouds.length < 5) {
      const spawnX = containerWidth + 100;
      if (this.totalDistance > this.nextCloudX) {
        this.createCloud(spawnX);
        this.nextCloudX = this.totalDistance + 300 + Math.random() * 500;
      }
    }
    
    // Spawn new trees (max 2 on screen)
    if (this.trees.length < 2) {
      // Spawn trees from the right edge of the screen
      const spawnX = containerWidth + 100;
      if (this.totalDistance > this.nextTreeX) {
        this.createTree(spawnX);
        this.nextTreeX = this.totalDistance + 600 + Math.random() * 800;
      }
    }
    
    // Move and clean up rocks
    for (let i = this.rocks.length - 1; i >= 0; i--) {
      const rock = this.rocks[i];
      rock.x -= speed;
      rock.element.style.left = rock.x + 'px';
      
      // Remove if off screen
      if (rock.x < -50) {
        rock.element.remove();
        this.rocks.splice(i, 1);
      }
    }
    
    // Spawn new rocks (max 4 on screen)
    if (this.rocks.length < 4) {
      const spawnX = containerWidth + 50;
      if (this.totalDistance > this.nextRockX) {
        this.createRock(spawnX);
        this.nextRockX = this.totalDistance + 200 + Math.random() * 400;
      }
    }
  }

}

// Initialize when page loads
window.addEventListener('load', () => {
  const timeline = new Timeline();
  
  // Listen for joystick controller events
  document.addEventListener('timelineControl', (e) => {
    const action = e.detail.action;
    console.log('Joystick action:', action);
    
    switch(action) {
      case 'start':
      case 'toggle':
        // Start/Continue journey (same as Start button)
        if (timeline.currentMilestone < timeline.milestones.length) {
          timeline.goToNextMilestone();
        } else {
          timeline.reset();
          timeline.goToNextMilestone();
        }
        break;
        
      case 'reset':
        // Reset timeline (same as Reset button)
        timeline.reset();
        break;
        
      case 'speed':
        // Toggle speed (same as Speed button)
        timeline.currentSpeed = (timeline.currentSpeed + 1) % timeline.speeds.length;
        const speed = timeline.speeds[timeline.currentSpeed];
        const speedText = document.getElementById('speedText');
        if (speedText) {
          speedText.textContent = `Speed: ${speed.name}`;
        }
        break;
        
      case 'speed-up':
        // Increase speed
        if (timeline.currentSpeed < timeline.speeds.length - 1) {
          timeline.currentSpeed++;
          const speed = timeline.speeds[timeline.currentSpeed];
          const speedText = document.getElementById('speedText');
          if (speedText) {
            speedText.textContent = `Speed: ${speed.name}`;
          }
          console.log('Speed increased to:', speed.name);
        }
        break;
        
      case 'speed-down':
        // Decrease speed
        if (timeline.currentSpeed > 0) {
          timeline.currentSpeed--;
          const speed = timeline.speeds[timeline.currentSpeed];
          const speedText = document.getElementById('speedText');
          if (speedText) {
            speedText.textContent = `Speed: ${speed.name}`;
          }
          console.log('Speed decreased to:', speed.name);
        }
        break;
        
      case 'forward':
        // Fast forward or skip to next milestone
        if (timeline.currentMilestone < timeline.milestones.length && !timeline.isScrolling) {
          timeline.goToNextMilestone();
        }
        break;
        
      case 'rewind':
        // Go back to previous milestone (reset for now)
        if (timeline.currentMilestone > 0) {
          timeline.reset();
        }
        break;
    }
  });
});
