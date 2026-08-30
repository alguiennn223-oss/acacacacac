import { useEffect, useState, useRef, useCallback } from 'react';

export interface GamepadActions {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onSelectSlot?: () => void; // Enter / Gamepad X / Cross (A)
  onBack?: () => void; // Esc / Gamepad O / Circle (B)
  onToggleTab?: () => void; // L1 / LB / Q
  onToggleTabNext?: () => void; // R1 / RB / E
  onToggleF1?: () => void; // F1
  onDeleteSlot?: () => void; // Delete / Backspace / Square (X on xbox)
}

export function useGamepad(actions: GamepadActions) {
  const [gamepadConnected, setGamepadConnected] = useState<boolean>(false);
  const [gamepadName, setGamepadName] = useState<string>('');
  const [lastAction, setLastAction] = useState<string>('');
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  // Track button states to prevent repeat spamming on single press
  const prevButtonsRef = useRef<{ [key: number]: boolean }>({});
  const prevAxesRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Gamepad polling
  useEffect(() => {
    let animationFrameId: number;

    const handleGamepadConnected = (e: GamepadEvent) => {
      setGamepadConnected(true);
      setGamepadName(e.gamepad.id || 'Gamepad Estándar');
    };

    const handleGamepadDisconnected = () => {
      setGamepadConnected(false);
      setGamepadName('');
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0]; // Primary controller

      if (gp) {
        if (!gamepadConnected) {
          setGamepadConnected(true);
          setGamepadName(gp.id || 'Gamepad');
        }

        const isPressed = (btnIndex: number) => {
          return gp.buttons[btnIndex] && (gp.buttons[btnIndex].pressed || gp.buttons[btnIndex].value > 0.5);
        };

        const prev = prevButtonsRef.current;

        // D-Pad Up (12) or Axis Y < -0.5
        const dpadUp = isPressed(12) || gp.axes[1] < -0.5;
        if (dpadUp && !prev[12] && prevAxesRef.current.y >= -0.3) {
          actionsRef.current.onUp?.();
          setLastAction('D-PAD UP');
        }

        // D-Pad Down (13) or Axis Y > 0.5
        const dpadDown = isPressed(13) || gp.axes[1] > 0.5;
        if (dpadDown && !prev[13] && prevAxesRef.current.y <= 0.3) {
          actionsRef.current.onDown?.();
          setLastAction('D-PAD DOWN');
        }

        // D-Pad Left (14) or Axis X < -0.5
        const dpadLeft = isPressed(14) || gp.axes[0] < -0.5;
        if (dpadLeft && !prev[14] && prevAxesRef.current.x >= -0.3) {
          actionsRef.current.onLeft?.();
          setLastAction('D-PAD LEFT');
        }

        // D-Pad Right (15) or Axis X > 0.5
        const dpadRight = isPressed(15) || gp.axes[0] > 0.5;
        if (dpadRight && !prev[15] && prevAxesRef.current.x <= 0.3) {
          actionsRef.current.onRight?.();
          setLastAction('D-PAD RIGHT');
        }

        // Button A / Cross (0) -> Select Slot / Confirm
        if (isPressed(0) && !prev[0]) {
          actionsRef.current.onSelectSlot?.();
          setLastAction('BUTTON [A / ✕] SELECT');
        }

        // Button B / Circle (1) -> Back / Close
        if (isPressed(1) && !prev[1]) {
          actionsRef.current.onBack?.();
          setLastAction('BUTTON [B / ◯] BACK');
        }

        // Button X / Square (2) -> Delete/Remove player
        if (isPressed(2) && !prev[2]) {
          actionsRef.current.onDeleteSlot?.();
          setLastAction('BUTTON [X / ▢] REMOVE');
        }

        // L1 / LB (4) -> Previous tab (Switch Starting XI / Bench)
        if (isPressed(4) && !prev[4]) {
          actionsRef.current.onToggleTab?.();
          setLastAction('BUTTON [L1 / LB] PREV TAB');
        }

        // R1 / RB (5) -> Next tab
        if (isPressed(5) && !prev[5]) {
          actionsRef.current.onToggleTabNext?.();
          setLastAction('BUTTON [R1 / RB] NEXT TAB');
        }

        // Start button (9) -> F1 Menu toggle
        if (isPressed(9) && !prev[9]) {
          actionsRef.current.onToggleF1?.();
          setLastAction('BUTTON [START] TOGGLE');
        }

        // Save current states
        for (let i = 0; i < gp.buttons.length; i++) {
          prev[i] = isPressed(i);
        }
        prevAxesRef.current = { x: gp.axes[0] || 0, y: gp.axes[1] || 0 };
      }

      animationFrameId = requestAnimationFrame(pollGamepad);
    };

    animationFrameId = requestAnimationFrame(pollGamepad);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [gamepadConnected]);

  // Keyboard navigation listeners (Arrows, Enter, Esc, L1/R1 keys Q/E/PageUp/PageDown, F1, Delete)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // If typing in an input element and not pressing special trigger keys
    const target = e.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    if (e.key === 'F1') {
      e.preventDefault();
      actionsRef.current.onToggleF1?.();
      setLastAction('KEY [F1]');
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      actionsRef.current.onBack?.();
      setLastAction('KEY [ESC]');
      return;
    }

    if (isInput) {
      if (e.key === 'Enter') {
        actionsRef.current.onSelectSlot?.();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        actionsRef.current.onUp?.();
        setLastAction('KEY [↑]');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        actionsRef.current.onDown?.();
        setLastAction('KEY [↓]');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        actionsRef.current.onLeft?.();
        setLastAction('KEY [←]');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        actionsRef.current.onRight?.();
        setLastAction('KEY [→]');
        break;
      case 'Enter':
      case 'x':
      case 'X':
      case ' ':
        e.preventDefault();
        actionsRef.current.onSelectSlot?.();
        setLastAction('KEY [ENTER / X]');
        break;
      case 'q':
      case 'Q':
      case 'PageUp':
        e.preventDefault();
        actionsRef.current.onToggleTab?.();
        setLastAction('KEY [L1 / Q]');
        break;
      case 'e':
      case 'E':
      case 'PageDown':
      case 'Tab':
        e.preventDefault();
        actionsRef.current.onToggleTabNext?.();
        setLastAction('KEY [R1 / E]');
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        actionsRef.current.onDeleteSlot?.();
        setLastAction('KEY [DEL]');
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    gamepadConnected,
    gamepadName,
    lastAction,
  };
}
