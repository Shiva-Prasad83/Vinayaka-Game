import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import inputManager from '../systems/InputManager';
import useGameStore from '../../store/useGameStore';

// Movement constants
const WALK_SPEED   = 4.0;
const RUN_SPEED    = 8.5;
const JUMP_FORCE   = 9.0;
const GRAVITY      = -22.0;
const DECEL_FACTOR = 0.04;   // pow base for friction
const ROT_SMOOTH   = 14;     // character rotation speed
const INTERACT_RANGE = 2.5;

// Reusable Vector3 to avoid per-frame allocations
const _camDir = new THREE.Vector3();

// ── Procedural Character Mesh ─────────────────────────────────────────────────
function CharacterMesh({ outfit = 0 }) {
  const OUTFIT_COLORS = ['#ff8c00', '#dc143c', '#9370db', '#2196f3', '#4caf50'];
  const SKIN  = '#d4956a';
  const cloth = OUTFIT_COLORS[outfit % OUTFIT_COLORS.length];

  return (
    <group name="body">
      {/* Torso */}
      <mesh name="torso" position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.36, 0.5, 0.22]} />
        <meshStandardMaterial color={cloth} roughness={0.6} />
      </mesh>
      {/* Head */}
      <mesh name="head" position={[0, 1.02, 0]} castShadow>
        <sphereGeometry args={[0.185, 14, 14]} />
        <meshStandardMaterial color={SKIN} roughness={0.5} />
      </mesh>
      {/* Eye L */}
      <mesh position={[0.065, 1.05, 0.165]}>
        <sphereGeometry args={[0.028, 7, 7]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Eye R */}
      <mesh position={[-0.065, 1.05, 0.165]}>
        <sphereGeometry args={[0.028, 7, 7]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Left arm */}
      <mesh name="armL" position={[-0.235, 0.67, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
        <meshStandardMaterial color={cloth} roughness={0.6} />
      </mesh>
      {/* Right arm */}
      <mesh name="armR" position={[0.235, 0.67, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.06, 0.28, 4, 8]} />
        <meshStandardMaterial color={cloth} roughness={0.6} />
      </mesh>
      {/* Left leg */}
      <mesh name="legL" position={[-0.105, 0.19, 0]} castShadow>
        <capsuleGeometry args={[0.068, 0.28, 4, 8]} />
        <meshStandardMaterial color="#5d3a1a" roughness={0.7} />
      </mesh>
      {/* Right leg */}
      <mesh name="legR" position={[0.105, 0.19, 0]} castShadow>
        <capsuleGeometry args={[0.068, 0.28, 4, 8]} />
        <meshStandardMaterial color="#5d3a1a" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ── Player ────────────────────────────────────────────────────────────────────
export default function PlayerCharacter({ onPositionUpdate }) {
  const groupRef        = useRef();
  const bodyRef         = useRef();    // ref to the 'body' group for animation
  const velocityRef     = useRef(new THREE.Vector3());
  const isGroundedRef   = useRef(true);
  const animTimeRef     = useRef(0);
  const facingAngleRef  = useRef(0);
  const prevNearbyRef   = useRef(null); // track last value to avoid Zustand write spam

  // Only subscribe to what we need to avoid re-rendering the Canvas component
  const outfit = useGameStore(s => s.character.outfit ?? 0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Read game state INSIDE frame loop — never stale
    const { screen, gameMode, settings } = useGameStore.getState();
    if (screen !== 'playing' && screen !== 'tutorial') return;
    if (gameMode === 'cinematic') return;

    // Cap delta to avoid huge jumps when tab regains focus
    const dt = Math.min(delta, 0.05);

    // Update input (reads keyboard/gamepad/touch into actions)
    inputManager.update(settings.controlSensitivity ?? 1.0);

    const { move, jump, run } = inputManager.actions;
    const moveLen = Math.sqrt(move.x * move.x + move.y * move.y);
    const isMoving = moveLen > 0.05;

    // ── Speed: walk / run ───────────────────────────────────────────────
    // Shift key OR large joystick push = run
    const wantsRun = run || moveLen > 0.65;
    const speed = wantsRun ? RUN_SPEED : WALK_SPEED;

    // ── Camera-relative movement direction ─────────────────────────────
    // We need the angle FROM camera TOWARD the player (i.e. camera-forward in world space).
    // camera.position - player.position  = vector pointing FROM player TO camera (backward).
    // We want the OPPOSITE (camera forward = player to camera flipped).
    // So: use (player - camera), which points FROM camera TOWARD player = camera forward.
    const camera = state.camera;
    _camDir.set(
      groupRef.current.position.x - camera.position.x,  // flip: now points AWAY from camera
      0,
      groupRef.current.position.z - camera.position.z
    ).normalize();
    // camYaw is now the angle the camera is looking (its forward direction on XZ plane)
    const camYaw = Math.atan2(_camDir.x, _camDir.z);

    if (isMoving) {
      // move.y = +1 means joystick UP = forward = along camera forward direction
      // move.x = +1 means joystick RIGHT = strafe right relative to camera
      const moveAngle  = Math.atan2(move.x, move.y);
      const worldAngle = camYaw + moveAngle;

      velocityRef.current.x = Math.sin(worldAngle) * speed * Math.min(moveLen, 1);
      velocityRef.current.z = Math.cos(worldAngle) * speed * Math.min(moveLen, 1);

      // Smooth character rotation — use shortest path
      const diff = ((worldAngle - facingAngleRef.current + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      facingAngleRef.current += diff * Math.min(1, ROT_SMOOTH * dt);
    } else {
      // Smooth deceleration — exponential decay, frame-rate independent
      velocityRef.current.x *= Math.pow(DECEL_FACTOR, dt);
      velocityRef.current.z *= Math.pow(DECEL_FACTOR, dt);
    }

    // ── Jump ────────────────────────────────────────────────────────────
    // actions.jump is now edge-triggered (true for exactly 1 frame)
    if (jump && isGroundedRef.current) {
      velocityRef.current.y = JUMP_FORCE;
      isGroundedRef.current = false;
    }

    // ── Gravity ─────────────────────────────────────────────────────────
    if (!isGroundedRef.current) {
      velocityRef.current.y += GRAVITY * dt;
    }

    // ── Apply velocity ───────────────────────────────────────────────────
    groupRef.current.position.x += velocityRef.current.x * dt;
    groupRef.current.position.y += velocityRef.current.y * dt;
    groupRef.current.position.z += velocityRef.current.z * dt;

    // ── Ground clamp ────────────────────────────────────────────────────
    if (groupRef.current.position.y <= 0) {
      groupRef.current.position.y = 0;
      velocityRef.current.y = 0;
      isGroundedRef.current = true;
    }

    // ── World boundary ──────────────────────────────────────────────────
    const BOUND = 38;
    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -BOUND, BOUND);
    groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -BOUND, BOUND);

    // ── Rotate character mesh ────────────────────────────────────────────
    groupRef.current.rotation.y = facingAngleRef.current;

    // ── Procedural animation ─────────────────────────────────────────────
    animTimeRef.current += dt;
    const t = animTimeRef.current;
    const body = groupRef.current.children[0]; // the 'body' group
    if (body) {
      if (isMoving) {
        const freq   = wantsRun ? 14 : 9;
        const swing  = Math.sin(t * freq) * (wantsRun ? 0.35 : 0.22);

        // Legs swing (children 6 & 7 of body group)
        const legL = body.children[6];
        const legR = body.children[7];
        if (legL) legL.rotation.x =  swing;
        if (legR) legR.rotation.x = -swing;

        // Arms swing opposite to legs
        const armL = body.children[4];
        const armR = body.children[5];
        if (armL) armL.rotation.x = -swing * 0.6;
        if (armR) armR.rotation.x =  swing * 0.6;

        // Subtle body bob
        body.position.y = Math.abs(Math.sin(t * freq * 0.5)) * 0.03;

        // Slight forward lean when running
        body.rotation.x = wantsRun ? -0.06 : 0;
      } else {
        // Idle breathing — reset all
        body.position.y  = Math.sin(t * 1.4) * 0.008;
        body.rotation.x  = 0;
        const legL = body.children[6];
        const legR = body.children[7];
        const armL = body.children[4];
        const armR = body.children[5];
        if (legL) legL.rotation.x *= 0.85;
        if (legR) legR.rotation.x *= 0.85;
        if (armL) armL.rotation.x *= 0.85;
        if (armR) armR.rotation.x *= 0.85;
      }
    }

    // ── Share position with camera + interaction system ──────────────────
    if (onPositionUpdate) {
      onPositionUpdate(groupRef.current.position, facingAngleRef.current);
    }

    // ── Reset nearby interactable (only write when value changes) ────────
    // This avoids triggering Zustand re-renders every single frame
    const store = useGameStore.getState();
    if (store.nearbyInteractable !== null || prevNearbyRef.current !== null) {
      store.setNearbyInteractable(null);
    }
    prevNearbyRef.current = null;
  });

  return (
    <group ref={groupRef} position={[0, 0, 3]}>
      <CharacterMesh outfit={outfit} />
      <group name="carryPoint" position={[0, 0.9, 0.3]} />
    </group>
  );
}

export { INTERACT_RANGE };
