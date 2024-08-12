// AvatarController.tsx
import {
  Group,
  AnimationMixer,
  AnimationAction,
  Euler,
  Quaternion,
  AnimationClip,
  Vector3,
} from "three";
import { GUI } from "dat.gui";

export class AvatarController {
  private avatar: Group;
  private mixer: AnimationMixer;
  private actions: { [key: string]: AnimationAction } = {};
  private speed: number = 1; // Movement speed
  private isJumping: boolean = false;
  private currentDirection: "left" | "right" | "forward" | "backward" | null =
    null;
  private currentAction: AnimationAction | null = null;
  private targetRotation: Quaternion = new Quaternion();
  private isMoving: boolean = false;
  private isSitting: boolean = false; // Tracks if the avatar is currently sitting

  constructor(avatar: Group, animations: AnimationClip[]) {
    this.avatar = avatar;
    this.mixer = new AnimationMixer(this.avatar);

    // Initialize actions from animation clips
    animations.forEach((clip) => {
      const action = this.mixer.clipAction(clip);
      this.actions[clip.name] = action;
    });

    this.currentAction = this.actions["idle"];
    // this.setupGUI(); // Initialize the GUI
    // this.setupKeyListeners(); // Setup key listeners
  }

  update(delta: number) {
    this.mixer.update(delta); // Update mixer each frame

    // Smoothly rotate the avatar towards the target rotation
    this.avatar.quaternion.slerp(this.targetRotation, 0.1);

    if (this.isJumping) {
      this.avatar.position.y += 0.1 * delta;
      if (this.avatar.position.y > 2) {
        this.isJumping = false;
        this.playAction("idle");
      }
    }

    // Stop walking if no movement is happening
    if (!this.isMoving && this.currentAction?.getClip().name === "walk") {
      this.playAction("idle");
    }

    this.isMoving = false; // Reset the movement flag
  }

  playAction(actionName: string) {
    if (this.actions[actionName]) {
      if (this.currentAction) {
        this.currentAction.fadeOut(0.6); // Smoothly fade out the current action
      }
      this.currentAction = this.actions[actionName];
      this.currentAction.reset().fadeIn(0.6).play();
    }
  }

  moveAndRotate(direction: "left" | "right" | "forward" | "backward") {
    const moveDistance = this.speed * 0.1;
    const rotationAngles = {
      left: Math.PI / 2,
      right: -Math.PI / 2,
      forward: 0,
      backward: Math.PI,
    };

    const directionVector = new Vector3();

    switch (direction) {
      case "left":
        directionVector.set(-moveDistance, 0, 0);
        this.targetRotation.setFromEuler(new Euler(0, rotationAngles.right, 0));
        break;
      case "right":
        directionVector.set(moveDistance, 0, 0);
        this.targetRotation.setFromEuler(new Euler(0, rotationAngles.left, 0));
        break;
      case "forward":
        directionVector.set(0, 0, -moveDistance);
        this.targetRotation.setFromEuler(
          new Euler(0, rotationAngles.backward, 0)
        );
        break;
      case "backward":
        directionVector.set(0, 0, moveDistance);
        this.targetRotation.setFromEuler(
          new Euler(0, rotationAngles.forward, 0)
        );
        break;
    }

    this.avatar.position.add(directionVector);
    this.playAction("walk");
    this.currentDirection = direction;
    this.isMoving = true; // Mark that movement occurred this frame
  }

  toggleSitOrStand() {
    this.isSitting = !this.isSitting;

    if (this.isSitting) {
      this.playAction("sit");
      this.speed = 0; // Stop movement while sitting
    } else {
      this.playAction("idle"); // Transition back to idle when standing
      this.speed = 1; // Reset speed
    }
  }

  jump() {
    if (!this.isJumping && !this.isSitting) {
      // Can't jump while sitting
      this.isJumping = true;
      this.playAction("jump");
    }
  }

  rotate(angle: number, axis: "x" | "y" | "z") {
    const quaternion = new Quaternion();
    switch (axis) {
      case "x":
        quaternion.setFromEuler(new Euler(angle, 0, 0, "XYZ"));
        break;
      case "y":
        quaternion.setFromEuler(new Euler(0, angle, 0, "XYZ"));
        break;
      case "z":
        quaternion.setFromEuler(new Euler(0, 0, angle, "XYZ"));
        break;
    }
    this.avatar.quaternion.multiplyQuaternions(
      quaternion,
      this.avatar.quaternion
    );
  }

  setPosition(x: number, y: number, z: number) {
    this.avatar.position.set(x, y, z);
  }

  setRotation(x: number, y: number, z: number) {
    this.avatar.rotation.set(x, y, z);
  }

  // Setup dat.GUI
  private setupGUI() {
    const gui = new GUI();

    const controls = {
      moveLeft: () => this.moveAndRotate("left"),
      moveRight: () => this.moveAndRotate("right"),
      moveForward: () => this.moveAndRotate("forward"),
      moveBackward: () => this.moveAndRotate("backward"),
      toggleSitOrStand: () => this.toggleSitOrStand(),
      jump: () => this.jump(),
      rotateY: 0,
      speed: this.speed,
    };

    gui.add(controls, "moveLeft").name("Move Left");
    gui.add(controls, "moveRight").name("Move Right");
    gui.add(controls, "moveForward").name("Move Forward");
    gui.add(controls, "moveBackward").name("Move Backward");
    gui.add(controls, "toggleSitOrStand").name("Sit/Stand Toggle");
    gui.add(controls, "jump").name("Jump");

    gui
      .add(controls, "rotateY", -Math.PI, Math.PI)
      .name("Rotate Y")
      .onChange((value: number) => {
        this.rotate(value, "y");
      });

    gui
      .add(controls, "speed", 0.1, 5)
      .name("Speed")
      .onChange((value: number) => {
        this.speed = value;
      });
  }

  // // Setup key listeners for movement and actions
  // private setupKeyListeners() {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     switch (event.key) {
  //       case "ArrowLeft":
  //         this.moveAndRotate("left");
  //         break;
  //       case "ArrowRight":
  //         this.moveAndRotate("right");
  //         break;
  //       case "ArrowUp":
  //         this.moveAndRotate("forward");
  //         break;
  //       case "ArrowDown":
  //         this.moveAndRotate("backward");
  //         break;
  //       case "Shift":
  //         this.toggleSitOrStand();
  //         break;
  //       case " ":
  //         this.jump();
  //         break;
  //     }
  //   };

  //   const handleKeyUp = (event: KeyboardEvent) => {
  //     if (
  //       ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
  //     ) {
  //       this.playAction("idle");
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   window.addEventListener("keyup", handleKeyUp);
  // }
}
