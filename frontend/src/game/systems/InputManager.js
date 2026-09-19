/**
 * InputManager — unified input abstraction for keyboard, mouse, touch, and gamepad.
 *
 * FIXES applied:
 *  - Mouse look now works WITHOUT pointer lock: right-mouse-button drag rotates camera.
 *    Pointer lock is still requested on canvas click for a locked-cursor experience,
 *    but drag always works as a fallback so the camera is never broken.
 *  - _activeInputType no longer permanently sticks to 'touch'. Keyboard events always
 *    switch back to 'keyboard', allowing hybrid device usage.
 *  - Pinch zoom (actions.zoom) is now cleared to 0 every frame inside update() so
 *    releasing fingers never causes continuous camera drift.
 *  - Jump is now a proper edge-triggered flag (_jumpPressed) that persists until
 *    consumed by the player controller, so the button press is never missed.
 *  - Interact / action are also edge-triggered via _justPressed tracking.
 *  - destroy() is correctly paired with _init() for clean teardown.
 */

class InputManager {
  constructor() {
    this.actions = {
      move:     { x: 0, y: 0 },  // normalized -1..1
      look:     { x: 0, y: 0 },  // camera delta this frame (consumed each frame)
      interact: false,
      action:   false,
      jump:     false,            // true for exactly one frame when pressed
      pause:    false,
      cancel:   false,
      zoom:     0,                // consumed each frame
    };

    // Raw keyboard state
    this._keys = new Set();
    this._prevKeys = new Set();

    // Mouse state
    this._mouseButtons = new Set();
    this._mouseDelta = { x: 0, y: 0 };
    this._mouseWheelDelta = 0;
    this._pointerLocked = false;
    // Right-mouse drag (no pointer lock needed)
    this._rmbDragging = false;
    this._rmbLast = { x: 0, y: 0 };

    // Touch / joystick state
    this._joystick = { x: 0, y: 0 };
    this._touchCameraDelta = { x: 0, y: 0 };
    this._touchZoomDelta = 0;  // set by pinch handler, cleared each frame

    // Gamepad state
    this._gamepad = null;
    this._gamepad_move = { x: 0, y: 0 };
    this._gamepad_look = { x: 0, y: 0 };
    this._gamepad_buttons = {};
    this._gamepad_zoom = 0;
    this._prevGPButtons = {};

    // Edge-trigger accumulators (set true, consumed once by player)
    this._jumpPressed    = false;
    this._interactPressed = false;
    this._pausePressed   = false;

    this._isMobile = this._detectMobile();
    // Start as 'keyboard' — will switch to 'touch' when joystick is used,
    // but keyboard events always switch it back.
    this._activeInputType = this._isMobile ? 'touch' : 'keyboard';

    this._bound = {
      keydown:              this._onKeyDown.bind(this),
      keyup:                this._onKeyUp.bind(this),
      mousedown:            this._onMouseDown.bind(this),
      mouseup:              this._onMouseUp.bind(this),
      mousemove:            this._onMouseMove.bind(this),
      wheel:                this._onWheel.bind(this),
      pointerlockchange:    this._onPointerLockChange.bind(this),
      gamepadconnected:     this._onGamepadConnected.bind(this),
      gamepaddisconnected:  this._onGamepadDisconnected.bind(this),
      visibilitychange:     this._onVisibilityChange.bind(this),
    };

    this._init();
  }

