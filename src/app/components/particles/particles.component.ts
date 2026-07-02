import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationTemplateId } from '../../lib/templates';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  angle: number;
  spin: number;
  spinSpeed: number;
  color: string;
  type: 'petal' | 'leaf' | 'gold' | 'snow';
}

@Component({
  selector: 'app-particles',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvasRef class="pointer-events-none absolute inset-0 z-[2] block h-full w-full"></canvas>`,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 2;
    }
  `],
})
export class ParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() template!: InvitationTemplateId;
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D | null;
  private animationFrameId?: number;
  private particles: Particle[] = [];
  private maxParticles = 35;

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.initParticles();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    }
  }

  private getParticleType(): 'petal' | 'leaf' | 'gold' | 'snow' {
    switch (this.template) {
      // Royal & Dark & Modern gradients get glowing gold shimmer
      case 'emerald-gold-royal':
      case 'dark-elegant-premium':
      case 'gradient-wave-modern':
      case 'animated-particle':
      case 'burgundy-gold-floral':
        return 'gold';

      // Botanicals get soft falling green leaves
      case 'botanical-watercolor':
      case 'sage-save-date':
        return 'leaf';

      // Japanese/Geo gets clean white snow dots
      case 'minimalist-japanese':
      case 'geometric-modern':
      case 'neumorphism-soft':
        return 'snow';

      // Florals and glassmorphism get soft falling rose petals
      default:
        return 'petal';
    }
  }

  private getParticleColor(type: 'petal' | 'leaf' | 'gold' | 'snow'): string {
    switch (type) {
      case 'gold':
        // Shimmering golds
        const goldColors = ['#ffd700', '#f5ebd0', '#e6c773', '#b89430'];
        return goldColors[Math.floor(Math.random() * goldColors.length)];
      case 'leaf':
        // Sage and olive greens
        const leafColors = ['#88a97a', '#a3b899', '#6b825f', '#d2ded0'];
        return leafColors[Math.floor(Math.random() * leafColors.length)];
      case 'snow':
        return '#ffffff';
      case 'petal':
      default:
        // Soft pinks/blush rose tones
        const petalColors = ['#ffc0cb', '#ffe4e1', '#fbc9d8', '#f5becb'];
        return petalColors[Math.floor(Math.random() * petalColors.length)];
    }
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const type = this.getParticleType();
    this.particles = [];

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(canvas.width, canvas.height, type, true));
    }
  }

  private createParticle(
    width: number,
    height: number,
    type: 'petal' | 'leaf' | 'gold' | 'snow',
    randomY = false
  ): Particle {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      size: Math.random() * (type === 'gold' ? 3 : type === 'snow' ? 4 : 12) + (type === 'gold' || type === 'snow' ? 1.5 : 6),
      opacity: Math.random() * 0.6 + 0.2,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1.2 + (type === 'gold' || type === 'snow' ? 0.6 : 0.8),
      angle: Math.random() * 360,
      spin: Math.random() * 360,
      spinSpeed: (Math.random() * 2 - 1) * 0.02,
      color: this.getParticleColor(type),
      type,
    };
  }

  private drawPetal(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.spin * Math.PI) / 180);
    ctx.beginPath();
    // Beautiful organic petal shape using Bezier curves
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
    ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.restore();
  }

  private drawLeaf(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.spin * Math.PI) / 180);
    ctx.beginPath();
    // Pointy elegant leaf shape
    ctx.moveTo(0, -p.size / 2);
    ctx.quadraticCurveTo(-p.size / 2, 0, 0, p.size / 2);
    ctx.quadraticCurveTo(p.size / 2, 0, 0, -p.size / 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.restore();
  }

  private drawGold(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    // Draw with radial gradient for shimmering glow
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.restore();
  }

  private drawSnow(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.restore();
  }

  private animate = (): void => {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = this.ctx;

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const type = this.getParticleType();

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Render correct particle type
      if (p.type === 'petal') {
        this.drawPetal(ctx, p);
      } else if (p.type === 'leaf') {
        this.drawLeaf(ctx, p);
      } else if (p.type === 'gold') {
        this.drawGold(ctx, p);
      } else {
        this.drawSnow(ctx, p);
      }

      // Update positions
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.angle) * 0.3;
      p.angle += 0.01;
      p.spin += p.spinSpeed * 10;

      // Recycle particles falling off bottom or sides
      if (p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
        this.particles[i] = this.createParticle(canvas.width, canvas.height, type, false);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
