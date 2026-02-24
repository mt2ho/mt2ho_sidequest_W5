class Camera2D {
  constructor(viewW, viewH) {
    this.viewW = viewW;
    this.viewH = viewH;
    this.x = 0;
    this.y = 0;
  }

  followSideScrollerX(targetX, targetvx, lerpAmt) {
    const lookAhead = targetvx * 75; // how far camera anticipates
    // soften stop — camera keeps drifting forward

    const desired = targetX - this.viewW / 2 + lookAhead;
    this.x = lerp(this.x, desired, lerpAmt * 0.2, 5);
  }
  followSideScrollerY(targetY, targetvy, lerpAmt) {
    const lookAhead = targetvy * 50;
    const desired = targetY - this.viewH / 2 + lookAhead - 54;
    this.y = lerp(this.y, desired, lerpAmt * 0.1);
  }

  clampToWorld(worldW, worldH) {
    const maxX = max(0, worldW - this.viewW);
    const maxY = max(0, worldH - this.viewH);
    this.x = constrain(this.x, 0, maxX);
    this.y = constrain(this.y, -150, maxY);
  }

  begin() {
    push();
    translate(-this.x, -this.y);
  }
  end() {
    pop();
  }
}
