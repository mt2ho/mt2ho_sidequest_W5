class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = Object.assign(
      { bg: "#F0F0F0", platform: "#C8C8C8", blob: "#008080" },
      levelJson.theme ?? {},
    );

    // Physics knobs
    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;

    // Camera knob (data-driven view state)
    this.camLerp = levelJson.camera?.lerp ?? 0.5;

    // World size + death line
    this.w = levelJson.world?.w ?? 2400;
    this.h = levelJson.world?.h ?? 360;
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    // Start
    this.start = Object.assign({ x: 80, y: 220, r: 26 }, levelJson.start ?? {});

    // Platforms
    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h, p.color),
    );
    // bubbles
    this.bubbles = [];
    this.symbols = levelJson.symbols ?? [];
    this.discovered = new Set(); // keeps track of which symbols the player has touched
  }

  drawWorld() {
    // horiztonal colour
    const progress = constrain(player.x / this.w, 0, 1);
    const startCol = color(255); // grey beginning
    const endCol = color(this.theme.bg);
    const bgCol = lerpColor(startCol, endCol, progress);

    // vertical underwater fade
    const vertProgress = constrain((player.y - 400) / 400, 0, 1);
    const waterCol = lerpColor(bgCol, color(63, 72, 104), vertProgress);

    //  only call background ONCE
    background(waterCol);

    push();
    rectMode(CORNER); // critical: undo any global rectMode(CENTER) [web:230]
    noStroke();

    for (const p of this.platforms) {
      if (p.color) fill(p.color);
      else fill(this.theme.platform);

      rect(p.x, p.y, p.w, p.h);

      if (player.x > 1500) {
        const bubbleAreaTop = 500; // top of visible bubble area

        for (let i = 0; i < 30; i++) {
          let bubbleX = 1500 + i * 50; // adjust spacing
          // vertical position for continuous looping
          let bubbleY = 1500 - ((frameCount * 0.8 + i * 40) % 700);
          // gentle sideways drift
          bubbleX += sin(frameCount * 0.02 + i) * 15;

          // detect orb collection
          for (let i = 0; i < level.symbols.length; i++) {
            const s = level.symbols[i];

            // scircular collision
            const d = dist(player.x, player.y, s.x, s.y);
            if (d < player.r + s.r) {
              level.discovered.add(i); // mark orb as collected
            }
          }

          // draw symbols to be discovered//
          for (let i = 0; i < this.symbols.length; i++) {
            const s = this.symbols[i];
            if (this.discovered.has(i)) {
              fill(100, 255, 200, 180); // collected effect
            } else {
              fill(255, 200, 0, 180); // default orb color
            }
            noStroke();
            ellipse(s.x, s.y, s.r * 2);
          }

          // draw bubble
          fill(255, 255, 255, 40);
          noStroke();
          ellipse(bubbleX, bubbleY, 20, 20);
        }
      }
    }

    textSize(20);
    fill(0, 128, 128); // teal
    stroke(0, 120); // outline so it's readable
    strokeWeight(2);
    text("Drop down here ↓", 1500, 300); // x=1500, y=450 in world coordinates
    pop();
  }
}
