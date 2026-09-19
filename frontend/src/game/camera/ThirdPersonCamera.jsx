import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import inputManager from '../systems/InputManager';
import useGameStore from '../../store/useGameStore';

const DEFAULT_DISTANCE = 7;
const MIN_DISTANCE     = 2.5;
const MAX_DISTANCE     = 16;
const MIN_POLAR        = 0.18;   // min vertical angle — keeps ground visible
const MAX_POLAR        = 1.35;   // max vertical angle — don't flip over top
const ROT_SPEED_MOUSE  = 0.004;
const ROT_SPEED_TOUCH  = 0.006;
const FOLLOW_LERP      = 8;      // how fast camera chases player
const TARGET_LERP      = 10;     // how fast aim-point chases player

// Small helper to avoid creating new Vector3 allocations every frame
const _desired = new THREE.Vector3();
const _targetPos = new THREE.Vector3();

export default function ThirdPersonCamera({ playerPositionRef, playerAngleRef }) {
  const { camera } = useThree();

  const yawRef      = useRef(Math.PI); // horizontal angle around player
  const pitchRef    = useRef(0.55);    // vertical angle (radians from straight up)
  const distanceRef = useRef(DEFAULT_DISTANCE);
  const targetRef   = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, delta) => {
    // ── Guard: only run during active gameplay ────────────────────────────
    // FIXED: read state INSIDE useFrame so it's never stale.
    const { screen, settings } = useGameStore.getState();
    if (screen !== 'playing' && screen !== 'tutorial') return;

    const { look, zoom } = inputManager.actions;

    // ── Sensitivity ────────────────────────────────────────────────────────
    const sens = settings.reducedSensitivity ? 0.4 : (settings.controlSensitivity ?? 1.0);
    const rotSpeed = inputManager.inputType === 'touch'
      ? ROT_SPEED_TOUCH * sens
      : ROT_SPEED_MOUSE * sens;

    // ── Camera Rotation ────────────────────────────────────────────────────
    if (Math.abs(look.x) > 0.001 || Math.abs(look.y) > 0.001) {
      yawRef.current   -= look.x * rotSpeed;
      pitchRef.current -= look.y * rotSpeed;
      pitchRef.current  = THREE.MathUtils.clamp(pitchRef.current, MIN_POLAR, MAX_POLAR);
    }

    // ── Camera Assist: gently align behind player while moving ─────────────
    if (settings.cameraAssist) {
      const mv = inputManager.actions.move;
      const isMoving = Math.abs(mv.x) > 0.05 || Math.abs(mv.y) > 0.05;
      const isLooking = Math.abs(look.x) > 0.3;
      if (isMoving && !isLooking && playerAngleRef?.current !== undefined) {
        const targetYaw = playerAngleRef.current + Math.PI;
        const diff = ((targetYaw - yawRef.current + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        yawRef.current += diff * Math.min(0.015, 0.015 * delta * 60);
      }
    }

    // ── Zoom ───────────────────────────────────────────────────────────────
    distanceRef.current -= zoom * 10;
    distanceRef.current  = THREE.MathUtils.clamp(distanceRef.current, MIN_DISTANCE, MAX_DISTANCE);

    // ── Follow player ─────────────────────────────────────────────────────
    const pp = playerPositionRef?.current;
    if (pp) {
      _targetPos.set(pp.x, pp.y + 1.1, pp.z);
      targetRef.current.lerp(_targetPos, Math.min(1, TARGET_LERP * delta));
    }

    // ── Spherical coordinates → world position ────────────────────────────
    const sinPitch = Math.sin(pitchRef.current);
    const cosPitch = Math.cos(pitchRef.current);
    _desired.set(
      targetRef.current.x + distanceRef.current * sinPitch * Math.sin(yawRef.current),
      targetRef.current.y + distanceRef.current * cosPitch,
      targetRef.current.z + distanceRef.current * sinPitch * Math.cos(yawRef.current)
    );

    // ── Prevent camera below ground ────────────────────────────────────────
    _desired.y = Math.max(_desired.y, 0.4);

    // ── Smooth camera follow ───────────────────────────────────────────────
    camera.position.lerp(_desired, Math.min(1, FOLLOW_LERP * delta));
    camera.lookAt(targetRef.current);
  });

  return null;
}
