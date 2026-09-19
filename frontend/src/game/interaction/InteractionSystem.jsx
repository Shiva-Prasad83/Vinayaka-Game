import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useGameStore from '../../store/useGameStore';
import inputManager from '../systems/InputManager';
import { INTERACT_RANGE } from '../player/PlayerCharacter';

// Registry of all interactables in the scene — populated by useRegisterInteractable
const interactableRegistry = new Map();

export function registerInteractable(id, data) {
  interactableRegistry.set(id, data);
}
export function unregisterInteractable(id) {
  interactableRegistry.delete(id);
}

// Hook: register an interactable object
export function useRegisterInteractable({ id, type, displayName, interactionLabel, position, onInteract, active = true }) {
  // Keep onInteract in a ref so the registry always calls the latest version
  // without needing it in the effect deps (which would cause constant re-registration)
  const onInteractRef = useRef(onInteract);
  useEffect(() => { onInteractRef.current = onInteract; });

  useEffect(() => {
    if (!active) { unregisterInteractable(id); return; }
    registerInteractable(id, {
      id, type, displayName, interactionLabel, position,
      onInteract: (...args) => onInteractRef.current?.(...args),
    });
    return () => unregisterInteractable(id);
  }, [id, active, displayName, interactionLabel, position?.x, position?.z]);
}

let prevInteract = false;

// InteractionSystem — runs every frame, finds nearest interactable
export default function InteractionSystem({ playerPositionRef }) {
  useFrame(() => {
    if (!playerPositionRef?.current) return;
    const pos = playerPositionRef.current;

    let nearest = null;
    let nearestDist = INTERACT_RANGE;

    for (const [, obj] of interactableRegistry) {
      if (!obj.position) continue;
      const dist = new THREE.Vector3(obj.position.x, 0, obj.position.z)
        .distanceTo(new THREE.Vector3(pos.x, 0, pos.z));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = obj;
      }
    }

    useGameStore.getState().setNearbyInteractable(nearest || null);

    // Trigger on interact key press (edge detection)
    const interactNow = inputManager.actions.interact;
    if (interactNow && !prevInteract && nearest) {
      nearest.onInteract?.();
    }
    prevInteract = interactNow;
  });

  return null;
}
