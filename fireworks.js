// 烟花特效类
class Fireworks {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isRunning = false;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    start() {
        this.isRunning = true;
        this.particles = [];
        this.launchFireworks();
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    launchFireworks() {
        if (!this.isRunning) return;
        
        // 发射多个烟花
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createFirework();
            }, i * 200);
        }
        
        // 持续发射
        setTimeout(() => this.launchFireworks(), 1000);
    }
    
    createFirework() {
        const x = Math.random() * this.canvas.width;
        const y = this.canvas.height;
        const targetY = Math.random() * this.canvas.height * 0.6;
        
        const firework = {
            x: x,
            y: y,
            targetY: targetY,
            speed: 2 + Math.random() * 2,
            size: 3,
            color: this.getRandomColor(),
            exploded: false
        };
        
        this.particles.push(firework);
    }
    
    explodeFirework(firework) {
        const particlesCount = 30 + Math.floor(Math.random() * 20);
        
        for (let i = 0; i < particlesCount; i++) {
            const angle = (i / particlesCount) * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            
            this.particles.push({
                x: firework.x,
                y: firework.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 3,
                color: firework.color,
                alpha: 1,
                life: 100 + Math.random() * 50
            });
        }
        
        // 移除原始烟花
        const index = this.particles.indexOf(firework);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (!particle.exploded) {
                // 上升的烟花
                particle.y -= particle.speed;
                
                if (particle.y <= particle.targetY) {
                    particle.exploded = true;
                    this.explodeFirework(particle);
                    continue;
                }
                
                // 绘制上升轨迹
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 尾迹效果
                this.ctx.fillStyle = particle.color + '40';
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y + 10, particle.size * 0.7, 0, Math.PI * 2);
                this.ctx.fill();
                
            } else {
                // 爆炸后的粒子
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.05; // 重力
                particle.alpha -= 0.01;
                particle.life--;
                
                if (particle.life <= 0 || particle.alpha <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
                
                // 绘制爆炸粒子
                this.ctx.fillStyle = particle.color.replace(')', ', ' + particle.alpha + ')');
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    getRandomColor() {
        const colors = [
            '#ff6b6b', '#ff9a3c', '#ff6b9d', // 水果颜色
            '#4ecdc4', '#45b7d1', '#96ceb4', // 明亮颜色
            '#feca57', '#ff9ff3', '#54a0ff'  // 鲜艳颜色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// 全局烟花实例
window.fireworks = new Fireworks();