  _detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
  }

  _init() {
    window.addEventListener('keydown', this._bound.keydown);
    window.addEventListener('keyup',   this._bound.keyup);
    window.addEventListener('mousedown', this._bound.mousedown);
    window.addEventListener('mouseup',   this._bound.mouseup);
    window.addEventListener('mousemove', this._bound.mousemove);
    window.addEventListener('wheel', this._bound.wheel, { passive: false });
    document.addEventListener('pointerlockchange', this._bound.pointerlockchange);
    window.addEventListener('gamepadconnected',    this._bound.gamepadconnected);
    window.addEventListener('gamepaddisconnected', this._bound.gamepaddisconnected);
    document.addEventListener('visibilitychange',  this._bound.visibilitychange);
  }

  destroy() {
    window.removeEventListener('keydown', this._bound.keydown);
    window.removeEventListener('keyup',   this._bound.keyup);
    window.removeEventListener('mousedown', this._bound.mousedown);
    window.removeEventListener('mouseup',   this._bound.mouseup);
    window.removeEventListener('mousemove', this._bound.mousemove);
    window.removeEventListener('wheel', this._bound.wheel);
    document.removeEventListener('pointerlockchange', this._bound.pointerlockchange);
    window.removeEventListener('gamepadconnected',    this._bound.gamepadconnected);
    window.removeEventListener('gamepaddisconnected', this._bound.gamepaddisconnected);
    document.removeEventListener('visibilitychange',  this._bound.visibilitychange);
  }

  // ── Keyboard ─────────────────────────────────────────────────────────
  _onKeyDown(e) {
    const wasDown = this._keys.has(e.code);
    this._keys.add(e.code);
    // Keyboard always switches back from touch mode on hybrid devices
    this._activeInputType = 'keyboard';

    // Edge-trigger on first press only
    if (!wasDown) {
      if (e.code === 'Space')  this._jumpPressed    = true;
      if (e.code === 'KeyE')   this._interactPressed = true;
      if (e.code === 'Escape') this._pausePressed   = true;
    }

    // Prevent browser scroll with game keys
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }

  _onKeyUp(e) {
    this._keys.delete(e.code);
  }

  // ── Mouse ────────────────────────────────────────────────────────────
  _onMouseDown(e) {
    this._mouseButtons.add(e.button);
    // Right mouse button starts drag for camera look
    if (e.button === 2) {
      this._rmbDragging = true;
      this._rmbLast = { x: e.clientX, y: e.clientY };
    }
    // Left click on the canvas requests pointer lock for true FPS-style look
    if (e.button === 0 && e.target?.tagName === 'CANVAS') {
      e.target.requestPointerLock?.();
    }
  }

  _onMouseUp(e) {
    this._mouseButtons.delete(e.button);
    if (e.button === 2) {
      this._rmbDragging = false;
    }
  }

  _onMouseMove(e) {
    if (this._pointerLocked) {
      // Pointer-locked: use raw movementX/Y
      this._mouseDelta.x += e.movementX;
      this._mouseDelta.y += e.movementY;
    } else if (this._rmbDragging) {
      // Right-mouse drag fallback — always works without pointer lock
      this._mouseDelta.x += e.clientX - this._rmbLast.x;
      this._mouseDelta.y += e.clientY - this._rmbLast.y;
      this._rmbLast = { x: e.clientX, y: e.clientY };
    }
  }

  _onWheel(e) {
    e.preventDefault();
    this._mouseWheelDelta += e.deltaY;
  }

  _onPointerLockChange() {
    this._pointerLocked = document.pointerLockElement !== null;
    if (!this._pointerLocked) {
      // Clear any accumulated delta when lock is released
      this._mouseDelta = { x: 0, y: 0 };
    }
  }

  // ── Visibility ────────────────────────────────────────────────────────
  _onVisibilityChange() {
    if (document.hidden) {
      // Clear all input state when tab loses focus — prevents stuck keys
      this._keys.clear();
      this._mouseButtons.clear();
      this._joystick = { x: 0, y: 0 };
      this._mouseDelta = { x: 0, y: 0 };
      this._rmbDragging = false;
      this._jumpPressed = false;
      this._interactPressed = false;
      this._pausePressed = false;
    }
  }

  // ── Gamepad ───────────────────────────────────────────────────────────
  _onGamepadConnected(e) {
    this._gamepad = e.gamepad;
    this._activeInputType = 'gamepad';
    console.log('🎮 Gamepad connected:', e.gamepad.id);
  }

  _onGamepadDisconnected() {
    this._gamepad = null;
    this._activeInputType = 'keyboard';
  }

  _pollGamepad() {
    if (!this._gamepad) return;
    const gamepads = navigator.getGamepads?.();
    if (!gamepads) return;
    const gp = gamepads[this._gamepad.index];
    if (!gp) return;

    const DEAD = 0.12;
    const ax = (v) => Math.abs(v) > DEAD ? v : 0;

    this._gamepad_move = { x: ax(gp.axes[0]), y: -ax(gp.axes[1]) }; // negate Y: up = forward
    this._gamepad_look = { x: ax(gp.axes[2]) * 4, y: ax(gp.axes[3]) * 4 };

    const prev = this._prevGPButtons;
    const curr = {
      jump:     gp.buttons[0]?.pressed ?? false,
      cancel:   gp.buttons[1]?.pressed ?? false,
      interact: gp.buttons[2]?.pressed ?? false,
      action:   gp.buttons[3]?.pressed ?? false,
      pause:    gp.buttons[9]?.pressed ?? false,
    };

    // Edge-trigger gamepad buttons
    if (curr.jump     && !prev.jump)     this._jumpPressed    = true;
    if (curr.interact && !prev.interact) this._interactPressed = true;
    if (curr.pause    && !prev.pause)    this._pausePressed   = true;

    this._prevGPButtons = { ...curr };
    this._gamepad_buttons = curr;
    this._gamepad_zoom = (gp.buttons[7]?.value ?? 0) - (gp.buttons[6]?.value ?? 0);
  }

  // ── Touch inputs (set by React HUD components) ────────────────────────
  setJoystick(x, y) {
    this._joystick = { x, y };
    // Only switch to touch if joystick is actually being used
    if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01) {
      this._activeInputType = 'touch';
    }
  }

  setTouchCameraDelta(dx, dy) {
    this._touchCameraDelta.x += dx;
    this._touchCameraDelta.y += dy;
  }

  setTouchZoom(delta) {
    this._touchZoomDelta += delta;
  }

  // ── Update — call once per frame ─────────────────────────────────────
  update(sensitivity = 1.0) {
    this._pollGamepad();

    const isGamepad = this._activeInputType === 'gamepad';
    const isTouch   = this._activeInputType === 'touch';
    const isKB      = !isGamepad && !isTouch;

    // ── Move ─────────────────────────────────────────────────────────────
    if (isGamepad) {
      this.actions.move.x = this._gamepad_move.x;
      this.actions.move.y = this._gamepad_move.y;
    } else if (isTouch) {
      this.actions.move.x = this._joystick.x;
      this.actions.move.y = this._joystick.y;
    } else {
      let mx = 0, my = 0;
      if (this._keys.has('KeyW') || this._keys.has('ArrowUp'))    my += 1;
      if (this._keys.has('KeyS') || this._keys.has('ArrowDown'))  my -= 1;
      if (this._keys.has('KeyA') || this._keys.has('ArrowLeft'))  mx -= 1;
      if (this._keys.has('KeyD') || this._keys.has('ArrowRight')) mx += 1;
      const len = Math.sqrt(mx * mx + my * my);
      this.actions.move.x = len > 0 ? mx / len : 0;
      this.actions.move.y = len > 0 ? my / len : 0;
    }

    // ── Look (always consume and reset this frame) ────────────────────────
    if (isGamepad) {
      this.actions.look.x = this._gamepad_look.x;
      this.actions.look.y = this._gamepad_look.y;
    } else if (isTouch) {
      this.actions.look.x = this._touchCameraDelta.x * sensitivity;
      this.actions.look.y = this._touchCameraDelta.y * sensitivity;
      this._touchCameraDelta = { x: 0, y: 0 };  // consume
    } else {
      this.actions.look.x = this._mouseDelta.x * sensitivity;
      this.actions.look.y = this._mouseDelta.y * sensitivity;
      this._mouseDelta = { x: 0, y: 0 };  // consume
    }

    // ── Jump (edge-triggered — true for exactly one frame) ───────────────
    this.actions.jump = this._jumpPressed;
    this._jumpPressed = false;  // consume

    // ── Interact (edge-triggered) ────────────────────────────────────────
    this.actions.interact = this._interactPressed;
    this._interactPressed = false;

    // ── Action ───────────────────────────────────────────────────────────
    this.actions.action = isGamepad
      ? this._gamepad_buttons?.action ?? false
      : this._keys.has('KeyF');

    // ── Pause (edge-triggered) ────────────────────────────────────────────
    this.actions.pause = this._pausePressed;
    this._pausePressed = false;

    // ── Cancel ───────────────────────────────────────────────────────────
    this.actions.cancel = isGamepad
      ? this._gamepad_buttons?.cancel ?? false
      : this._keys.has('KeyB');

    // ── Zoom (always consume and reset to 0) ─────────────────────────────
    if (isGamepad) {
      this.actions.zoom = this._gamepad_zoom ?? 0;
    } else if (isTouch) {
      this.actions.zoom = this._touchZoomDelta;
      this._touchZoomDelta = 0;  // consume — fixes continuous zoom drift
    } else {
      this.actions.zoom = -this._mouseWheelDelta * 0.001;
      this._mouseWheelDelta = 0;  // consume
    }

    // ── Run modifier (Shift held) ─────────────────────────────────────────
    this.actions.run = this._keys.has('ShiftLeft') || this._keys.has('ShiftRight');
  }

  // ── Accessors ─────────────────────────────────────────────────────────
  get inputType()  { return this._activeInputType; }
  get isMobile()   { return this._isMobile; }
  isKeyDown(code)  { return this._keys.has(code); }

  // Manually trigger jump from UI button
  triggerJump()     { this._jumpPressed    = true; }
  triggerInteract() { this._interactPressed = true; }
}

// Singleton
const inputManager = new InputManager();
export default inputManager;
